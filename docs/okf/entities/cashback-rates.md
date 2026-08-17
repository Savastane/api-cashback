---
type: Entity
title: Cashback Rates
description: Taxas percentuais ativas para distribuicao de cashback em tres niveis.
tags: [entity, rates, taxas, cashback, percentual]
timestamp: 2026-08-17T00:00:00Z
source: src/model/cashback-rates.model.ts
table: cashback.rates
persistence: supabase
---

# Schema

Tabela `cashback.rates` no Supabase.

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `id` | `uuid` | sim | Identificador unico |
| `percentage_0` | `number` | sim | Percentual para nivel 0 (compra propria) |
| `percentage_1` | `number` | sim | Percentual para nivel 1 (indicador direto) |
| `percentage_2` | `number` | sim | Percentual para nivel 2 (indicador do indicador) |
| `active` | `boolean` | sim | Indica se a taxa esta ativa |
| `created_at` | `Date` | sim | Data de criacao |

# Tipos

```ts
export interface CashbackRates {
  id: string;
  percentage_0: number;
  percentage_1: number;
  percentage_2: number;
  active: boolean;
  created_at: Date;
}
```

# Semantica

* Apenas uma taxa deve estar `active = true` por vez. O repositorio busca com `.eq('active', true).maybeSingle()`.
* Os percentuais sao aplicados sobre `order_value` do payable.
* Exemplo: `order_value = 100`, `percentage_0 = 5` => `amount0 = 5.00`.

# Citations

[1] [Modelo](/../../src/model/cashback-rates.model.ts)
[2] [Repositorio](/../../src/distribuicao/repository/cashback-rates.repository.ts)
