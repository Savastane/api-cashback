import { Inject, Injectable, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { ConsumerModel } from '../../model/consumer.model';

@Injectable()
export class ConsumerRepository {
  private readonly logger = new Logger(ConsumerRepository.name);

  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  /** Busca um consumer do schema public pelo ID */
  async findById(id: string): Promise<ConsumerModel | null> {
    const { data, error } = await this.supabase
      .from('consumer')
      .select(
        'id, email, full_name, avatar_url, phone, created_at, updated_at, ' +
          'phone_verified, is_2fa_enabled, preferred_2fa_method, userid, provider_type, ' +
          'total_orders, total_reviews, total_points, saved_amount, document, ' +
          'billing_full_name, whatsapp_number, sms_number, external_id, nickname, referral_id',
      )
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Erro ao buscar consumer por ID: ${error.message}`);
    }
    if (!data) return null;

    const row = data as unknown as Record<string, unknown>;
    return {
      ...row,
      created_at: new Date(row.created_at as string),
      updated_at: new Date(row.updated_at as string),
    } as unknown as ConsumerModel;
  }

  /** Busca consumers pelo ID em lote (útil para resolver nomes/telefones da rede) */
  async findByIds(ids: string[]): Promise<ConsumerModel[]> {
    if (!ids.length) return [];

    const { data, error } = await this.supabase
      .from('consumer')
      .select(
        'id, email, full_name, avatar_url, phone, created_at, updated_at, ' +
          'phone_verified, is_2fa_enabled, preferred_2fa_method, userid, provider_type, ' +
          'total_orders, total_reviews, total_points, saved_amount, document, ' +
          'billing_full_name, whatsapp_number, sms_number, external_id, nickname, referral_id',
      )
      .in('id', ids);

    if (error) {
      this.logger.warn(`Erro ao buscar consumers por IDs: ${error.message}`);
      return [];
    }

    return (data ?? []).map((row) => {
      const r = row as unknown as Record<string, unknown>;
      return {
        ...r,
        created_at: new Date(r.created_at as string),
        updated_at: new Date(r.updated_at as string),
      } as unknown as ConsumerModel;
    });
  }

  /** Busca apenas o telefone de um consumer pelo ID */
  async findPhoneById(id: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('consumer')
      .select('phone, whatsapp_number')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      this.logger.warn(`Erro ao buscar phone do consumer ${id}: ${error.message}`);
      return null;
    }

    if (!data) return null;
    return data.whatsapp_number ?? data.phone ?? null;
  }

  /** Busca o telefone de múltiplos consumers em lote, retornando um Map<consumerId, phone> */
  async findPhonesByIds(ids: string[]): Promise<Map<string, string>> {
    const phoneMap = new Map<string, string>();
    if (!ids.length) return phoneMap;

    const { data, error } = await this.supabase
      .from('consumer')
      .select('id, phone, whatsapp_number')
      .in('id', ids);

    if (error) {
      this.logger.warn(`Erro ao buscar phones em lote: ${error.message}`);
      return phoneMap;
    }

    for (const row of data ?? []) {
      const phone = row.whatsapp_number ?? row.phone;
      if (phone) phoneMap.set(row.id, phone);
    }

    return phoneMap;
  }
}
