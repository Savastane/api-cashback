---
description: Criar endpoint NestJS baseado no módulo Hello com TDD obrigatório
---

Objetivo: criar um novo endpoint seguindo o padrão atual do módulo `hello` e **sempre** no fluxo TDD (Red -> Green -> Refactor).

## Entradas obrigatórias
- `feature_name` (ex.: `users`, `health`, `orders`)
- `endpoint_method` (ex.: `GET`, `POST`)
- `endpoint_path` (ex.: `users`, `orders/:id`)
- `usecase_name` (ex.: `GetUsersUseCase`, `CreateOrderUseCase`)
- `controller_method_name` (ex.: `getUsers`, `createOrder`)
- `response_contract` (interface TypeScript da resposta)

## Referência de padrão no projeto
- Controller: `src/hello/hello.controller.ts`
- Use case: `src/hello/usecase/get-hello.usecase.ts`
- Teste de controller: `src/hello/hello.controller.spec.ts`
- Teste de use case: `src/hello/usecase/get-hello.usecase.spec.ts`
- Módulo: `src/hello/hello.module.ts`
- Registro no app: `src/app.module.ts`

## Regra obrigatória (TDD)
1. **Nunca** começar pelo código de produção.
2. Escrever primeiro os testes que falham (**RED**).
3. Implementar o mínimo para passar (**GREEN**).
4. Refatorar mantendo testes verdes (**REFACTOR**).
5. **No Use Case, sempre criar e exportar explicitamente os modelos/interfaces de Request e Response correspondentes.**

## Passo a passo

1. Criar estrutura da feature:
   - `src/<feature_name>/<feature_name>.controller.ts`
   - `src/<feature_name>/<feature_name>.controller.spec.ts`
   - `src/<feature_name>/<feature_name>.module.ts`
   - `src/<feature_name>/usecase/<usecase-file-name>.ts`
   - `src/<feature_name>/usecase/<usecase-file-name>.spec.ts`

2. **TDD RED (use case)**
   - Criar primeiro `*.usecase.spec.ts` cobrindo:
     - `should be defined`
     - contrato de resposta (`toHaveProperty` / shape)
     - regra principal de negócio da feature
   - Rodar testes e confirmar falha.

3. **TDD GREEN (use case)**
   - Implementar `*.usecase.ts` com `@Injectable()`.
   - Criar interface de resposta exportada.
   - Implementar `execute(...)` com o mínimo para passar nos testes.

4. **TDD RED (controller)**
   - Criar `*.controller.spec.ts` cobrindo:
     - `should be defined`
     - chamada do `useCase.execute()` com `jest.spyOn`
     - retorno exato da resposta mockada
   - Rodar testes e confirmar falha.

5. **TDD GREEN (controller)**
   - Implementar `*.controller.ts` com decorator correto (`@Controller('<endpoint_path_base>')`).
   - Criar método com decorator HTTP (`@Get`, `@Post`, etc.).
   - Injetar o use case no construtor e delegar para `execute(...)`.

6. Criar `<feature_name>.module.ts`:
   - `controllers: [<FeatureController>]`
   - `providers: [<UseCaseClass>]`

7. Registrar no `AppModule`:
   - adicionar `<FeatureModule>` em `imports`.

8. Validar:
   - Rodar testes unitários da feature.
   - Garantir que todos os testes passam.
   - Se necessário, refatorar nomes e remover duplicações sem quebrar testes.

## Critérios de aceite
- Existe teste de controller e use case.
- Testes foram escritos antes da implementação (TDD).
- Controller apenas orquestra; regra de negócio fica no use case.
- Módulo da feature registrado no `AppModule`.
- Código segue o padrão de organização do `hello`.

## Template rápido de controller (adaptar)
```ts
import { Controller, Get } from '@nestjs/common';
import { <UseCaseClass>, <ResponseInterface> } from './usecase/<usecase-file-name>';

@Controller('<endpoint_base>')
export class <FeatureController> {
  constructor(private readonly useCase: <UseCaseClass>) {}

  @Get()
  <controller_method_name>(): <ResponseInterface> {
    return this.useCase.execute();
  }
}
```

## Template rápido de use case (adaptar)
```ts
import { Injectable } from '@nestjs/common';

export interface <ResponseInterface> {
  // definir campos
}

@Injectable()
export class <UseCaseClass> {
  execute(): <ResponseInterface> {
    return {
      // retornar campos mínimos para passar nos testes
    };
  }
}
```
