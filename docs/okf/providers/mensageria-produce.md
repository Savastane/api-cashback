---
type: Provider
title: Mensageria Produce
description: API externa de publicacao em filas RabbitMQ, consumida via POST pelo ProduceService.
tags: [provider, mensageria, rabbitmq, produce, http]
timestamp: 2026-08-17T00:00:00Z
config_env: PRODUCE_API_URL
---

# Visao Geral

A API `mensageria-produce` recebe mensagens via `POST /publish` e as encaminha para filas RabbitMQ.

# Endpoint

```
POST {PRODUCE_API_URL}/publish
```

# Payload

Ver [Payload](/entities/payload.md).

# Filas Usadas pelo api-cashback

| Exchange | Queue | Routing Key | Uso |
|---|---|---|---|
| `whatsapp` | `whatsapp_cashback_compra` | `cashback-compra` | Notificacao de cashback da compra propria (nivel 0) |
| `whatsapp` | `whatsapp_cashback_rede` | `cashback-rede` | Notificacao de cashback de indicacao (niveis 1 e 2) |

# Configuracao

| Variavel | Descricao | Default |
|---|---|---|
| `PRODUCE_API_URL` | URL base da API produce | `https://produce.redecity.com.br` |

O [ProduceService](/components/produce-service.md) normaliza a URL removendo `/publish` sufixo e barras finais, entao adiciona `/publish`.

# Citations

[1] [ProduceService](/../../src/service/produce.service.ts)
[2] [Projeto mensageria-produce](/../../../D:/_lab/nestjs/mensageria-produce)
