import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { CashbackConsumer, ReferralStatus } from '../../model/cashback-consumer.model';

@Injectable()
export class CashbackConsumerRepository {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) { }

  async findById(id: string): Promise<CashbackConsumer | null> {
    const { data, error } = await this.supabase
      .schema('cashback')
      .from('consumer')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Erro ao buscar consumer por ID: ${error.message}`);
    }
    return data as CashbackConsumer | null;
  }

  async findByReferralCode(code: string): Promise<CashbackConsumer | null> {
    const { data, error } = await this.supabase
      .schema('cashback')
      .from('consumer')
      .select('*')
      .eq('referral_code', code)
      .maybeSingle();

    if (error) {
      throw new Error(`Erro ao buscar consumer por código de indicação: ${error.message}`);
    }
    return data as CashbackConsumer | null;
  }

  async create(consumer: Omit<CashbackConsumer, 'created_at' | 'updated_at'> & { created_at?: Date; updated_at?: Date }): Promise<CashbackConsumer> {
    const { data, error } = await this.supabase
      .schema('cashback')
      .from('consumer')
      .insert({
        id: consumer.id,
        referral_code: consumer.referral_code,
        referred_by: consumer.referred_by,
        referred_by_level2: consumer.referred_by_level2,
        username: consumer.username,
        full_name: consumer.full_name,
        referral_status: consumer.referral_status,
        cashback_balance: consumer.cashback_balance,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao cadastrar indicação no banco: ${error.message}`);
    }
    return {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    } as CashbackConsumer;
  }

  async updateStatus(id: string, status: ReferralStatus): Promise<CashbackConsumer> {
    const { data, error } = await this.supabase
      .schema('cashback')
      .from('consumer')
      .update({ referral_status: status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar status da indicação no banco: ${error.message}`);
    }
    return {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    } as CashbackConsumer;
  }
}
