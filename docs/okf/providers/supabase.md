---
type: Provider
title: Supabase
description: Banco de dados PostgreSQL hospedado no Supabase com os schemas public e cashback.
tags: [provider, supabase, postgresql, database]
timestamp: 2026-08-17T00:00:00Z
project: RedeCITY (tpkrqseeyplevbuhqasf)
config_env: SUPABASE_URL, SUPABASE_KEY
---

# Visao Geral

O projeto Supabase **RedeCITY** (`tpkrqseeyplevbuhqasf`) hospeda o banco PostgreSQL com dois schemas principais:

## Schema `public`

Tabelas de dominio do app RedeCity:

| Tabela | Uso no api-cashback |
|---|---|
| `consumer` | Dados de contato e `whatsapp_number` para notificacoes |
| `payable` | Payables com `consumer_id` e `order_value` para distribuicao |
| `partners` | Nome do parceiro/loja para notificacoes |
| `orders` | Referenciada por payables |

## Schema `cashback`

Tabelas do dominio de cashback:

| Tabela | Uso |
|---|---|
| `consumer` | Consumers com saldo, rede de indicacao e status |
| `transaction` | Ledger imutavel de transacoes (trigger atualiza saldo) |
| `rates` | Taxas percentuais ativas para distribuicao |

# Configuracao

Variaveis de ambiente (nao exponha valores):

| Variavel | Descricao |
|---|---|
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_KEY` | Chave de acesso (service_role ou anon) |

# Componente

[SupabaseClient](/components/supabase-client.md)

# Citations

[1] [Modulo Supabase](/../../src/supabase/supabase.module.ts)
