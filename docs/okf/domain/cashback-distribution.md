---
type: Capability
title: Distribuicao de Cashback
description: Distribui o cashback de um payable em tres niveis (compra propria, indicacao nivel 1 e nivel 2) e publica notificacoes WhatsApp para cada nivel.
tags: [cashback, distribuicao, indicacao, whatsapp, notificacao]
timestamp: 2026-08-17T00:00:00Z
module: src/distribuicao
status: implementado
persistence: cashback.transaction (ledger) + cashback.consumer (saldo via trigger)
---

# Objetivo

Dado um `payable_id` com `consumer_id` e `order_value` definidos, calcular e registrar as transacoes de cashback para tres niveis de consumers:

1. **Nivel 0** — o consumer que realizou a compra (`purchase_cashback`).
2. **Nivel 1** — quem indicou o consumer (`referral_cashback`).
3. **Nivel 2** — quem indicou o indicador (`referral_cashback`).

Apos registrar as transacoes no ledger, publicar mensagens WhatsApp individuais para cada nivel via [Mensageria Produce](/providers/mensageria-produce.md).

# Escopo

| Operacao | Endpoint | Use case |
|---|---|---|
| Distribuir cashback | [POST /distribuicao/:payable_id](/endpoints/post-distribuicao.md) | `DistribuirCashbackUseCase` |

# Entidades

* [Cashback Transaction](/entities/cashback-transaction.md) — ledger imutavel.
* [Cashback Consumer](/entities/cashback-consumer.md) — consumer do schema cashback (saldo e rede).
* [Consumer](/entities/consumer.md) — consumer do schema public (whatsapp_number).
* [Cashback Rates](/entities/cashback-rates.md) — taxas percentuais ativas.
* [Payable](/entities/payable.md) — conta a pagar de origem.
* [Payload](/entities/payload.md) — mensagem publicada.

# Regras Aplicaveis

* [Idempotencia de Distribuicao](/rules/idempotency.md) — unique index previne duplicatas.
* [Saldo via Trigger](/rules/balance-trigger.md) — saldo atualizado por trigger do PostgreSQL.
* [Niveis de Cashback](/rules/cashback-levels.md) — tres niveis com percentuais distintos.
* [Notificacao Fire-and-Forget](/rules/notification-fire-forget.md) — falhas de notificacao nao revertem cashback.
* [Gatilho PAYMENT_CONFIRMED](/rules/payment-confirmed-trigger.md) — distribuicao disparada apos confirmacao.

# Arquitetura

```
DistribuicaoController
  └── DistribuirCashbackUseCase
        ├── PayableRepository ──► Supabase (public.payable)
        ├── CashbackTransactionRepository ──► Supabase (cashback.transaction)
        ├── CashbackConsumerRepository ──► Supabase (cashback.consumer)
        ├── ConsumerRepository ──► Supabase (public.consumer)
        ├── CashbackRatesRepository ──► Supabase (cashback.rates)
        ├── PartnerRepository ──► Supabase (public.partners)
        └── ProduceService ──► Mensageria Produce API
              ├── whatsapp_cashback_compra (cashback-compra)
              └── whatsapp_cashback_rede (cashback-rede)
```

# Arquivos

| Papel | Caminho |
|---|---|
| Controller | `src/distribuicao/distribuicao.controller.ts` |
| Use case | `src/distribuicao/usecase/distribuir-cashback.usecase.ts` |
| Teste (use case) | `src/distribuicao/usecase/distribuir-cashback.usecase.spec.ts` |
| Module | `src/distribuicao/distribuicao.module.ts` |

# Fora de Escopo

* Resgate de cashback (redemption) — sem endpoint dedicado.
* Ajustes manuais de saldo — sem endpoint dedicado.
* Outbox para garantia de entrega de notificacao — notificacao e fire-and-forget.

# Citations

[1] [Use case](/../../src/distribuicao/usecase/distribuir-cashback.usecase.ts)
[2] [Controller](/../../src/distribuicao/distribuicao.controller.ts)
[3] [Teste](/../../src/distribuicao/usecase/distribuir-cashback.usecase.spec.ts)
