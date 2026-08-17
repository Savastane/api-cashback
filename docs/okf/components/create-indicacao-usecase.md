---
type: UseCase
title: CreateIndicacaoUseCase
description: Use case de cadastro de um novo consumer na rede de cashback com vinculo de indicacao em dois niveis.
tags: [usecase, indicacao, cadastro, consumer]
timestamp: 2026-08-17T00:00:00Z
source: src/indicacao/usecase/create-indicacao.usecase.ts
exported_by: IndicacaoModule
---

# Interface Publica

```ts
async execute(request: CreateIndicacaoRequest): Promise<CreateIndicacaoResponse>
```

# Dependencias

* `CashbackConsumerRepository` — verifica duplicidade e cria o consumer.

# Comportamento

1. Verifica se o consumer ja existe no schema cashback.
2. Busca o indicador pelo `referral_id`.
3. Copia `referred_by` (nivel 1) e `referred_by_level2` (nivel 2 do indicador).
4. Gera `referral_code` como UUID.
5. Cria o consumer com `referral_status = 'pending'` e `cashback_balance = 0`.

# Capacidade

[Indicacao de Consumers](/domain/indicacao.md)

# Citations

[1] [Implementacao](/../../src/indicacao/usecase/create-indicacao.usecase.ts)
[2] [Teste](/../../src/indicacao/usecase/create-indicacao.usecase.spec.ts)
