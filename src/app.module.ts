import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { SupabaseModule } from './supabase/supabase.module';
import { RedisModule } from './redis/redis.module';
import { IndicacaoModule } from './indicacao/indicacao.module';
import { DistribuicaoModule } from './distribuicao/distribuicao.module';
import { ExtratoModule } from './extrato/extrato.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    AuthModule,
    HealthModule,
    SupabaseModule,
    RedisModule,
    IndicacaoModule,
    DistribuicaoModule,
    ExtratoModule,
  ],
})
export class AppModule { }
