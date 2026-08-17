# Endpoints

## Distribuicao

* [POST /distribuicao/:payable_id](post-distribuicao.md) - Dispara a distribuicao de cashback para um payable.

## Indicacao

* [POST /indicacao](post-indicacao.md) - Cadastra um novo consumer na rede de indicacao.
* [PATCH /indicacao/:id/activate](patch-indicacao-activate.md) - Ativa um consumer pendente.
* [GET /indicacao/:consumerId/indicados](get-indicacao-indicados.md) - Lista indicados de um consumer.

## Extrato

* [GET /extrato/:consumerId](get-extrato.md) - Retorna saldo e extrato de transacoes.

## Auth

* [POST /auth/login](post-auth-login.md) - Autentica e retorna JWT.
* [POST /auth/refresh](post-auth-refresh.md) - Renova token JWT.

## Infraestrutura

* [GET /health](get-health.md) - Healthcheck da aplicacao.
