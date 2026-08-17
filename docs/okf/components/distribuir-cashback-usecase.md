---
type: UseCase
title: DistribuirCashbackUseCase
description: Use case de distribuicao de cashback em tres niveis com idempotencia, publicacao de notificacoes WhatsApp e tratamento de concorrencia.
tags: [usecase, distribuicao, cashback, whatsapp, idempotencia]
timestamp: 2026-08-17T00:00:00Z
source: src/distribuicao/usecase/distribuir-cashback.usecase.ts
exported_by: DistribuicaoModule
---

# Interface Publica

```ts
async execute(request: DistribuirCashbackRequest): Promise<DistribuirCashbackResponse>
```

```ts
interface DistribuirCashbackRequest {
  payable_id: string;
}

interface DistribuirCashbackResponse {
  payable_id: string;
  order_value: number;
  transactions: CashbackTransaction[];
  already_distributed: boolean;
}
```

# Dependencias

* `PayableRepository` — busca o payable.
* `CashbackRatesRepository` — busca taxas ativas.
* `CashbackTransactionRepository` — cria e consulta transacoes do ledger.
* `ConsumerRepository` — busca telefones WhatsApp do schema public.
* `PartnerRepository` — busca nome do parceiro/loja.
* `ProduceService` — publica mensagens WhatsApp.
* `CASHBACK_CONSUMER_REPO` (token) — busca consumers do schema cashback.

# Comportamento

1. Busca payable; valida `consumer_id` e `order_value`.
2. Pre-check de idempotencia: se ja distribuido, retorna `already_distributed: true`.
3. Busca consumer nivel 0, taxas ativas, telefones WhatsApp e nome do parceiro em paralelo.
4. Calcula `amount0`, `amount1`, `amount2` com base nos percentuais.
5. Cria transacoes no ledger (nivel 0, 1, 2) — o trigger do banco atualiza o saldo.
6. Em caso de unique constraint error, recarrega transacoes e retorna `already_distributed: true`.
7. Publica notificacoes WhatsApp para cada nivel com telefone valido.
8. Falhas de notificacao sao logadas mas nao revertem o cashback.

# Filas de Notificacao

| Nivel | Exchange | Queue | Routing Key |
|---|---|---|---|
| 0 | `whatsapp` | `whatsapp_cashback_compra` | `cashback-compra` |
| 1 | `whatsapp` | `whatsapp_cashback_rede` | `cashback-rede` |
| 2 | `whatsapp` | `whatsapp_cashback_rede` | `cashback-rede` |

# Regras

* [Idempotencia de Distribuicao](/rules/idempotency.md)
* [Saldo via Trigger](/rules/balance-trigger.md)
* [Niveis de Cashback](/rules/cashback-levels.md)
* [Notificacao Fire-and-Forget](/rules/notification-fire-forget.md)

# Capacidade

[Distribuicao de Cashback](/domain/cashback-distribution.md)

# Citations

[1] [Implementacao](/../../src/distribuicao/usecase/distribuir-cashback.usecase.ts)
[2] [Teste](/../../src/distribuicao/usecase/distribuir-cashback.usecase.spec.ts)
