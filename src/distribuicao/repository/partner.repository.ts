import { Inject, Injectable, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';

@Injectable()
export class PartnerRepository {
  private readonly logger = new Logger(PartnerRepository.name);

  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  /** Busca o nome do parceiro/loja pelo ID */
  async findNameById(partnerId: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabase
        .from('partners')
        .select('name')
        .eq('id', partnerId)
        .maybeSingle();

      if (error) {
        this.logger.warn(`Erro ao buscar partner ${partnerId}: ${error.message}`);
        return null;
      }

      return data?.name ?? null;
    } catch (err) {
      this.logger.warn(`Falha ao buscar nome do partner ${partnerId}: ${err}`);
      return null;
    }
  }
}
