export type CashbackTransactionType = 
  | 'purchase_cashback' 
  | 'referral_cashback' 
  | 'redemption' 
  | 'adjustment'
  | 'balancemonth';

export type CashbackTransactionDirection = 'in' | 'out';

export interface CashbackTransaction {
  id: string;
  consumer_id: string;
  type: CashbackTransactionType;
  direction: CashbackTransactionDirection;
  amount: number;
  payable_id: string | null;
  order_id: string | null;
  description: string | null;
  occurred_at: Date;
  created_at: Date;
  transaction_id: string | null;
}
