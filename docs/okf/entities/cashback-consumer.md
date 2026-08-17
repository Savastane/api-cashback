---
type: Entity
title: Cashback Consumer
description: Consumer do schema cashback com saldo, codigo de indicacao e rede de referenciadores em dois niveis.
tags: [entity, consumer, cashback, indicacao, saldo]
timestamp: 2026-08-17T00:00:00Z
source: src/model/cashback-consumer.model.ts
table: cashback.consumer
persistence: supabase
---

# Schema

Tabela `cashback.consumer` no Supabase.

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `id` | `uuid` | sim | Identificador unico (FK para `public.consumer.id`) |
| `referral_code` | `string` | sim | Codigo de indicacao proprio (UUID gerado no cadastro) |
| `referred_by` | `string \| null` | nao | ID do consumer que indicou (nivel 1) |
| `referred_by_level2` | `string \| null` | nao | ID do indicador do indicador (nivel 2) |
| `username` | `string` | sim | Nome de usuario |
| `nickname` | `string \| null` | nao | Apelido |
| `full_name` | `string \| null` | nao | Nome completo |
| `referral_status` | `'pending' \| 'active'` | sim | Status da indicacao |
| `cashback_balance` | `number` | sim | Saldo atual (mantido por trigger, nao pela aplicacao) |
| `created_at` | `Date` | sim | Data de criacao |
| `updated_at` | `Date` | sim | Data de atualizacao |

# Tipos

```ts
export type ReferralStatus = 'pending' | 'active';

export interface CashbackConsumer {
  id: string;
  referral_code: string;
  referred_by: string | null;
  referred_by_level2: string | null;
  username: string;
  nickname: string | null;
  full_name: string | null;
  referral_status: ReferralStatus;
  cashback_balance: number;
  created_at: Date;
  updated_at: Date;
}
```

# Semantica

* `cashback_balance` e a fonte de verdade para o saldo do consumer, mas **nao** e atualizado pela aplicacao. A atualizacao e feita por um trigger PostgreSQL ao inserir em `cashback.transaction`. Ver [Saldo via Trigger](/rules/balance-trigger.md).
* `referred_by` e `referred_by_level2` sao copias desnormalizadas dos IDs dos indicadores, estabelecidas no cadastro via [CreateIndicacaoUseCase](/components/create-indicacao-usecase.md).
* `referral_status` inicia como `pending` e transita para `active` via [ActivateConsumerUseCase](/components/activate-consumer-usecase.md).

# Relacionamentos

* `id` referencia `public.consumer.id` — ver [Consumer](/entities/consumer.md).
* Recebe transacoes em [Cashback Transaction](/entities/cashback-transaction.md).

# Citations

[1] [Modelo](/../../src/model/cashback-consumer.model.ts)
[2] [Repositorio](/../../src/indicacao/repository/cashback-consumer.repository.ts)
