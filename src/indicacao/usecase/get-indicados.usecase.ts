import { Injectable } from '@nestjs/common';
import { CashbackConsumerRepository } from '../repository/cashback-consumer.repository';

export interface GetIndicadosRequest {
  consumerId: string;
}

export interface IndicadoItem {
  id: string;
  username: string;
  full_name: string | null;
  referral_status: string;
  level: 1 | 2;
  created_at: Date;
}

export interface GetIndicadosResponse {
  indicados: IndicadoItem[];
}

@Injectable()
export class GetIndicadosUseCase {
  constructor(
    private readonly cashbackConsumerRepository: CashbackConsumerRepository,
  ) {}

  async execute(request: GetIndicadosRequest): Promise<GetIndicadosResponse> {
    const rawReferrals = await this.cashbackConsumerRepository.findReferrals(request.consumerId);

    const indicados: IndicadoItem[] = rawReferrals.map((item) => {
      // Nível 1: se foi indicado diretamente por este consumidor
      // Nível 2: se foi indicado indiretamente (referred_by_level2)
      const level = item.referred_by === request.consumerId ? 1 : 2;

      return {
        id: item.id,
        username: item.username,
        full_name: item.full_name,
        referral_status: item.referral_status,
        level,
        created_at: item.created_at,
      };
    });

    return { indicados };
  }
}
