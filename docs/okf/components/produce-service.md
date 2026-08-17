---
type: Component
title: ProduceService
description: Servico de publicacao de mensagens na API mensageria-produce para envio a filas RabbitMQ.
tags: [component, service, producer, rabbitmq, http]
timestamp: 2026-08-17T00:00:00Z
source: src/service/produce.service.ts
exported_by: DistribuicaoModule
---

# Interface Publica

```ts
async publish(message: PayloadModel): Promise<AxiosResponse>
```

# Dependencias

* `HttpService` (@nestjs/axios) — cliente HTTP.
* `ConfigService` — le `PRODUCE_API_URL`.

# Comportamento

1. Le `PRODUCE_API_URL` do ambiente (default: `https://produce.redecity.com.br`).
2. Normaliza a URL removendo `/publish` sufixo e barras finais, entao adiciona `/publish`.
3. Faz `POST` para `{url}/publish` com o [Payload](/entities/payload.md).

# Provider

[Mensageria Produce](/providers/mensageria-produce.md)

# Citations

[1] [Implementacao](/../../src/service/produce.service.ts)
[2] [Modelo Payload](/../../src/model/payload.model.ts)
