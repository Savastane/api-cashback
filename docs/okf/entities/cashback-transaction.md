---
type: Entity
title: Cashback Transaction
description: Lancamento imutavel no ledger de cashback. Cada transacao representa uma entrada ou saida de saldo para um consumer.
tags: [entity, transaction, ledger, cashback, imutavel]
timestamp: 2026-08-17T00:00:00Z
source: src/model/cashback-transaction.model.ts
table: cashback.transaction
persistence: supabase
---

# Schema

Tabela `cashback.transaction` no Supabase. Funciona como ledger imutavel — o saldo do consumer e derivado dos lancamentos.

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `id` | `uuid` | sim | Identificador unico (gerado pelo banco) |
| `consumer_id` | `uuid` | sim | Consumer que recebe/debita |
| `type` | `CashbackTransactionType` | sim | Tipo da transacao |
| `direction` | `'in' \| 'out'` | sim | Entrada ou saida |
| `amount` | `number` | sim | Valor da transacao |
| `payable_id` | `string \| null` | nao | Payable de origem (para cashbacks) |
| `order_id` | `string \| null` | nao | Order de origem |
| `description` | `string \| null` | nao | Descricao legivel |
| `occurred_at` | `Date` | sim | Data do evento |
| `created_at` | `Date` | sim | Data de criacao do registro |
| `transaction_id` | `string \| null` | nao | ID de transacao externa |

# Tipos

```ts
export type CashbackTransactionType =
  | 'purchase_cashback'
  | 'referral_cashback'
  | 'redemption'
  | 'adjustment'
  | 'balancemonth';

export type CashbackTransactionDirection = 'in' | 'out';

export interface CashbackTransaction {
  id: string;
  consumer_id: string;
  type: CashbackTransactionType;
  direction: CashbackTransactionDirection;
  amount: number;
  payable_id: string | null;
  order_id: string | null;
  description: string | null;
  occurred_at: Date;
  created_at: Date;
  transaction_id: string | null;
}
```

# Tipos de Transacao

| Tipo | Direction | Descricao |
|---|---|---|
| `purchase_cashback` | `in` | Cashback da compra propria (nivel 0) |
| `referral_cashback` | `in` | Cashback de indicacao (niveis 1 e 2) |
| `redemption` | `out` | Resgate/uso de cashback |
| `adjustment` | `in/out` | Ajuste manual |
| `balancemonth` | `in/out` | Fechamento mensal |

# Idempotencia

Existe um unique index parcial em `(payable_id, consumer_id, type)` que previne duplicatas de distribuicao para o mesmo payable. Ver [Idempotencia de Distribuicao](/rules/idempotency.md).

# Relacionamentos

* `consumer_id` referencia [Cashback Consumer](/entities/cashback-consumer.md).
* `payable_id` referencia [Payable](/entities/payable.md).

# Citations

[1] [Modelo](/../../src/model/cashback-transaction.model.ts)
[2] [Repositorio](/../../src/distribuicao/repository/cashback-transaction.repository.ts)
[3] [SQL de idempotencia](/../../script/cashback/idepotencia.sql)
