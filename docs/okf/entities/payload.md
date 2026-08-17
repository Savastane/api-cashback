---
type: Entity
title: Payload
description: Estrutura de mensagem publicada na API mensageria-produce para envio a filas RabbitMQ.
tags: [entity, payload, mensagem, rabbitmq, producer]
timestamp: 2026-08-17T00:00:00Z
source: src/model/payload.model.ts
persistence: nenhuma-mensagem-publicada
---

# Schema

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `id` | `string` | sim | UUID unico da mensagem |
| `exchange` | `string` | sim | Exchange RabbitMQ (ex: `whatsapp`) |
| `queue` | `string` | sim | Nome da fila (ex: `whatsapp_cashback_compra`) |
| `data` | `any` | sim | Corpo da mensagem (campos do template WhatsApp) |
| `timestamp` | `string` | sim | ISO timestamp |
| `routingKey` | `string` | sim | Routing key (ex: `cashback-compra`) |

# Tipos

```ts
export interface PayloadModel {
  id: string;
  exchange: string;
  queue: string;
  data: any;
  timestamp: string;
  routingKey: string;
}
```

# Uso

O [ProduceService](/components/produce-service.md) envia este payload via `POST` para a [Mensageria Produce API](/providers/mensageria-produce.md).

# Citations

[1] [Modelo](/../../src/model/payload.model.ts)
[2] [Service](/../../src/service/produce.service.ts)
