---
name: okf-update
description: Atualiza a documentacao OKF (Open Knowledge Framework) com base no codigo fonte atual
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - find_file_by_name
  - code_search
  - exec
permissions:
  allow:
    - Read(src/**)
    - Read(script/**)
    - Read(package.json)
    - Read(.env)
    - Read(docs/okf/**)
    - Write(docs/okf/**)
triggers:
  - user
  - model
---

# Atualizar documentacao OKF

Voce e responsavel por manter a documentacao OKF (Open Knowledge Framework) do projeto `api-cashback` sempre sincronizada com o codigo fonte.

A documentacao OKF tambem serve como **spec de contexto** para o amadurecimento do projeto — ela deve refletir fielmente o estado atual do codigo para que agentes de IA e humanos possam navegar pelo dominio.

## Especificacao OKF

O formato OKF esta definido em https://okf.ia.br/spec/ . Resumo das regras de conformidade:

1. Todo arquivo `.md` nao-reservado (`index.md`, `log.md`) deve ter frontmatter YAML com pelo menos o campo `type`.
2. Frontmatter recomendado: `type`, `title`, `description`, `tags`, `timestamp`, `source`.
3. Links entre concepts usam caminhos absolutos relativos ao bundle (ex: `/entities/foo.md`).
4. `index.md` lista o conteudo do diretorio sem frontmatter.
5. `log.md` registra o historico de atualizacoes agrupado por data ISO.

## Estrutura do OKF

A documentacao OKF esta em `docs/okf/` com a seguinte estrutura:

```
docs/okf/
  index.md              # Entry point do bundle
  log.md                # Historico de atualizacoes
  domain/               # Capacidades do dominio
    index.md
    cashback-distribution.md
    indicacao.md
    extrato.md
    auth.md
  entities/             # Entidades / contratos de dados
    index.md
    cashback-consumer.md
    consumer.md
    cashback-transaction.md
    cashback-rates.md
    payable.md
    payload.md
  endpoints/            # Endpoints REST
    index.md
    post-distribuicao.md
    post-indicacao.md
    patch-indicacao-activate.md
    get-indicacao-indicados.md
    get-extrato.md
    post-auth-login.md
    post-auth-refresh.md
    get-health.md
  rules/                # Regras de negocio transversais
    index.md
    idempotency.md
    balance-trigger.md
    cashback-levels.md
    notification-fire-forget.md
    payment-confirmed-trigger.md
  components/           # Use cases, services e repositorios
    index.md
    distribuir-cashback-usecase.md
    create-indicacao-usecase.md
    activate-consumer-usecase.md
    get-indicados-usecase.md
    get-extrato-usecase.md
    produce-service.md
    cashback-transaction-repository.md
    cashback-consumer-repository.md
    consumer-repository.md
    payable-repository.md
    cashback-rates-repository.md
    partner-repository.md
    extrato-repository.md
    supabase-client.md
  providers/            # Integracoes com providers externos
    index.md
    supabase.md
    mensageria-produce.md
```

## Tipos de Concept

Os tipos `type` usados neste projeto:

| Tipo | Onde | Descricao |
|---|---|---|
| `Capability` | `domain/` | Capacidade funcional da API |
| `Entity` | `entities/` | Modelo de dados / contrato |
| `API Endpoint` | `endpoints/` | Endpoint REST |
| `Business Rule` | `rules/` | Regra de negocio transversal |
| `UseCase` | `components/` | Use case do dominio |
| `Component` | `components/` | Componente de software (service, infra) |
| `Repository` | `components/` | Repositorio de persistencia (Supabase) |
| `Provider` | `providers/` | Integracao com provider externo |

## Processo de Sincronizacao

Siga estes passos rigorosamente:

### 1. Analisar o codigo fonte atual

Leia todos os arquivos relevantes para entender a arquitetura atual:

- `src/app.module.ts` — modulos registrados
- `src/main.ts` — bootstrap
- `src/distribuicao/` — controller, module, usecase, repositories
- `src/indicacao/` — controller, module, usecases, repository
- `src/extrato/` — controller, module, usecase, repository
- `src/auth/` — controller, service, guards, strategies
- `src/health/` — controller, module
- `src/model/` — todos os modelos TypeScript
- `src/service/` — ProduceService, PayloadService
- `src/supabase/` — modulo Supabase
- `script/cashback/` — SQL de idempotencia e trigger
- `package.json` — dependencias e scripts

### 2. Ler toda a documentacao OKF atual

Leia todos os arquivos em `docs/okf/` para entender o estado atual da documentacao.

### 3. Identificar discrepancias

Compare o codigo fonte com a documentacao. Procure por:

- **Endpoints novos ou removidos**: Controllers tem rotas que nao estao documentadas?
- **Mudancas em use cases**: A logica, validacoes ou fluxo de algum use case mudou?
- **Novas entidades/campos**: Interfaces ou modelos foram adicionados, removidos ou alterados?
- **Mudancas em regras de negocio**: Comportamentos, validacoes ou idempotencia mudaram?
- **Novas dependencias**: Um use case agora depende de um novo repositorio ou service?
- **Mudancas em repositorios**: Novas tabelas, queries, campos?
- **Mudancas em services**: Metodos novos, assinaturas alteradas, novas integracoes HTTP?
- **Mudancas no SQL**: Scripts de trigger, idempotencia ou migracao mudaram?
- **Novos providers**: Uma nova API externa foi integrada?

### 4. Atualizar a documentacao

Para cada discrepancia encontrada, atualize os arquivos OKF correspondentes:

- **Novo endpoint**: Crie o arquivo em `endpoints/`, adicione ao `endpoints/index.md` e ao `index.md` raiz.
- **Endpoint removido**: Remova o arquivo e a referencia dos indices.
- **Mudanca em endpoint**: Atualize o arquivo em `endpoints/` refletindo o novo comportamento.
- **Mudanca em entidade**: Atualize o arquivo em `entities/` com os novos campos/tipos.
- **Nova regra**: Crie o arquivo em `rules/` e referencie nos componentes/capacidades afetados.
- **Nova capacidade**: Adicione ao `domain/`.
- **Novo use case**: Crie o arquivo em `components/`, adicione ao `components/index.md` e ao `index.md` raiz.
- **Novo repositorio**: Crie o arquivo em `components/`, adicione ao `components/index.md` e ao `index.md` raiz.
- **Novo provider**: Crie o arquivo em `providers/`, adicione ao `providers/index.md` e ao `index.md` raiz.
- **Mudanca em filas**: Atualize `providers/mensageria-produce.md` e `rules/cashback-levels.md`.
- **Mudanca em idempotencia**: Atualize `rules/idempotency.md` e `entities/cashback-transaction.md`.

### 5. Atualizar o log

Sempre atualize `docs/okf/log.md` com as mudancas feitas. Adicione uma nova secao com a data atual no formato `## YYYY-MM-DD` e liste cada alteracao com bullets `* **Tipo**: Descricao`.

Se ja existir uma secao para a data atual, adicione os bullets a ela.

### 6. Atualizar indices

Certifique-se de que todos os `index.md` reflitam fielmente o conteudo de suas respectivas pastas:

- `docs/okf/index.md` — lista todas as secoes (domain, entities, endpoints, rules, components, providers)
- `docs/okf/domain/index.md`
- `docs/okf/entities/index.md`
- `docs/okf/endpoints/index.md`
- `docs/okf/rules/index.md`
- `docs/okf/components/index.md`
- `docs/okf/providers/index.md`

## Convencoes de Documentacao

### Frontmatter

Cada arquivo de entidade, endpoint, componente, regra, provider e capability DEVE ter frontmatter YAML:

```yaml
---
type: Entity | API Endpoint | Business Rule | UseCase | Component | Repository | Provider | Capability
title: Nome legivel
description: Descricao curta
tags: [tag1, tag2]
timestamp: YYYY-MM-DDTHH:MM:SSZ
source: caminho/do/arquivo.ts
---
```

Campos adicionais podem ser incluidos conforme relevante (ex: `table`, `schema`, `method`, `path`, `usecase`, `capability`, `config_env`, `enforced_by`, `applies_to`, `exported_by`, `persistence`, `status`, `module`).

### Links entre documentos

Use links absolutos relativos ao bundle:

- `[Entidade X](/entities/x.md)`
- `[Componente Y](/components/y.md)`
- `[Regra Z](/rules/z.md)`
- `[Capacidade W](/domain/w.md)`
- `[Endpoint E](/endpoints/e.md)`
- `[Provider P](/providers/p.md)`

### Citations

Sempre inclua a secao `# Citations` no final do documento com links para os arquivos fonte reais:

```markdown
# Citations

[1] [Implementacao](/../../src/distribuicao/usecase/distribuir-cashback.usecase.ts)
```

O padrao `/../../caminho` sobe do diretorio OKF (`docs/okf/`) ate a raiz do projeto.

### Idioma

Toda documentacao em portugues brasileiro (pt_BR), sem acentos nos nomes de arquivo mas com acentos no corpo do texto.

### Arquivos `index.md`

Arquivos `index.md` **nao** tem frontmatter. Sao listagens simples do conteudo do diretorio:

```markdown
# Titulo da Secao

* [Item A](item-a.md) - Descricao curta
* [Item B](item-b.md) - Descricao curta
```

### Arquivo `log.md`

O `log.md` **nao** tem frontmatter. Formato:

```markdown
# Update Log

## 2026-08-17

* **Init**: Descricao
* **Create**: Descricao
* **Update**: Descricao
```

## Regras Importantes

- **NUNCA invente endpoints, use cases, entidades ou regras** que nao existam no codigo fonte.
- **SEMPRE preserve o formato e estilo** dos documentos existentes.
- **NAO remova documentacao de coisas que ainda existem** no codigo.
- **SEMPRE verifique o `package.json`** para dependencias e scripts de build.
- **SEMPRE verifique o `.env`** para variaveis de ambiente esperadas (nao exponha valores reais).
- **NAO exponha secrets ou credenciais** — referencie apenas o nome da variavel de ambiente.
- **SEMPRE verifique os arquivos em `script/`** para SQL de trigger, idempotencia e migracoes.

## Verificacao Final

Apos atualizar a documentacao, verifique:

1. Todos os `index.md` estao atualizados
2. O `log.md` registra as mudancas do dia
3. Nenhum link interno esta quebrado (o alvo existe)
4. O `npm run build` continua passando (a documentacao nao deve afetar o build, mas mudancas de codigo feitas junto devem ser verificadas)
5. Todos os endpoints mapeados nos controllers tem documentacao em `endpoints/`
6. Todos os use cases tem documentacao em `components/`
7. Todos os modelos em `src/model/` tem documentacao em `entities/`
8. Todos os repositorios tem documentacao em `components/`
9. Todos os services tem documentacao em `components/`
10. Todos os providers externos tem documentacao em `providers/`
