---
type: Business Rule
title: Saldo via Trigger
description: O saldo do consumer (cashback_balance) e atualizado exclusivamente por um trigger do PostgreSQL ao inserir em cashback.transaction, nunca por aritmetica na aplicacao.
tags: [regra, saldo, trigger, postgresql, integridade]
timestamp: 2026-08-17T00:00:00Z
enforced_by: PostgreSQL trigger on cashback.transaction
source: script/cashback/idepotencia.sql
applies_to: /domain/cashback-distribution.md
---

# Enunciado

O campo `cashback.consumer.cashback_balance` **nao** deve ser atualizado pela aplicacao via `UPDATE` direto. Toda atualizacao de saldo e feita por um trigger PostgreSQL que executa atomicamente na mesma transacao do `INSERT` em `cashback.transaction`.

# Motivacao

O padrao inseguro a evitar:

```ts
// NUNCA FAZER ISTO
const consumer = await findConsumerById(id);
const newBalance = consumer.cashback_balance + amount;
await updateBalance(id, newBalance);
```

Este padrao e suscetivel a lost updates sob concorrencia. O trigger resolve isso com row locking no PostgreSQL.

# Mecanismo

O trigger disposado em `AFTER INSERT` na tabela `cashback.transaction`:

1. Para `direction = 'in'`: incrementa `cashback_balance` em `amount`.
2. Para `direction = 'out'`: decrementa `cashback_balance` em `amount`.
3. Atualiza `updated_at` do consumer.
4. Executa na mesma transacao do INSERT, garantindo atomicidade.

# Consequencia

A aplicacao apenas insere lancamentos no ledger. O saldo e sempre derivado do somatorio dos lancamentos, mantido pelo trigger.

# Citations

[1] [SQL do trigger](/../../script/cashback/idepotencia.sql)
[2] [Use case (apenas insere)](/../../src/distribuicao/usecase/distribuir-cashback.usecase.ts)
