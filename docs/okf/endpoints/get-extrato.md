---
type: API Endpoint
title: GET /extrato/:consumerId
description: Retorna o saldo atual e o historico de transacoes de cashback de um consumer.
resource: http://localhost:3555/extrato/:consumerId
tags: [endpoint, get, extrato, saldo, transacoes]
timestamp: 2026-08-17T00:00:00Z
method: GET
path: /extrato/:consumerId
usecase: GetExtratoUseCase
source: src/extrato/extrato.controller.ts
capability: /domain/extrato.md
---

# Contrato

## Request

Sem body. O `consumerId` vem como path parameter.

## Response 200

```json
{
  "balance": {
    "balance": 15.0,
    "description": "Saldo exclusivo para descontos em novos servicos."
  },
  "transactions": [
    {
      "id": "tx-uuid",
      "title": "CashBack Compras",
      "date": "17 Ago 2026",
      "type": "Entrada",
      "amount": 5.0,
      "iconType": "cart",
      "rawType": "purchase_cashback",
      "description": "CashBack Compras"
    }
  ]
}
```

# Comportamento

1. Busca o consumer pelo ID; se nao existir, retorna `404`.
2. Busca todas as transacoes do consumer.
3. Ordena por `occurred_at` descendente.
4. Mapeia para o formato de exibicao com `title`, `date` (pt_BR), `type`, `amount` e `iconType`.

# Codigos de Resposta

| Codigo | Situacao |
|---|---|
| `200` | Extrato retornado com sucesso |
| `404` | Consumer nao encontrado |

# Citations

[1] [Controller](/../../src/extrato/extrato.controller.ts)
[2] [Use case](/../../src/extrato/usecase/get-extrato.usecase.ts)
