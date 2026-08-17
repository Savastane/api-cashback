---
type: Business Rule
title: Gatilho PAYMENT_CONFIRMED
description: A distribuicao de cashback e enfileirada apos o evento PAYMENT_CONFIRMED do Asaas, nao apos PAYMENT_RECEIVED.
tags: [regra, asaas, payment, trigger, distribuicao]
timestamp: 2026-08-17T00:00:00Z
enforced_by: AsaasReceivePaymentConsumer (projeto consumer)
applies_to: /domain/cashback-distribution.md
---

# Enunciado

O enfileiramento da distribuicao de cashback na fila `cashback_distribuicao` ocorre quando o webhook do Asaas reporta `PAYMENT_CONFIRMED`. O evento `PAYMENT_RECEIVED` nao dispara a distribuicao.

# Motivacao

`PAYMENT_CONFIRMED` indica que o pagamento foi confirmado de forma definitiva pelo gateway. `PAYMENT_RECEIVED` pode ocorrer em estagios intermediarios. Garantir que o cashback so seja distribuido apos confirmacao definitiva evita estornos e inconsistencias.

# Fluxo

```
Asaas Webhook (PAYMENT_CONFIRMED)
  └── Webhook Gateway
        └── Consumer (asaas-receive-payment)
              ├── Atualiza order
              ├── Cria payable com consumer_id e order_value
              └── Publica na fila cashback_distribuicao
                    └── Consumer (cashback-distribuicao)
                          └── POST /distribuicao/:payable_id
                                └── DistribuirCashbackUseCase
```

# Citations

[1] [Consumer Asaas](/../../../D:/_lab/node/consumer/consumers/asaas-receive-payment.consumer.ts)
[2] [Consumer Cashback](/../../../D:/_lab/node/consumer/consumers/cashback-distribuicao.consumer.ts)
