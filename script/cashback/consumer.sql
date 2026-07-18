
-- ---------------------------------------------------------
-- 2) consumer  (Usuário do app / participante da rede)
-- ---------------------------------------------------------
create table cashback.consumer (
  id               uuid primary key ,
  referral_code    text not null unique,                    -- código próprio para indicar outras pessoas
  referred_by      uuid , -- indicador direto (nível 1)
  referred_by_level2 uuid , -- indicador do indicador (nível 2) - cópia denormalizada de referred_by.referred_by no momento do cadastro
  username         text not null ,                    -- @handle exibido na rede de indicados
  full_name        text,                                    -- nome completo (ex: "Savastane")
  referral_status  text not null default 'pending'
                     check (referral_status in ('pending', 'active')), -- status deste consumer como indicado (pendente/ativo) - definido pela API
  cashback_balance numeric(12,2) not null default 0,          -- saldo atual de cashback (mantido pela API a cada lançamento)
  created_at       timestamptz not null default now(),        -- também usado como "Membro desde" na tela de indicados
  updated_at       timestamptz not null default now()



create index idx_consumer_referred_by on cashback.consumer(referred_by);
create index idx_consumer_referred_by_level2 on cashback.consumer(referred_by_level2);
create index idx_consumer_referral_code on cashback.consumer(referral_code);
create index idx_consumer_username on cashback.consumer(username);
 
comment on table cashback.consumer is 'Usuários (consumidores) participantes do programa de cashback e da rede de indicação.';
comment on column cashback.consumer.id is 'Referência ao usuário em auth.users';
comment on column cashback.consumer.referral_code is 'Código único usado por este consumer para indicar outras pessoas';
comment on column cashback.consumer.referred_by is 'Indicador direto (nível 1)';
comment on column cashback.consumer.referred_by_level2 is 'Indicador do indicador (nível 2). Cópia denormalizada de referred_by.referred_by, gravada pela API no momento do cadastro, para permitir calcular a distribuição de cashback dos 2 níveis direto na compra sem precisar de join recursivo';
comment on column cashback.consumer.username is 'Nome de usuário (@handle) exibido na rede de indicados';
comment on column cashback.consumer.full_name is 'Nome completo exibido no topo do perfil';
comment on column cashback.consumer.referral_status is 'Status deste consumer como indicado: pending (aguardando ativação) ou active. Regra de quando ativar fica na API';
comment on column cashback.consumer.cashback_balance is 'Saldo atual de cashback do consumer, atualizado pela API a cada novo lançamento em cashback_transactions';
comment on column cashback.consumer.created_at is 'Data de cadastro - usada como "Membro desde" na tela de rede de indicados';
comment on column cashback.consumer.updated_at is 'Data da última atualização do registro';
 