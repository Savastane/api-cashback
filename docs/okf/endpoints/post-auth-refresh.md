---
type: API Endpoint
title: POST /auth/refresh
description: Renova o JWT access token a partir de um refresh token valido.
resource: http://localhost:3555/auth/refresh
tags: [endpoint, post, auth, refresh, jwt]
timestamp: 2026-08-17T00:00:00Z
method: POST
path: /auth/refresh
usecase: AuthService.refreshToken
source: src/auth/auth.controller.ts
capability: /domain/auth.md
---

# Contrato

## Request (body)

```json
{
  "refresh_token": "..."
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
