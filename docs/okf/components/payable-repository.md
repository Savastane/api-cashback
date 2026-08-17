---
type: Repository
title: PayableRepository
description: Repositorio de payables do schema public com busca por ID dos campos criticos para distribuicao.
tags: [repository, payable, public, supabase]
timestamp: 2026-08-17T00:00:00Z
source: src/distribuicao/repository/payable.repository.ts
schema: public
table: payable
exported_by: DistribuicaoModule
---

# Metodos

| Metodo | Descricao |
|---|---|
| `findById(id)` | Busca um payable pelo ID, retornando `id, consumer_id, order_value, order_id, partner_id, status, consumer_name`. |

# Entidade

[Payable](/entities/payable.md)

# Citations

[1] [Implementacao](/../../src/distribuicao/repository/payable.repository.ts)
