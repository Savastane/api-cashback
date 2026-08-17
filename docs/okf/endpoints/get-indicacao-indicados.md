---
type: API Endpoint
title: GET /indicacao/:consumerId/indicados
description: Lista os consumers indicados por um consumer, separados por nivel (1 ou 2).
resource: http://localhost:3555/indicacao/:consumerId/indicados
tags: [endpoint, get, indicacao, indicados]
timestamp: 2026-08-17T00:00:00Z
method: GET
path: /indicacao/:consumerId/indicados
usecase: GetIndicadosUseCase
source: src/indicacao/indicacao.controller.ts
capability: /domain/indicacao.md
---

# Contrato

## Request

Sem body. O `consumerId` vem como path parameter.

## Response 200

```json
{
  "indicados": [
    {
      "id": "uuid",
      "username": "maria",
      "nickname": "Mari",
      "full_name": "Maria Santos",
      "referral_status": "active",
      "level": 1,
      "created_at": "..."
    }
  ]
}
```

# Comportamento

1. Busca todos os consumers onde `referred_by` ou `referred_by_level2` e o `consumerId`.
2. Classifica cada um como nivel 1 (`referred_by` = consumerId) ou nivel 2 (`referred_by_level2` = consumerId).

# Citations

[1] [Controller](/../../src/indicacao/indicacao.controller.ts)
[2] [Use case](/../../src/indicacao/usecase/get-indicados.usecase.ts)
