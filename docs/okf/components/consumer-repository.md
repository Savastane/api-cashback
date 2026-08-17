---
type: Repository
title: ConsumerRepository
description: Repositorio do consumer do schema public com foco em dados de contato e whatsapp_number para notificacoes.
tags: [repository, consumer, public, whatsapp, supabase]
timestamp: 2026-08-17T00:00:00Z
source: src/distribuicao/repository/consumer.repository.ts
schema: public
table: consumer
exported_by: DistribuicaoModule
---

# Metodos

| Metodo | Descricao |
|---|---|
| `findById(id)` | Busca um consumer completo pelo ID (todas as colunas exceto password). |
| `findByIds(ids)` | Busca consumers em lote. |
| `findPhoneById(id)` | Busca `whatsapp_number` (fallback `phone`) de um consumer. |
| `findPhonesByIds(ids)` | Busca `whatsapp_number` em lote, retornando `Map<consumerId, phone>`. |

# Entidade

[Consumer](/entities/consumer.md)

# Uso na Distribuicao

O `DistribuirCashbackUseCase` usa `findPhonesByIds` para resolver os telefones WhatsApp dos tres niveis de consumers (comprador, indicador nivel 1, indicador nivel 2) em uma unica query.

# Citations

[1] [Implementacao](/../../src/distribuicao/repository/consumer.repository.ts)
[2] [Modelo](/../../src/model/consumer.model.ts)
