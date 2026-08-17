---
type: API Endpoint
title: POST /auth/login
description: Autentica um usuario e retorna um JWT access token e refresh token.
resource: http://localhost:3555/auth/login
tags: [endpoint, post, auth, login, jwt]
timestamp: 2026-08-17T00:00:00Z
method: POST
path: /auth/login
usecase: AuthService.login
source: src/auth/auth.controller.ts
capability: /domain/auth.md
---

# Contrato

## Request (body)

```json
{
  "username": "admin",
  "password": "..."
}
```

## Response 200

```json
{
  "access_token": "...",
  "refresh_token": "..."
}
```

# Citations

[1] [Controller](/../../src/auth/auth.controller.ts)
[2] [Service](/../../src/auth/auth.service.ts)
