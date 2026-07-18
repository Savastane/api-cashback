export interface PayableModel {
  id?: string;
  partner_id: string;
  order_id?: string | null;
  schedule_date?: string | null;
  order_value?: number | null;
  amount?: string | null;
  status?: string | null;
  gateway_confirmation_date?: string | null;
  gateway_payment_date?: string | null;
  expected_date?: string | null;
  scheduled_date?: string | null;
  payment_date?: string | null;
  payment_batch_id?: string | null;
  token_date?: string | null;
  token?: string | null;
  consumer_id?: string | null;
  consumer_name?: string | null;
  promotion_name?: string | null;
  promotion_id?: string | null;
  type_payable?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export type CreatePayableInput = Omit<
  PayableModel,
  "created_at" | "updated_at"
>;

export type UpdatePayableInput = Partial<
  Omit<PayableModel, "id" | "created_at" | "updated_at">
>;
