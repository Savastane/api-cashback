---
type: Capability
title: Indicacao de Consumers
description: Cadastro de novos consumers na rede de cashback com vinculo de indicacao em dois niveis e ativacao posterior.
tags: [indicacao, consumer, cadastro, ativacao, cashback]
timestamp: 2026-08-17T00:00:00Z
module: src/indicacao
status: implementado
persistence: cashback.consumer
---

# Objetivo

Permitir o cadastro de um novo consumer na rede de cashback a partir de um codigo de indicacao, estabelecendo os vinculos de `referred_by` (nivel 1) e `referred_by_level2` (nivel 2). Apos cadastro, o consumer fica com status `pending` e pode ser ativado posteriormente.

# Escopo

| Operacao | Endpoint | Use case |
|---|---|---|
| Cadastrar indicacao | [POST /indicacao](/endpoints/post-indicacao.md) | `CreateIndicacaoUseCase` |
| Ativar consumer | [PATCH /indicacao/:id/activate](/endpoints/patch-indicacao-activate.md) | `ActivateConsumerUseCase` |
| Listar indicados | [GET /indicacao/:consumerId/indicados](/endpoints/get-indicacao-indicados.md) | `GetIndicadosUseCase` |

# Entidades

* [Cashback Consumer](/entities/cashback-consumer.md) — consumer do schema cashback.

# Regras Aplicaveis

* Consumer novo inicia com `referral_status = 'pending'` e `cashback_balance = 0`.
* `referred_by_level2` e copiado do `referred_by` do indicador (desnormalizacao).
* `referral_code` do novo consumer e gerado como UUID.

# Arquitetura

```
IndicacaoController
  ├── CreateIndicacaoUseCase ──► CashbackConsumerRepository
  ├── ActivateConsumerUseCase ──► CashbackConsumerRepository
  └── GetIndicadosUseCase ──► CashbackConsumerRepository
```

# Arquivos

| Papel | Caminho |
|---|---|
| Controller | `src/indicacao/indicacao.controller.ts` |
| Module | `src/indicacao/indicacao.module.ts` |
| Create use case | `src/indicacao/usecase/create-indicacao.usecase.ts` |
| Activate use case | `src/indicacao/usecase/activate-consumer.usecase.ts` |
| Get indicados use case | `src/indicacao/usecase/get-indicados.usecase.ts` |

# Citations

[1] [Controller](/../../src/indicacao/indicacao.controller.ts)
[2] [Create use case](/../../src/indicacao/usecase/create-indicacao.usecase.ts)
[3] [Activate use case](/../../src/indicacao/usecase/activate-consumer.usecase.ts)
[4] [Get indicados use case](/../../src/indicacao/usecase/get-indicados.usecase.ts)
