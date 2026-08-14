import { Inject, Injectable, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';

export interface UserPhone {
  id: string;
  phone: string;
}

@Injectable()
export class UserProfileRepository {
  private readonly logger = new Logger(UserProfileRepository.name);

  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  /** Busca os telefones de múltiplos usuários pelos IDs */
  async findPhonesByIds(ids: string[]): Promise<Map<string, string>> {
    const phoneMap = new Map<string, string>();
    if (!ids.length) return phoneMap;

    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('id, phone')
        .in('id', ids);

      if (!error && data) {
        for (const row of data) {
          if (row.phone) phoneMap.set(row.id, row.phone);
        }
      }
    } catch (err) {
      this.logger.warn(`Falha ao buscar phones da tabela profiles: ${err}`);
    }

    // Fallback: tenta buscar via auth.users (requer service_role, pode falhar com anon key)
    if (phoneMap.size < ids.length) {
      const missing = ids.filter((id) => !phoneMap.has(id));
      try {
        for (const id of missing) {
          const { data } = await this.supabase.auth.admin.getUserById(id);
          if (data?.user?.phone) {
            phoneMap.set(id, data.user.phone);
          }
        }
      } catch {
        this.logger.warn(
          `Não foi possível buscar phones via auth.admin (requer service_role key). ` +
          `Phones ausentes para ${missing.length} consumidores.`,
        );
      }
    }

    return phoneMap;
  }
}
