---
type: API Endpoint
title: POST /indicacao
description: Cadastra um novo consumer na rede de cashback a partir de um codigo de indicacao.
resource: http://localhost:3555/indicacao
tags: [endpoint, post, indicacao, cadastro]
timestamp: 2026-08-17T00:00:00Z
method: POST
path: /indicacao
usecase: CreateIndicacaoUseCase
source: src/indicacao/indicacao.controller.ts
capability: /domain/indicacao.md
---

# Contrato

## Request (body)

```json
{
  "id": "uuid-do-consumer-public",
  "username": "joao_silva",
  "nickname": "Joao",
  "full_name": "Joao Silva",
  "referral_id": "uuid-do-indicador"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `id` | `string` | sim | ID do consumer em `public.consumer` |
| `username` | `string` | sim | Nome de usuario |
| `nickname` | `string \| null` | nao | Apelido |
| `full_name` | `string \| null` | nao | Nome completo |
| `referral_id` | `string` | sim | ID do consumer que indicou |

## Response 200

```json
{
  "id": "uuid",
  "username": "joao_silva",
  "full_name": "Joao Silva",
  "referral_code": "uuid-gerado",
  "referred_by": "uuid-do-indicador",
  "referred_by_level2": "uuid-do-indicador-do-indicador",
  "referral_status": "pending",
  "cashback_balance": 0.0,
  "created_at": "...",
  "updated_at": "..."
}
```

# Comportamento

1. Verifica se o consumer ja esta cadastrado no schema cashback.
2. Busca o indicador pelo `referral_id`.
3. Copia `referred_by` (nivel 1) e `referred_by_level2` (nivel 2 do indicador).
4. Gera um `referral_code` (UUID).
5. Cria o consumer com `referral_status = 'pending'` e `cashback_balance = 0`.

# Validacoes

| Ordem | Condicao | Status | Mensagem |
|---|---|---|---|
| 1 | Consumer ja cadastrado | `400` | `Consumidor ja cadastrado na rede de cashback` |
| 2 | Indicador nao encontrado | `400` | `Codigo de indicacao invalido ou nao encontrado` |

# Citations

[1] [Controller](/../../src/indicacao/indicacao.controller.ts)
[2] [Use case](/../../src/indicacao/usecase/create-indicacao.usecase.ts)
