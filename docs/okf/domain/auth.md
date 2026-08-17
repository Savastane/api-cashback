---
type: Capability
title: Autenticacao
description: Autenticacao de usuarios via JWT com login e refresh de token.
tags: [auth, jwt, login, refresh, seguranca]
timestamp: 2026-08-17T00:00:00Z
module: src/auth
status: implementado
persistence: nenhuma (stateless JWT)
---

# Objetivo

Fornecer autenticacao stateless via JWT para proteger os endpoints da API.

# Escopo

| Operacao | Endpoint | Use case |
|---|---|---|
| Login | [POST /auth/login](/endpoints/post-auth-login.md) | `AuthService.login` |
| Refresh token | [POST /auth/refresh](/endpoints/post-auth-refresh.md) | `AuthService.refreshToken` |

# Arquitetura

```
AuthController
  └── AuthService ──► JwtStrategy (validacao de token)
```

# Arquivos

| Papel | Caminho |
|---|---|
| Controller | `src/auth/auth.controller.ts` |
| Service | `src/auth/auth.service.ts` |
| Module | `src/auth/auth.module.ts` |
| Guard | `src/auth/guards/jwt-auth.guard.ts` |
| Strategy | `src/auth/strategies/jwt.strategy.ts` |

# Citations

[1] [Controller](/../../src/auth/auth.controller.ts)
[2] [Service](/../../src/auth/auth.service.ts)
