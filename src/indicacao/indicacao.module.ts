import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { IndicacaoController } from './indicacao.controller';
import { CreateIndicacaoUseCase } from './usecase/create-indicacao.usecase';
import { ActivateConsumerUseCase } from './usecase/activate-consumer.usecase';
import { CashbackConsumerRepository } from './repository/cashback-consumer.repository';

@Module({
  imports: [SupabaseModule],
  controllers: [IndicacaoController],
  providers: [
    CreateIndicacaoUseCase,
    ActivateConsumerUseCase,
    CashbackConsumerRepository,
  ],
})
export class IndicacaoModule {}
