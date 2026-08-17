import { randomUUID } from 'crypto';
import { Injectable, BadRequestException, Inject, Logger } from '@nestjs/common';
import { PayableRepository } from '../repository/payable.repository';
import { CashbackRatesRepository } from '../repository/cashback-rates.repository';
import { CashbackTransactionRepository } from '../repository/cashback-transaction.repository';
import { ConsumerRepository } from '../repository/consumer.repository';
import { PartnerRepository } from '../repository/partner.repository';
import { ProduceService } from '../../service/produce.service';
import { CashbackTransaction } from '../../model/cashback-transaction.model';
import { CashbackConsumer } from '../../model/cashback-consumer.model';

// ─── Contratos Request / Response ─────────────────────────────────────────────

export interface DistribuirCashbackRequest {
  payable_id: string;
}

export interface DistribuirCashbackResponse {
  payable_id: string;
  order_value: number;
  transactions: CashbackTransaction[];
  /** `true` quando o payable já havia sido distribuído e nada foi criado nesta chamada */
  already_distributed: boolean;
}

// Interface mínima que qualquer repositório de consumer precisa prover
interface ConsumerRepo {
  findById(id: string): Promise<CashbackConsumer | null>;
}

// ─── Constantes das filas ─────────────────────────────────────────────────────

const EXCHANGE = 'whatsapp';
const QUEUE_COMPRA = 'whatsapp_cashback_compra';
const QUEUE_REDE = 'whatsapp_cashback_rede';
const ROUTING_KEY_COMPRA = 'cashback-compra';
const ROUTING_KEY_REDE = 'cashback-rede';

// ─── Use Case ─────────────────────────────────────────────────────────────────

@Injectable()
export class DistribuirCashbackUseCase {
  private readonly logger = new Logger(DistribuirCashbackUseCase.name);

  constructor(
    private readonly payableRepository: PayableRepository,
    private readonly ratesRepository: CashbackRatesRepository,
    private readonly transactionRepository: CashbackTransactionRepository,
    private readonly consumerRepository: ConsumerRepository,
    private readonly partnerRepository: PartnerRepository,
    private readonly produceService: ProduceService,
    @Inject('CASHBACK_CONSUMER_REPO') private readonly consumerRepo: ConsumerRepo,
  ) {}

