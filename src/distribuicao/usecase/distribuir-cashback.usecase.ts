import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { PayableRepository } from '../repository/payable.repository';
import { CashbackRatesRepository } from '../repository/cashback-rates.repository';
import { CashbackTransactionRepository } from '../repository/cashback-transaction.repository';
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
}

// Interface mínima que qualquer repositório de consumer precisa prover
interface ConsumerRepo {
  findById(id: string): Promise<CashbackConsumer | null>;
}

// ─── Use Case ─────────────────────────────────────────────────────────────────

@Injectable()
export class DistribuirCashbackUseCase {
  constructor(
    private readonly payableRepository: PayableRepository,
    private readonly ratesRepository: CashbackRatesRepository,
    private readonly transactionRepository: CashbackTransactionRepository,
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

    // 2. Buscar o consumer nível 0 (dono da compra)
    const consumer = await this.consumerRepo.findById(payable.consumer_id);
    if (!consumer) {
      throw new BadRequestException('Consumer do payable não encontrado na rede de cashback');
    }

    // 3. Buscar a taxa ativa
    const rates = await this.ratesRepository.findActive();
    if (!rates) {
      throw new BadRequestException('Nenhuma taxa de cashback ativa encontrada');
    }

    const orderValue = payable.order_value;
    const payableId = payable.id!;
    const orderId = payable.order_id ?? null;
    const now = new Date();
    const transactions: CashbackTransaction[] = [];

    // 4. Transação nível 0 — o consumer que realizou a compra
    const amount0 = this.calcPercent(orderValue, rates.percentage_0);
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

    // 5. Transação nível 1 — quem indicou o consumer (referred_by)
    if (consumer.referred_by) {
      const amount1 = this.calcPercent(orderValue, rates.percentage_1);
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

      // 6. Transação nível 2 — quem indicou o indicador (referred_by_level2)
      if (consumer.referred_by_level2) {
        const amount2 = this.calcPercent(orderValue, rates.percentage_2);
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

    return {
      payable_id: payableId,
      order_value: orderValue,
      transactions,
    };
  }

  /** Calcula o percentual arredondado em 2 casas decimais */
  private calcPercent(value: number, percentage: number): number {
    return Math.round((value * percentage) / 100 * 100) / 100;
  }
}
