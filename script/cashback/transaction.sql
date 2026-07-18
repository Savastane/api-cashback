
-- ---------------------------------------------------------
-- 6) cashback_transactions  (Extrato/Carteira de Cashback)
-- Alimenta a tela "Extrato de Cashback": entradas de cashback
-- (de compra própria ou de indicação) e saídas (uso do saldo
-- como desconto em compras).
-- ---------------------------------------------------------
create table cashback.transaction (
  id            uuid primary key default gen_random_uuid(),
  consumer_id   uuid not null references cashback.consumer(id) on delete cascade, -- dono do lançamento no extrato
 
  type          text not null
                  check (type in ('purchase_cashback', 'referral_cashback', 'redemption', 'adjustment', 'balancemonth')),
                  -- purchase_cashback = "CashBack Compras"
                  -- referral_cashback = "CashBack Compras Indicado"
                  -- redemption        = "Desconto em Compra" (uso do saldo)
                  -- adjustment        = ajuste manual/estorno
                  -- balancemonth     = saldo do mes
 
  direction     text not null check (direction in ('in', 'out')), -- 'in' = Entrada, 'out' = Saída/Uso
  amount        numeric(12,2) not null check (amount >= 0),          -- valor absoluto do lançamento
 
  payable_id    uuid references public.payable(id),    -- origem, quando for cashback de compra/indicação
  order_id   varchar references public.orders(id),  -- compra relacionada (geradora do cashback OU onde o desconto foi usado)
 
  description   text,                                    -- texto exibido no extrato (ex: "CashBack Compras")
  occurred_at   timestamptz not null default now(),      -- data considerada no extrato (ex: "25 Ago 2024")
  created_at    timestamptz not null default now(),
  transaction_id  uuid references cashback.transaction(id) on delete set null
);
 
create index idx_cashback_transaction_consumer_id on cashback.transaction(consumer_id);
create index idx_cashback_transaction_occurred_at on cashback.transaction(occurred_at);
create index idx_cashback_transaction_type on cashback.transaction(type);
 
comment on table cashback.transaction is 'Extrato/carteira de cashback: todo crédito (compra própria, indicação) e débito (uso como desconto) que compõe o saldo do consumer.';
comment on column cashback.transaction.id is 'Identificador do lançamento no extrato';
comment on column cashback.transaction.consumer_id is 'Consumer dono deste lançamento';
comment on column cashback.transaction.type is 'Tipo do lançamento: purchase_cashback, referral_cashback, redemption, adjustment ou balancemonth';
comment on column cashback.transaction.direction is 'Direção do lançamento: in (entrada/crédito) ou out (saída/uso)';
comment on column cashback.transaction.amount is 'Valor absoluto do lançamento (o sinal é definido por direction)';
comment on column cashback.transaction.payable_id is 'Lançamento de payable que originou este crédito, quando aplicável';
comment on column cashback.transaction.order_id is 'Compra relacionada: onde o cashback foi gerado ou onde o desconto foi utilizado';
comment on column cashback.transaction.description is 'Texto exibido no extrato (ex: CashBack Compras, Cash Back Indicado, Desconto em Compra)';
comment on column cashback.transaction.occurred_at is 'Data exibida no extrato para este lançamento';
comment on column cashback.transaction.created_at is 'Data de criação do registro no banco';
comment on column cashback.transaction.transaction_id is 'ID da transação que originou este lançamento';