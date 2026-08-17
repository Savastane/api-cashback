---
type: Entity
title: Payable
description: Conta a pagar com vinculo ao consumer, order_value e partner_id, usada como origem da distribuicao de cashback.
tags: [entity, payable, pagamento, cashback]
timestamp: 2026-08-17T00:00:00Z
source: src/model/payable.model.ts
table: public.payable
persistence: supabase
---

# Schema

Tabela `public.payable` no Supabase.

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `id` | `uuid` | sim | Identificador unico |
| `partner_id` | `string` | sim | Parceiro/loja |
| `order_id` | `string \| null` | nao | Order de origem |
| `order_value` | `number \| null` | nao | Valor da promocao (base para cashback) |
| `amount` | `string \| null` | nao | Valor monetario |
| `status` | `string \| null` | nao | Status do payable |
| `consumer_id` | `string \| null` | nao | Consumer que fez a compra |
| `consumer_name` | `string \| null` | nao | Nome do consumer (denormalizado) |
| `schedule_date` | `string \| null` | nao | Data agendada |
| `gateway_confirmation_date` | `string \| null` | nao | Data de confirmacao do gateway |
| `gateway_payment_date` | `string \| null` | nao | Data de pagamento do gateway |
| `expected_date` | `string \| null` | nao | Data esperada |
| `scheduled_date` | `string \| null` | nao | Data agendada |
| `payment_date` | `string \| null` | nao | Data de pagamento |
| `payment_batch_id` | `string \| null` | nao | ID do lote de pagamento |
| `token_date` | `string \| null` | nao | Data do token |
| `token` | `string \| null` | nao | Token |
| `promotion_name` | `string \| null` | nao | Nome da promocao |
| `promotion_id` | `string \| null` | nao | ID da promocao |
| `type_payable` | `string \| null` | nao | Tipo do payable |
| `created_at` | `string \| null` | nao | Data de criacao |
| `updated_at` | `string \| null` | nao | Data de atualizacao |

# Campos Criticos para Distribuicao

O [DistribuirCashbackUseCase](/components/distribuir-cashback-usecase.md) exige tres campos para prosseguir:

1. `id` — identificador do payable.
2. `consumer_id` — consumer que fez a compra. Se ausente, retorna `400`.
3. `order_value` — valor base para calculo do cashback. Se ausente, retorna `400`.

# Relacionamentos

* `consumer_id` referencia [Consumer](/entities/consumer.md).
* `partner_id` referencia `public.partners` (nome do parceiro usado em notificacoes).

# Citations

[1] [Modelo](/../../src/model/payable.model.ts)
[2] [Repositorio](/../../src/distribuicao/repository/payable.repository.ts)
