# API Cashback — Knowledge Bundle

Bundle OKF descrevendo o dominio da API de cashback RedeCity (`api-cashback`).

Cobertura: distribuicao de cashback em tres niveis (compra propria, indicacao nivel 1 e nivel 2), cadastro e ativacao de indicacoes, extrato de transacoes, autenticacao JWT e healthcheck.

# Capacidades

* [Distribuicao de Cashback](/domain/cashback-distribution.md) - Distribui cashback de um payable em tres niveis e publica notificacoes WhatsApp.
* [Indicacao de Consumers](/domain/indicacao.md) - Cadastro e ativacao de consumers na rede de cashback.
* [Extrato de Cashback](/domain/extrato.md) - Consulta de saldo e historico de transacoes de um consumer.
* [Autenticacao](/domain/auth.md) - Login e refresh de token JWT.

# Entidades

* [Cashback Consumer](/entities/cashback-consumer.md) - Consumer do schema `cashback` com saldo e rede de indicacao.
* [Consumer](/entities/consumer.md) - Consumer do schema `public` com dados de contato e whatsapp.
* [Cashback Transaction](/entities/cashback-transaction.md) - Lancamento imutavel no ledger de cashback.
* [Cashback Rates](/entities/cashback-rates.md) - Taxas percentuais ativas para distribuicao.
* [Payable](/entities/payable.md) - Conta a pagar com vinculo ao consumer e order_value.
* [Payload](/entities/payload.md) - Estrutura de mensagem publicada via producer.

# Endpoints

* [POST /distribuicao/:payable_id](/endpoints/post-distribuicao.md) - Dispara a distribuicao de cashback para um payable.
* [POST /indicacao](/endpoints/post-indicacao.md) - Cadastra um novo consumer na rede de indicacao.
* [PATCH /indicacao/:id/activate](/endpoints/patch-indicacao-activate.md) - Ativa um consumer pendente.
* [GET /indicacao/:consumerId/indicados](/endpoints/get-indicacao-indicados.md) - Lista indicados de um consumer.
* [GET /extrato/:consumerId](/endpoints/get-extrato.md) - Retorna saldo e extrato de transacoes.
* [POST /auth/login](/endpoints/post-auth-login.md) - Autentica e retorna JWT.
* [POST /auth/refresh](/endpoints/post-auth-refresh.md) - Renova token JWT.
* [GET /health](/endpoints/get-health.md) - Healthcheck da aplicacao.

# Regras de Negocio

* [Idempotencia de Distribuicao](/rules/idempotency.md) - Unique index em `(payable_id, consumer_id, type)` previne duplicatas.
* [Saldo via Trigger](/rules/balance-trigger.md) - Saldo do consumer e atualizado por trigger do PostgreSQL, nao pela aplicacao.
* [Niveis de Cashback](/rules/cashback-levels.md) - Tres niveis: compra propria (0), indicador direto (1), indicador do indicador (2).
* [Notificacao Fire-and-Forget](/rules/notification-fire-forget.md) - Falhas na publicacao WhatsApp nao revertem transacoes de cashback.
* [Gatilho PAYMENT_CONFIRMED](/rules/payment-confirmed-trigger.md) - Distribuicao e enfileirada apos `PAYMENT_CONFIRMED`, nao `PAYMENT_RECEIVED`.

# Componentes

* [DistribuirCashbackUseCase](/components/distribuir-cashback-usecase.md) - Use case de distribuicao em tres niveis.
* [CreateIndicacaoUseCase](/components/create-indicacao-usecase.md) - Use case de cadastro de indicacao.
* [ActivateConsumerUseCase](/components/activate-consumer-usecase.md) - Use case de ativacao de consumer.
* [GetIndicadosUseCase](/components/get-indicados-usecase.md) - Use case de listagem de indicados.
* [GetExtratoUseCase](/components/get-extrato-usecase.md) - Use case de extrato de cashback.
* [ProduceService](/components/produce-service.md) - Servico de publicacao na API mensageria-produce.
* [CashbackTransactionRepository](/components/cashback-transaction-repository.md) - Repositorio do ledger de transacoes.
* [CashbackConsumerRepository](/components/cashback-consumer-repository.md) - Repositorio do consumer do schema cashback.
* [ConsumerRepository](/components/consumer-repository.md) - Repositorio do consumer do schema public.
* [PayableRepository](/components/payable-repository.md) - Repositorio de payables.
* [CashbackRatesRepository](/components/cashback-rates-repository.md) - Repositorio de taxas ativas.
* [PartnerRepository](/components/partner-repository.md) - Repositorio de parceiros/lojas.
* [ExtratoRepository](/components/extrato-repository.md) - Repositorio de extrato.
* [SupabaseClient](/components/supabase-client.md) - Cliente Supabase injetado via DI.

# Providers

* [Supabase](/providers/supabase.md) - Banco de dados PostgreSQL (schemas `public` e `cashback`).
* [Mensageria Produce](/providers/mensageria-produce.md) - API de publicacao em filas RabbitMQ.

# Fora de Escopo

* Resgate/resgate de cashback (redemption) — modelo existe mas nao ha endpoint dedicado.
* Ajustes manuais de saldo (adjustment) — sem endpoint proprio.
* Fechamento mensal (balancemonth) — sem endpoint proprio.
* Gestao de taxas (CRUD de cashback.rates) — apenas leitura da taxa ativa.
