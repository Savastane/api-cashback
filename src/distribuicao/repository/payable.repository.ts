import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { PayableModel } from '../../model/payable.model';

@Injectable()
export class PayableRepository {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async findById(id: string): Promise<PayableModel | null> {
    const { data, error } = await this.supabase
      .from('payable')
      .select('id, consumer_id, order_value, order_id, partner_id, status')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Erro ao buscar payable por ID: ${error.message}`);
    }
    return data as PayableModel | null;
  }
}
