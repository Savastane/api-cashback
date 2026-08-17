---
type: Capability
title: Extrato de Cashback
description: Consulta de saldo atual e historico de transacoes de um consumer para exibicao no app.
tags: [extrato, saldo, transacoes, cashback]
timestamp: 2026-08-17T00:00:00Z
module: src/extrato
status: implementado
persistence: cashback.consumer, cashback.transaction
---

# Objetivo

Fornecer o saldo atual e a lista de transacoes de um consumer, formatados para exibicao direta no frontend do app RedeCity.

# Escopo

| Operacao | Endpoint | Use case |
|---|---|---|
| Consultar extrato | [GET /extrato/:consumerId](/endpoints/get-extrato.md) | `GetExtratoUseCase` |

# Entidades

* [Cashback Consumer](/entities/cashback-consumer.md) — saldo atual.
* [Cashback Transaction](/entities/cashback-transaction.md) — historico de lancamentos.

# Comportamento

1. Busca o consumer pelo ID; se nao existir, retorna `404`.
2. Busca todas as transacoes do consumer ordenadas por `occurred_at` descendente.
3. Mapeia cada transacao para o formato de exibicao:
   - `title` — descricao amigavel do tipo.
   - `date` — formato `DD MMM YYYY` em portugues.
   - `type` — `Entrada`, `Uso` (redemption) ou `Saida`.
   - `amount` — negativo para saidas.
   - `iconType` — `plus`, `cart` ou `bill`.

# Arquitetura

```
ExtratoController
  └── GetExtratoUseCase ──► ExtratoRepository ──► Supabase (cashback.consumer, cashback.transaction)
```

# Arquivos

| Papel | Caminho |
|---|---|
| Controller | `src/extrato/extrato.controller.ts` |
| Module | `src/extrato/extrato.module.ts` |
| Use case | `src/extrato/usecase/get-extrato.usecase.ts` |
| Repositorio | `src/extrato/repository/extrato.repository.ts` |

# Citations

[1] [Use case](/../../src/extrato/usecase/get-extrato.usecase.ts)
[2] [Controller](/../../src/extrato/extrato.controller.ts)
