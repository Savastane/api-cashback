---
type: API Endpoint
title: POST /distribuicao/:payable_id
description: Dispara a distribuicao de cashback para um payable em tres niveis e publica notificacoes WhatsApp.
resource: http://localhost:3555/distribuicao/:payable_id
tags: [endpoint, post, distribuicao, cashback]
timestamp: 2026-08-17T00:00:00Z
method: POST
path: /distribuicao/:payable_id
usecase: DistribuirCashbackUseCase
source: src/distribuicao/distribuicao.controller.ts
capability: /domain/cashback-distribution.md
---

# Contrato

## Request

Sem body. O `payable_id` vem como path parameter.

## Response 200

```json
{
  "payable_id": "uuid-do-payable",
  "order_value": 100.0,
  "transactions": [
    { "id": "tx-uuid", "consumer_id": "...", "type": "purchase_cashback", "direction": "in", "amount": 5.0, "payable_id": "...", "order_id": "...", "description": "CashBack Compras", "occurred_at": "...", "created_at": "...", "transaction_id": null },
    { "id": "tx-uuid", "consumer_id": "...", "type": "referral_cashback", "direction": "in", "amount": 2.0, "payable_id": "...", "order_id": "...", "description": "CashBack Compras Indicado", "occurred_at": "...", "created_at": "...", "transaction_id": null },
    { "id": "tx-uuid", "consumer_id": "...", "type": "referral_cashback", "direction": "in", "amount": 1.0, "payable_id": "...", "order_id": "...", "description": "CashBack Compras Indicado", "occurred_at": "...", "created_at": "...", "transaction_id": null }
  ],
  "already_distributed": false
}
```

# Comportamento

1. Busca o payable pelo `payable_id`.
2. Valida `consumer_id` e `order_value` no payable.
3. Verifica idempotencia: se ja existem transacoes de distribuicao para o payable, retorna `already_distributed: true`.
4. Busca o consumer nivel 0, as taxas ativas e os telefones WhatsApp.
5. Calcula e cria transacoes para niveis 0, 1 e 2.
6. Publica mensagens WhatsApp para cada nivel com telefone valido.
7. Retorna as transacoes criadas.

# Validacoes

| Ordem | Condicao | Status | Mensagem |
|---|---|---|---|
| 1 | Payable nao encontrado | `400` | `Payable nao encontrado` |
| 2 | `consumer_id` ausente | `400` | `Payable sem consumer_id vinculado` |
| 3 | `order_value` ausente | `400` | `Payable sem order_value definido` |
| 4 | Consumer nao encontrado no schema cashback | `400` | `Consumer do payable nao encontrado na rede de cashback` |
| 5 | Nenhuma taxa ativa | `400` | `Nenhuma taxa de cashback ativa encontrada` |

# Codigos de Resposta

| Codigo | Situacao |
|---|---|
| `200` | Distribuicao realizada (ou ja distribuida) |
| `400` | Validacao falhou |

# Entidades

* [Payable](/entities/payable.md)
* [Cashback Transaction](/entities/cashback-transaction.md)
* [Cashback Consumer](/entities/cashback-consumer.md)
* [Payload](/entities/payload.md)

# Citations

[1] [Controller](/../../src/distribuicao/distribuicao.controller.ts)
[2] [Use case](/../../src/distribuicao/usecase/distribuir-cashback.usecase.ts)
