import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { DistribuicaoController } from './distribuicao.controller';
import { DistribuirCashbackUseCase } from './usecase/distribuir-cashback.usecase';
import { PayableRepository } from './repository/payable.repository';
import { CashbackRatesRepository } from './repository/cashback-rates.repository';
import { CashbackTransactionRepository } from './repository/cashback-transaction.repository';
import { CashbackConsumerRepository } from '../indicacao/repository/cashback-consumer.repository';

@Module({
  imports: [SupabaseModule],
  controllers: [DistribuicaoController],
  providers: [
    DistribuirCashbackUseCase,
    PayableRepository,
    CashbackRatesRepository,
    CashbackTransactionRepository,
    {
      provide: 'CASHBACK_CONSUMER_REPO',
      useClass: CashbackConsumerRepository,
    },
  ],
})
export class DistribuicaoModule {}
