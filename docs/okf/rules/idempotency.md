---
type: Business Rule
title: Idempotencia de Distribuicao
description: Unique index parcial em (payable_id, consumer_id, type) previne duplicatas de distribuicao de cashback causadas por retries do RabbitMQ ou concorrencia.
tags: [regra, idempotencia, distribuicao, unique-index, concorrencia]
timestamp: 2026-08-17T00:00:00Z
enforced_by: DistribuirCashbackUseCase + PostgreSQL unique index
source: src/distribuicao/usecase/distribuir-cashback.usecase.ts
applies_to: /domain/cashback-distribution.md
---

# Enunciado

A distribuicao de cashback para um payable deve ocorrer exatamente uma vez por nivel. Retries do RabbitMQ, concorrencia entre workers ou reenvios nao devem criar transacoes duplicadas nem creditar o consumer mais de uma vez.

# Mecanismo

## Camada 1: Pre-check na aplicacao

Antes de criar qualquer transacao, o `DistribuirCashbackUseCase` consulta `findDistributedByPayableId(payable_id)`. Se ja existirem transacoes de distribuicao (`purchase_cashback` ou `referral_cashback`), retorna `already_distributed: true` sem criar nada novo.

## Camada 2: Unique index no banco

```sql
CREATE UNIQUE INDEX IF NOT EXISTS uq_cashback_tx_payable_consumer_type
ON cashback.transaction (payable_id, consumer_id, type)
WHERE payable_id IS NOT NULL;
```

Se dois workers passarem pelo pre-check simultaneamente, apenas um conseguira inserir; o outro recebera erro de unique constraint.

## Camada 3: Catch e reload

Se o `create()` lancar erro de unique constraint, o use case recarrega as transacoes existentes via `findDistributedByPayableId` e retorna `already_distributed: true`.

# Comportamento em Retries

| Cenario | Resultado |
|---|---|
| Primeira chamada | Cria 3 transacoes, `already_distributed: false` |
| Retry da mesma mensagem | Pre-check encontra transacoes, retorna `already_distributed: true` |
| Dois workers simultaneos | Um cria, o outro recebe unique error e retorna `already_distributed: true` |

# Citations

[1] [Use case](/../../src/distribuicao/usecase/distribuir-cashback.usecase.ts)
[2] [SQL de idempotencia](/../../script/cashback/idepotencia.sql)
