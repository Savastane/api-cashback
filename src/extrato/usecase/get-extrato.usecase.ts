import { Injectable, NotFoundException } from '@nestjs/common';
import { ExtratoRepository } from '../repository/extrato.repository';
import { CashbackTransactionType } from '../../model/cashback-transaction.model';

// ─── Response Contract (espelhado no frontend cashbackModel.ts) ───────────────

export interface ExtratoBalanceResponse {
  balance: number;
  description: string;
}

export interface ExtratoTransactionItem {
  id: string;
  title: string;
  date: string;           // ex: "25 Ago 2024"
  type: 'Entrada' | 'Uso' | 'Saida';
  amount: number;         // negativo para saídas
  iconType: 'plus' | 'cart' | 'bill';
  rawType: string;
  description: string | null;
}

export interface GetExtratoResponse {
  balance: ExtratoBalanceResponse;
  transactions: ExtratoTransactionItem[];
}

// ─── Request ──────────────────────────────────────────────────────────────────

export interface GetExtratoRequest {
  consumerId: string;
}

// ─── Mapeamentos de tipo → apresentação ──────────────────────────────────────

const TITLE_MAP: Record<CashbackTransactionType, string> = {
  purchase_cashback: 'CashBack Compras',
  referral_cashback: 'Cash Back Indicado',
  redemption: 'Desconto em Compra',
  adjustment: 'Ajuste',
  balancemonth: 'Saldo do Mês',
};

const ICON_MAP: Record<CashbackTransactionType, 'plus' | 'cart' | 'bill'> = {
  purchase_cashback: 'cart',
  referral_cashback: 'plus',
  redemption: 'bill',
  adjustment: 'bill',
  balancemonth: 'bill',
};

const PT_MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

function formatDate(date: Date | string): string {
  const d = new Date(date);
  const day = d.getDate();
  const month = PT_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

// ─── Use Case ─────────────────────────────────────────────────────────────────

@Injectable()
export class GetExtratoUseCase {
  constructor(private readonly extratoRepository: ExtratoRepository) {}

  async execute(request: GetExtratoRequest): Promise<GetExtratoResponse> {
    const consumer = await this.extratoRepository.findConsumerById(request.consumerId);
    if (!consumer) {
      throw new NotFoundException('Consumer não encontrado na rede de cashback');
    }

    const rawTransactions = await this.extratoRepository.findTransactionsByConsumerId(
      request.consumerId,
    );

    // Garantir ordenação decrescente por data/hora do extrato
    const sortedRaw = [...rawTransactions].sort(
      (a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime(),
    );

    const transactions: ExtratoTransactionItem[] = sortedRaw.map((tx) => {
      const isOut = tx.direction === 'out';
      const txType = tx.type as CashbackTransactionType;

      return {
        id: tx.id,
        title: TITLE_MAP[txType] ?? tx.description ?? tx.type,
        date: formatDate(tx.occurred_at),
        type: isOut ? (txType === 'redemption' ? 'Uso' : 'Saida') : 'Entrada',
        amount: isOut ? -Math.abs(tx.amount) : tx.amount,
        iconType: ICON_MAP[txType] ?? 'cart',
        rawType: txType,
        description: tx.description,
      };
    });

    return {
      balance: {
        balance: Number(consumer.cashback_balance),
        description: 'Saldo exclusivo para descontos em novos serviços.',
      },
      transactions,
    };
  }
}
