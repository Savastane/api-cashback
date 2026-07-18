import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { CashbackRates } from '../../model/cashback-rates.model';

@Injectable()
export class CashbackRatesRepository {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) { }

  async findActive(): Promise<CashbackRates | null> {
    const { data, error } = await this.supabase
      .schema('cashback')
      .from('rates')
      .select('*')
      .eq('active', true)
      .maybeSingle();

    if (error) {
      throw new Error(`Erro ao buscar taxa ativa de cashback: ${error.message}`);
    }
    return data
      ? { ...data, created_at: new Date(data.created_at) }
      : null;
  }
}
