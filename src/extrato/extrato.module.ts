import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { ExtratoController } from './extrato.controller';
import { GetExtratoUseCase } from './usecase/get-extrato.usecase';
import { ExtratoRepository } from './repository/extrato.repository';

@Module({
  imports: [SupabaseModule],
  controllers: [ExtratoController],
  providers: [GetExtratoUseCase, ExtratoRepository],
})
export class ExtratoModule {}
