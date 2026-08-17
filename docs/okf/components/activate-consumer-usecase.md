---
type: UseCase
title: ActivateConsumerUseCase
description: Use case de ativacao de um consumer pendente na rede de cashback.
tags: [usecase, ativacao, consumer, indicacao]
timestamp: 2026-08-17T00:00:00Z
source: src/indicacao/usecase/activate-consumer.usecase.ts
exported_by: IndicacaoModule
---

# Interface Publica

```ts
async execute(request: ActivateConsumerRequest): Promise<ActivateConsumerResponse>
```

# Dependencias

* `CashbackConsumerRepository` — busca e atualiza status.

# Comportamento

1. Busca o consumer pelo ID.
2. Se nao existir, lanca `BadRequestException`.
3. Atualiza `referral_status` para `active`.

# Capacidade

[Indicacao de Consumers](/domain/indicacao.md)

# Citations

[1] [Implementacao](/../../src/indicacao/usecase/activate-consumer.usecase.ts)
[2] [Teste](/../../src/indicacao/usecase/activate-consumer.usecase.spec.ts)
