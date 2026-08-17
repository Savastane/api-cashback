---
type: UseCase
title: GetExtratoUseCase
description: Use case de consulta de saldo e historico de transacoes de cashback formatado para exibicao no app.
tags: [usecase, extrato, saldo, transacoes]
timestamp: 2026-08-17T00:00:00Z
source: src/extrato/usecase/get-extrato.usecase.ts
exported_by: ExtratoModule
---

# Interface Publica

```ts
async execute(request: GetExtratoRequest): Promise<GetExtratoResponse>
```

# Dependencias

* `ExtratoRepository` — busca consumer e transacoes.

# Comportamento

1. Busca o consumer; se nao existir, lanca `NotFoundException`.
2. Busca todas as transacoes do consumer.
3. Ordena por `occurred_at` descendente.
4. Mapeia para o formato de exibicao com `title`, `date` (pt_BR), `type`, `amount` e `iconType`.

# Mapeamento de Tipos

| Tipo | Title | Icon |
|---|---|---|
| `purchase_cashback` | CashBack Compras | `cart` |
| `referral_cashback` | Cash Back Indicado | `plus` |
| `redemption` | Desconto em Compra | `bill` |
| `adjustment` | Ajuste | `bill` |
| `balancemonth` | Saldo do Mes | `bill` |

# Capacidade

[Extrato de Cashback](/domain/extrato.md)

# Citations

[1] [Implementacao](/../../src/extrato/usecase/get-extrato.usecase.ts)
