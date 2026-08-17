---
type: Business Rule
title: Notificacao Fire-and-Forget
description: Falhas na publicacao de notificacoes WhatsApp nao revertem as transacoes de cashback ja gravadas no ledger.
tags: [regra, notificacao, whatsapp, fire-and-forget, resiliencia]
timestamp: 2026-08-17T00:00:00Z
enforced_by: DistribuirCashbackUseCase
source: src/distribuicao/usecase/distribuir-cashback.usecase.ts
applies_to: /domain/cashback-distribution.md
---

# Enunciado

A publicacao de mensagens WhatsApp apos a distribuicao de cashback e tratada como fire-and-forget: se o [ProduceService](/components/produce-service.md) falhar, o erro e apenas logado e a distribuicao retorna sucesso.

# Motivacao

Se a notificacao falhasse e revertesse a transacao de cashback, um retry do RabbitMQ criaria uma nova transacao, mas a unique index barraria a duplicata. O consumer receberia `already_distributed: true` e nao publicaria a notificacao novamente, resultando em cashback sem notificacao.

A opcao escolhida prioriza a integridade do cashback sobre a garantia de entrega da notificacao.

# Comportamento

| Cenario | Resultado |
|---|---|
| Transacao criada + notificacao OK | Cashback creditado + WhatsApp enviado |
| Transacao criada + notificacao falha | Cashback creditado + log de erro (sem WhatsApp) |
| Retry apos notificacao falha | `already_distributed: true`, sem nova notificacao |

# Pendencia

Para garantir entrega de notificacao, considerar um padrao outbox no futuro: uma tabela `notification_outbox` na mesma transacao do ledger, com um worker dedicado reenviando ate confirmacao.

# Citations

[1] [Use case](/../../src/distribuicao/usecase/distribuir-cashback.usecase.ts)
