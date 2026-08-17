---
type: Repository
title: CashbackConsumerRepository
description: Repositorio do consumer do schema cashback com operacoes de CRUD e busca de referrals.
tags: [repository, cashback, consumer, indicacao, supabase]
timestamp: 2026-08-17T00:00:00Z
source: src/indicacao/repository/cashback-consumer.repository.ts
schema: cashback
table: consumer
exported_by: IndicacaoModule
---

# Metodos

| Metodo | Descricao |
|---|---|
| `findById(id)` | Busca um consumer pelo ID. |
| `findByReferralCode(code)` | Busca um consumer pelo codigo de indicacao. |
| `create(consumer)` | Cria um novo consumer no schema cashback. |
| `updateStatus(id, status)` | Atualiza o `referral_status` do consumer. |
| `findReferrals(consumerId)` | Busca consumers indicados por um consumer (nivel 1 ou 2). |

# Entidade

[Cashback Consumer](/entities/cashback-consumer.md)

# Citations

[1] [Implementacao](/../../src/indicacao/repository/cashback-consumer.repository.ts)
