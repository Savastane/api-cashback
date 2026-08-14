import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SupabaseModule } from '../supabase/supabase.module';
import { DistribuicaoController } from './distribuicao.controller';
import { DistribuirCashbackUseCase } from './usecase/distribuir-cashback.usecase';
import { PayableRepository } from './repository/payable.repository';
import { CashbackRatesRepository } from './repository/cashback-rates.repository';
import { CashbackTransactionRepository } from './repository/cashback-transaction.repository';
import { UserProfileRepository } from './repository/user-profile.repository';
import { PartnerRepository } from './repository/partner.repository';
import { CashbackConsumerRepository } from '../indicacao/repository/cashback-consumer.repository';
import { ProduceService } from '../service/produce.service';

@Module({
  imports: [SupabaseModule, HttpModule],
  controllers: [DistribuicaoController],
  providers: [
    DistribuirCashbackUseCase,
    PayableRepository,
    CashbackRatesRepository,
    CashbackTransactionRepository,
    UserProfileRepository,
    PartnerRepository,
    ProduceService,
    {
      provide: 'CASHBACK_CONSUMER_REPO',
      useClass: CashbackConsumerRepository,
    },
  ],
})
export class DistribuicaoModule {}
