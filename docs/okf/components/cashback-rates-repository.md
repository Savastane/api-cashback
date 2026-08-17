---
type: Repository
title: CashbackRatesRepository
description: Repositorio de taxas de cashback no schema cashback.rates com busca da taxa ativa.
tags: [repository, rates, cashback, supabase]
timestamp: 2026-08-17T00:00:00Z
source: src/distribuicao/repository/cashback-rates.repository.ts
schema: cashback
table: rates
exported_by: DistribuicaoModule
---

# Metodos

| Metodo | Descricao |
|---|---|
| `findActive()` | Busca a taxa ativa (`active = true`). Retorna `null` se nenhuma existir. |

# Entidade

[Cashback Rates](/entities/cashback-rates.md)

# Citations

[1] [Implementacao](/../../src/distribuicao/repository/cashback-rates.repository.ts)