  async execute(request: DistribuirCashbackRequest): Promise<DistribuirCashbackResponse> {
    // 1. Buscar o payable
    const payable = await this.payableRepository.findById(request.payable_id);
    if (!payable) {
      throw new BadRequestException('Payable não encontrado');
    }
    if (!payable.consumer_id) {
      throw new BadRequestException('Payable sem consumer_id vinculado');
    }
    if (!payable.order_value) {
      throw new BadRequestException('Payable sem order_value definido');
    }

    // 2. Idempotência — se o payable já foi distribuído, devolver as transações existentes
    const distributed = await this.transactionRepository.findDistributedByPayableId(payable.id!);
    if (distributed.length > 0) {
      return {
        payable_id: payable.id!,
        order_value: payable.order_value,
        transactions: distributed,
        already_distributed: true,
      };
    }

    // 3. Buscar o consumer nível 0 (dono da compra)
    const consumer = await this.consumerRepo.findById(payable.consumer_id);
    if (!consumer) {
      throw new BadRequestException('Consumer do payable não encontrado na rede de cashback');
    }

    // 4. Buscar a taxa ativa
    const rates = await this.ratesRepository.findActive();
    if (!rates) {
      throw new BadRequestException('Nenhuma taxa de cashback ativa encontrada');
    }

    const orderValue = payable.order_value;
    const payableId = payable.id!;
    const orderId = payable.order_id ?? null;
    const now = new Date();
    const transactions: CashbackTransaction[] = [];

    // ── Coletar IDs para batch lookup de phones ────────────────────────────
    const consumerIdsForPhone = new Set<string>();
    consumerIdsForPhone.add(consumer.id);
    if (consumer.referred_by) consumerIdsForPhone.add(consumer.referred_by);
    if (consumer.referred_by_level2) consumerIdsForPhone.add(consumer.referred_by_level2);

    // Buscar phones (whatsapp_number do schema public) e nome do parceiro em paralelo
    const [phoneMap, partnerName] = await Promise.all([
      this.consumerRepository.findPhonesByIds([...consumerIdsForPhone]),
      payable.partner_id
        ? this.partnerRepository.findNameById(payable.partner_id)
        : Promise.resolve(null),
    ]);

    const storeName = partnerName ?? 'RedeCity';
    const buyerName = payable.consumer_name ?? consumer.full_name ?? consumer.username;

    // ── 5. Transações de Cashback com Idempotência ────────────────────────
    let amount0 = 0;
    let amount1 = 0;
    let amount2 = 0;

    try {
      // Transação nível 0 — o consumer que realizou a compra
      amount0 = this.calcPercent(orderValue, rates.percentage_0);
      if (amount0 > 0) {
        const tx0 = await this.transactionRepository.create({
          consumer_id: consumer.id,
          type: 'purchase_cashback',
          direction: 'in',
          amount: amount0,
          payable_id: payableId,
          order_id: orderId,
          description: 'CashBack Compras',
          occurred_at: now,
          transaction_id: null,
        });
        transactions.push(tx0);
      }

      // Transação nível 1 — quem indicou o consumer (referred_by)
      if (consumer.referred_by) {
        amount1 = this.calcPercent(orderValue, rates.percentage_1);
        if (amount1 > 0) {
          const tx1 = await this.transactionRepository.create({
            consumer_id: consumer.referred_by,
            type: 'referral_cashback',
            direction: 'in',
            amount: amount1,
            payable_id: payableId,
            order_id: orderId,
            description: 'CashBack Compras Indicado',
            occurred_at: now,
            transaction_id: null,
          });
          transactions.push(tx1);
        }

        // Transação nível 2 — quem indicou o indicador
        if (consumer.referred_by_level2) {
          amount2 = this.calcPercent(orderValue, rates.percentage_2);
          if (amount2 > 0) {
            const tx2 = await this.transactionRepository.create({
              consumer_id: consumer.referred_by_level2,
              type: 'referral_cashback',
              direction: 'in',
              amount: amount2,
              payable_id: payableId,
              order_id: orderId,
              description: 'CashBack Compras Indicado',
              occurred_at: now,
              transaction_id: null,
            });
            transactions.push(tx2);
          }
        }
      }
    } catch (err: any) {
      // Se houver concorrência (ex: 2 workers processando o mesmo payable simultaneamente),
      // a constraint unique do banco barra e nós recuperamos as transações já criadas
      const alreadyCreated = await this.transactionRepository.findDistributedByPayableId(payableId);
      if (alreadyCreated.length > 0) {
        this.logger.warn(
          `Concorrência detectada: payable ${payableId} já foi distribuído por outro worker.`,
        );
        return {
          payable_id: payableId,
          order_value: orderValue,
          transactions: alreadyCreated,
          already_distributed: true,
        };
      }
      throw err;
    }

    // ── 8. Publicar mensagens nas filas (fire-and-forget) ──────────────────
    const totalRede = amount1 + amount2;
 
    
    // Fila de compra própria (nível 0) -> whatsapp_cashback_compra sava
    if (amount0 > 0) {
      const phone0 = phoneMap.get(consumer.id) ?? null;
      this.logger.log(
        `[NÍVEL 0 - COMPRA] consumerId=${consumer.id} | consumerName="${buyerName}" | ` +
        `cashbackValor=${amount0.toFixed(2)} | origemName="${storeName}" | ` +
        `redeNome="${storeName}" | cashbackValor1=${totalRede.toFixed(2)} | ` +
        `phone="${phone0}" | queue=${QUEUE_COMPRA} | routingKey=${ROUTING_KEY_COMPRA}`,
      );
      await this.publishCashbackMessage({
        consumerId: consumer.id,
        consumerName: buyerName,
        cashbackValor: amount0,
        origemName: storeName,
        redeNome: storeName,
        cashbackValor1: totalRede,
        phoneMap,
        routingKey: ROUTING_KEY_COMPRA,
        queueName: QUEUE_COMPRA,
      });
    }

    // Filas da rede (níveis 1 e 2) -> whatsapp_cashback_rede
    if (amount1 > 0 && consumer.referred_by) {
      const ref1Consumer = await this.consumerRepo.findById(consumer.referred_by);
      const ref1Name = ref1Consumer?.full_name ?? ref1Consumer?.username ?? consumer.referred_by;
      await this.publishCashbackMessage({
        consumerId: consumer.referred_by,
        consumerName: ref1Name,
        cashbackValor: amount1,
        origemName: storeName,
        redeNome: buyerName,
        cashbackValor1: amount0,
        phoneMap,
        routingKey: ROUTING_KEY_REDE,
        queueName: QUEUE_REDE,
      });
    }

    if (amount2 > 0 && consumer.referred_by_level2) {
      const ref2Consumer = await this.consumerRepo.findById(consumer.referred_by_level2);
      const ref2Name = ref2Consumer?.full_name ?? ref2Consumer?.username ?? consumer.referred_by_level2;
      await this.publishCashbackMessage({
        consumerId: consumer.referred_by_level2,
        consumerName: ref2Name,
        cashbackValor: amount2,
        origemName: storeName,
        redeNome: buyerName,
        cashbackValor1: amount0,
        phoneMap,
        routingKey: ROUTING_KEY_REDE,
        queueName: QUEUE_REDE,
      });
    }

    return {
      payable_id: payableId,
      order_value: orderValue,
      transactions,
      already_distributed: false,
    };
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  /** Calcula o percentual arredondado em 2 casas decimais */
  private calcPercent(value: number, percentage: number): number {
    return Math.round((value * percentage) / 100 * 100) / 100;
  }

  /** Formata valor numérico como string de moeda (ex: "5.00") */
  private formatCurrency(value: number): string {
    return value.toFixed(2);
  }

  /** Publica uma mensagem de cashback na fila (não lança exceção em caso de falha) */
  private async publishCashbackMessage(params: {
    consumerId: string;
    consumerName: string;
    cashbackValor: number;
    origemName: string;
    redeNome: string;
    cashbackValor1: number;
    phoneMap: Map<string, string>;
    routingKey: string;
    queueName: string;
  }): Promise<void> {
    


    const phone = params.phoneMap.get(params.consumerId);
    if (!phone) {
      this.logger.warn(
        `Phone não encontrado para consumer ${params.consumerId} — mensagem para fila "${params.routingKey}" não será enviada`,
      );
      return;
    }

    try {
      await this.produceService.publish({
        id: randomUUID(),
        exchange: EXCHANGE,
        queue: params.queueName,
        routingKey: params.routingKey,
        data: {
          phone,
          consumerName: params.consumerName,
          cashbackValor: this.formatCurrency(params.cashbackValor),
          origemName: params.origemName,
          redeNome: params.redeNome,
          cashbackValor1: this.formatCurrency(params.cashbackValor1),
        },
        timestamp: new Date().toISOString(),
      });

      this.logger.log(
        `Mensagem publicada: routingKey=${params.routingKey} consumer=${params.consumerId} valor=${params.cashbackValor}`,
      );
    } catch (err) {
      this.logger.error(
        `Falha ao publicar mensagem na fila "${params.routingKey}" para consumer ${params.consumerId}: ${err}`,
      );
    }
  }
}
