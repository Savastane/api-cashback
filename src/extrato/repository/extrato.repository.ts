import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { CashbackConsumer } from '../../model/cashback-consumer.model';
import { CashbackTransaction } from '../../model/cashback-transaction.model';

@Injectable()
export class ExtratoRepository {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async findConsumerById(id: string): Promise<CashbackConsumer | null> {
    const { data, error } = await this.supabase
      .schema('cashback')
      .from('consumer')
      .select('id, cashback_balance, referral_status')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(`Erro ao buscar consumer: ${error.message}`);
    return data as CashbackConsumer | null;
  }

  async findTransactionsByConsumerId(consumerId: string): Promise<CashbackTransaction[]> {
    const { data, error } = await this.supabase
      .schema('cashback')
      .from('transaction')
      .select('*')
      .eq('consumer_id', consumerId)
      .order('occurred_at', { ascending: false });

    if (error) throw new Error(`Erro ao buscar transações: ${error.message}`);
    return (data ?? []) as CashbackTransaction[];
  }
}
