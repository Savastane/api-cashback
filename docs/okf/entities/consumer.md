---
type: Entity
title: Consumer
description: Consumer do schema public com dados de contato, gamificacao e numero de WhatsApp.
tags: [entity, consumer, public, whatsapp, contato]
timestamp: 2026-08-17T00:00:00Z
source: src/model/consumer.model.ts
table: public.consumer
persistence: supabase
---

# Schema

Tabela `public.consumer` no Supabase (projeto RedeCITY).

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `id` | `uuid` | sim | Identificador unico |
| `email` | `string \| null` | nao | Email |
| `full_name` | `string \| null` | nao | Nome completo |
| `avatar_url` | `string \| null` | nao | URL do avatar |
| `phone` | `string \| null` | nao | Telefone |
| `created_at` | `Date` | sim | Data de criacao |
| `updated_at` | `Date` | sim | Data de atualizacao |
| `phone_verified` | `boolean \| null` | nao | Telefone verificado |
| `is_2fa_enabled` | `boolean \| null` | nao | 2FA habilitado |
| `preferred_2fa_method` | `string \| null` | nao | Metodo 2FA preferido |
| `userid` | `string \| null` | nao | ID do usuario no auth |
| `provider_type` | `string \| null` | nao | Tipo de provider |
| `total_orders` | `number \| null` | nao | Total de pedidos |
| `total_reviews` | `number \| null` | nao | Total de reviews |
| `total_points` | `number \| null` | nao | Total de pontos |
| `saved_amount` | `number \| null` | nao | Valor economizado |
| `document` | `string \| null` | nao | Documento |
| `billing_full_name` | `string \| null` | nao | Nome de cobranca |
| `whatsapp_number` | `string \| null` | nao | Numero de WhatsApp (usado para notificacoes) |
| `sms_number` | `string \| null` | nao | Numero de SMS |
| `external_id` | `string \| null` | nao | ID externo |
| `nickname` | `string \| null` | nao | Apelido |
| `referral_id` | `string \| null` | nao | Codigo de indicacao usado no cadastro |

# Notas de Seguranca

A coluna `password` existe no banco mas e **intencionalmente omitida** do modelo TypeScript por questoes de seguranca — ela nunca deve ser lida pela aplicacao de cashback.

# Uso na Distribuicao

O [ConsumerRepository](/components/consumer-repository.md) busca `whatsapp_number` (com fallback para `phone`) para alimentar as notificacoes WhatsApp durante a distribuicao de cashback.

# Relacionamentos

* `id` e referenciado por `cashback.consumer.id` — ver [Cashback Consumer](/entities/cashback-consumer.md).

# Citations

[1] [Modelo](/../../src/model/consumer.model.ts)
[2] [Repositorio](/../../src/distribuicao/repository/consumer.repository.ts)
