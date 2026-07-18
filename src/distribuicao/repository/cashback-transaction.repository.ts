import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { CashbackTransaction } from '../../model/cashback-transaction.model';

export type CreateTransactionInput = Omit<CashbackTransaction, 'id' | 'created_at'>;

@Injectable()
export class CashbackTransactionRepository {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async create(input: CreateTransactionInput): Promise<CashbackTransaction> {
    const { data, error } = await this.supabase
      .schema('cashback')
      .from('transaction')
      .insert({
        consumer_id: input.consumer_id,
        type: input.type,
        direction: input.direction,
        amount: input.amount,
        payable_id: input.payable_id,
        order_id: input.order_id,
        description: input.description,
        occurred_at: input.occurred_at,
        transaction_id: input.transaction_id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar transação de cashback: ${error.message}`);
    }
    return {
      ...data,
      occurred_at: new Date(data.occurred_at),
      created_at: new Date(data.created_at),
    } as CashbackTransaction;
  }

  async createMany(inputs: CreateTransactionInput[]): Promise<CashbackTransaction[]> {
    const results: CashbackTransaction[] = [];
    for (const input of inputs) {
      results.push(await this.create(input));
    }
    return results;
  }
}
