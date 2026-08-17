---
type: Business Rule
title: Niveis de Cashback
description: A distribuicao de cashback ocorre em tres niveis com percentuais distintos definidos em cashback.rates.
tags: [regra, niveis, cashback, percentual, indicacao]
timestamp: 2026-08-17T00:00:00Z
enforced_by: DistribuirCashbackUseCase
source: src/distribuicao/usecase/distribuir-cashback.usecase.ts
applies_to: /domain/cashback-distribution.md
---

# Enunciado

Cada payable distribuido gera ate tres transacoes de cashback, uma por nivel, com percentuais definidos em [Cashback Rates](/entities/cashback-rates.md).

# Niveis

| Nivel | Quem recebe | Tipo | Percentual | Condicao |
|---|---|---|---|---| 
| 0 | Consumer que fez a compra | `purchase_cashback` | `percentage_0` | Sempre (se amount > 0) |
| 1 | Indicador direto (`referred_by`) | `referral_cashback` | `percentage_1` | Se `referred_by` existir |
| 2 | Indicador do indicador (`referred_by_level2`) | `referral_cashback` | `percentage_2` | Se `referred_by_level2` existir |

# Calculo

```
amount = round(order_value * percentage / 100, 2)
```

Exemplo com `order_value = 100`:
* `percentage_0 = 5` => `amount0 = 5.00`
* `percentage_1 = 2` => `amount1 = 2.00`
* `percentage_2 = 1` => `amount2 = 1.00`

# Notificacoes por Nivel

| Nivel | Fila | Routing Key |
|---|---|---|
| 0 | `whatsapp_cashback_compra` | `cashback-compra` |
| 1 | `whatsapp_cashback_rede` | `cashback-rede` |
| 2 | `whatsapp_cashback_rede` | `cashback-rede` |

# Citations

[1] [Use case](/../../src/distribuicao/usecase/distribuir-cashback.usecase.ts)
[2] [Modelo de taxas](/../../src/model/cashback-rates.model.ts)
