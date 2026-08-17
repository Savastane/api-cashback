---
type: API Endpoint
title: GET /health
description: Healthcheck da aplicacao verificando memoria heap e disco.
resource: http://localhost:3555/health
tags: [endpoint, get, health, infraestrutura]
timestamp: 2026-08-17T00:00:00Z
method: GET
path: /health
source: src/health/health.controller.ts
---

# Contrato

## Response 200

```json
{
  "status": "ok",
  "info": {
    "memory_heap": { "status": "up" },
    "disk_health": { "status": "up" }
  },
  "error": {}
}
```

# Comportamento

Verifica:
* Memoria heap: limite de 150 MB.
* Disco: threshold de 90% em `C:\`.

# Citations

[1] [Controller](/../../src/health/health.controller.ts)
