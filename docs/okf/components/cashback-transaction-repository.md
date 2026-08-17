---
type: Repository
title: CashbackTransactionRepository
description: Repositorio do ledger de transacoes de cashback no schema cashback.transaction.
tags: [repository, cashback, transaction, ledger, supabase]
timestamp: 2026-08-17T00:00:00Z
source: src/distribuicao/repository/cashback-transaction.repository.ts
schema: cashback
table: transaction
exported_by: DistribuicaoModule
---

# Metodos

| Metodo | Descricao |
|---|---|
| `findDistributedByPayableId(payableId)` | Busca transacoes de distribuicao (`purchase_cashback`, `referral_cashback`) de um payable. Usado no pre-check de idempotencia. |
| `create(input)` | Cria uma transacao no ledger. O trigger do banco atualiza o saldo. |
| `createMany(inputs)` | Cria multiplas transacoes sequencialmente. |

# Entidade

[Cashback Transaction](/entities/cashback-transaction.md)

# Citations

[1] [Implementacao](/../../src/distribuicao/repository/cashback-transaction.repository.ts)
