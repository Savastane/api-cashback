# Regras de Negocio

## Distribuicao

* [Idempotencia de Distribuicao](idempotency.md) - Unique index em `(payable_id, consumer_id, type)` previne duplicatas.
* [Saldo via Trigger](balance-trigger.md) - Salso do consumer e atualizado por trigger do PostgreSQL, nao pela aplicacao.
* [Niveis de Cashback](cashback-levels.md) - Tres niveis: compra propria (0), indicador direto (1), indicador do indicador (2).
* [Notificacao Fire-and-Forget](notification-fire-forget.md) - Falhas na publicacao WhatsApp nao revertem transacoes de cashback.
* [Gatilho PAYMENT_CONFIRMED](payment-confirmed-trigger.md) - Distribuicao e enfileirada apos `PAYMENT_CONFIRMED`, nao `PAYMENT_RECEIVED`.
