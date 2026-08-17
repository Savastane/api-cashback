---
type: Component
title: SupabaseClient
description: Cliente Supabase injetado via dependency injection para acesso aos schemas public e cashback.
tags: [component, supabase, infraestrutura, di]
timestamp: 2026-08-17T00:00:00Z
source: src/supabase/supabase.module.ts
exported_by: SupabaseModule
---

# Injecao

O `SupabaseClient` e criado no `SupabaseModule` e injetado em todos os repositorios via token `SUPABASE_CLIENT`.

```ts
constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}
```

# Schemas

O cliente acessa dois schemas do mesmo projeto Supabase:

| Schema | Tabelas |
|---|---|
| `public` | `consumer`, `payable`, `partners`, `orders` |
| `cashback` | `consumer`, `transaction`, `rates` |

# Provider

[Supabase](/providers/supabase.md)

# Citations

[1] [Modulo](/../../src/supabase/supabase.module.ts)
