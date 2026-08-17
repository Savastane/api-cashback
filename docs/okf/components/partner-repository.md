---
type: Repository
title: PartnerRepository
description: Repositorio de parceiros/lojas do schema public com busca de nome por ID.
tags: [repository, partner, public, supabase]
timestamp: 2026-08-17T00:00:00Z
source: src/distribuicao/repository/partner.repository.ts
schema: public
table: partners
exported_by: DistribuicaoModule
---

# Metodos

| Metodo | Descricao |
|---|---|
| `findNameById(partnerId)` | Busca o nome do parceiro pelo ID. Retorna `null` em caso de erro ou nao encontrado. |

# Uso na Distribuicao

O nome do parceiro e usado como `origemName` nas notificacoes WhatsApp. Se o parceiro nao for encontrado, o use case usa fallback `'RedeCity'`.

# Citations

[1] [Implementacao](/../../src/distribuicao/repository/partner.repository.ts)
