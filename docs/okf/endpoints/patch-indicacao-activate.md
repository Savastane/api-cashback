---
type: API Endpoint
title: PATCH /indicacao/:id/activate
description: Ativa um consumer pendente na rede de cashback.
resource: http://localhost:3555/indicacao/:id/activate
tags: [endpoint, patch, indicacao, ativacao]
timestamp: 2026-08-17T00:00:00Z
method: PATCH
path: /indicacao/:id/activate
usecase: ActivateConsumerUseCase
source: src/indicacao/indicacao.controller.ts
capability: /domain/indicacao.md
---

# Contrato

## Request

Sem body. O `id` vem como path parameter.

## Response 200

```json
{
  "id": "uuid",
  "referral_status": "active",
  "cashback_balance": 0.0,
  "..."
}
```

# Comportamento

1. Busca o consumer pelo ID.
2. Se nao existir, retorna `400`.
3. Atualiza `referral_status` para `active`.

# Validacoes

| Ordem | Condicao | Status | Mensagem |
|---|---|---|---|
| 1 | Consumer nao encontrado | `400` | `Consumidor nao encontrado na rede de cashback` |

# Citations

[1] [Controller](/../../src/indicacao/indicacao.controller.ts)
[2] [Use case](/../../src/indicacao/usecase/activate-consumer.usecase.ts)
