---
type: UseCase
title: GetIndicadosUseCase
description: Use case de listagem de consumers indicados por um consumer, classificados por nivel.
tags: [usecase, indicados, listagem, indicacao]
timestamp: 2026-08-17T00:00:00Z
source: src/indicacao/usecase/get-indicados.usecase.ts
exported_by: IndicacaoModule
---

# Interface Publica

```ts
async execute(request: GetIndicadosRequest): Promise<GetIndicadosResponse>
```

# Dependencias

* `CashbackConsumerRepository` — busca referrals.

# Comportamento

1. Busca todos os consumers onde `referred_by` ou `referred_by_level2` e o `consumerId`.
2. Classifica como nivel 1 (`referred_by` = consumerId) ou nivel 2 (`referred_by_level2` = consumerId).

# Capacidade

[Indicacao de Consumers](/domain/indicacao.md)

# Citations

[1] [Implementacao](/../../src/indicacao/usecase/get-indicados.usecase.ts)
[2] [Teste](/../../src/indicacao/usecase/get-indicados.usecase.spec.ts)
