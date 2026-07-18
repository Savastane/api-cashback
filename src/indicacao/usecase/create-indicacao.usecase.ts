import { Injectable, BadRequestException } from '@nestjs/common';
import { CashbackConsumerRepository } from '../repository/cashback-consumer.repository';
import { CashbackConsumer } from '../../model/cashback-consumer.model';

export interface CreateIndicacaoRequest {
  id: string;
  username: string;
  full_name?: string | null;
  referralCodeUsed: string;
  referralCode?: string;
}

export interface CreateIndicacaoResponse {
  id: string;
  username: string;
  full_name: string | null;
  referral_code: string;
  referred_by: string | null;
  referred_by_level2: string | null;
  referral_status: 'pending' | 'active';
  cashback_balance: number;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class CreateIndicacaoUseCase {
  constructor(
    private readonly cashbackConsumerRepository: CashbackConsumerRepository,
  ) {}

  async execute(request: CreateIndicacaoRequest): Promise<CreateIndicacaoResponse> {
    // 1. Verificar se o consumidor já está cadastrado
    const existingConsumer = await this.cashbackConsumerRepository.findById(request.id);
    if (existingConsumer) {
      throw new BadRequestException('Consumidor já cadastrado na rede de cashback');
    }

    // 2. Buscar o indicador (referred_by) pelo código de indicação usado
    const referrer = await this.cashbackConsumerRepository.findByReferralCode(request.referralCodeUsed);
    if (!referrer) {
      throw new BadRequestException('Código de indicação inválido ou não encontrado');
    }

    // 3. Obter os IDs de referenciadores nível 1 e nível 2
    const referred_by = referrer.id;
    const referred_by_level2 = referrer.referred_by; // O indicador do indicador (cópia desnormalizada de referred_by.referred_by)

    // 4. Determinar o código de indicação do próprio novo consumidor
    const referral_code = request.referralCode || request.username.toLowerCase().trim();

    // 5. Salvar o novo consumidor
    const newConsumer = await this.cashbackConsumerRepository.create({
      id: request.id,
      referral_code,
      referred_by,
      referred_by_level2,
      username: request.username,
      full_name: request.full_name || null,
      referral_status: 'pending', // referral_status deve iniciar como pendente
      cashback_balance: 0.00,
    });

    return newConsumer;
  }
}
