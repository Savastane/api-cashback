---
type: Repository
title: ExtratoRepository
description: Repositorio de extrato de cashback com busca de consumer e transacoes no schema cashback.
tags: [repository, extrato, cashback, supabase]
timestamp: 2026-08-17T00:00:00Z
source: src/extrato/repository/extrato.repository.ts
schema: cashback
tables: consumer, transaction
exported_by: ExtratoModule
---

# Metodos

| Metodo | Descricao |
|---|---|
| `findConsumerById(id)` | Busca `id, cashback_balance, referral_status` do consumer. |
| `findTransactionsByConsumerId(consumerId)` | Busca todas as transacoes do consumer ordenadas por `occurred_at` descendente. |

# Citations

[1] [Implementacao](/../../src/extrato/repository/extrato.repository.ts)
