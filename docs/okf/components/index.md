# Componentes

## Use Cases

* [DistribuirCashbackUseCase](distribuir-cashback-usecase.md) - Use case de distribuicao em tres niveis.
* [CreateIndicacaoUseCase](create-indicacao-usecase.md) - Use case de cadastro de indicacao.
* [ActivateConsumerUseCase](activate-consumer-usecase.md) - Use case de ativacao de consumer.
* [GetIndicadosUseCase](get-indicados-usecase.md) - Use case de listagem de indicados.
* [GetExtratoUseCase](get-extrato-usecase.md) - Use case de extrato de cashback.

## Services

* [ProduceService](produce-service.md) - Servico de publicacao na API mensageria-produce.

## Repositorios

* [CashbackTransactionRepository](cashback-transaction-repository.md) - Repositorio do ledger de transacoes (schema cashback).
* [CashbackConsumerRepository](cashback-consumer-repository.md) - Repositorio do consumer do schema cashback.
* [ConsumerRepository](consumer-repository.md) - Repositorio do consumer do schema public.
* [PayableRepository](payable-repository.md) - Repositorio de payables.
* [CashbackRatesRepository](cashback-rates-repository.md) - Repositorio de taxas ativas.
* [PartnerRepository](partner-repository.md) - Repositorio de parceiros/lojas.
* [ExtratoRepository](extrato-repository.md) - Repositorio de extrato.

## Infraestrutura

* [SupabaseClient](supabase-client.md) - Cliente Supabase injetado via DI.
