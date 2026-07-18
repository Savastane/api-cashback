import { Injectable, BadRequestException } from '@nestjs/common';
import { CashbackConsumerRepository } from '../repository/cashback-consumer.repository';
import { CashbackConsumer } from '../../model/cashback-consumer.model';

export interface ActivateConsumerRequest {
  id: string;
}

export type ActivateConsumerResponse = CashbackConsumer;

@Injectable()
export class ActivateConsumerUseCase {
  constructor(
    private readonly cashbackConsumerRepository: CashbackConsumerRepository,
  ) {}

  async execute(request: ActivateConsumerRequest): Promise<ActivateConsumerResponse> {
    // 1. Verificar se o consumidor existe
    const consumer = await this.cashbackConsumerRepository.findById(request.id);
    if (!consumer) {
      throw new BadRequestException('Consumidor não encontrado na rede de cashback');
    }

    // 2. Atualizar o status para active
    const updated = await this.cashbackConsumerRepository.updateStatus(request.id, 'active');

    return updated;
  }
}
