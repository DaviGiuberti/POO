# Changelog

Todas as mudanças relevantes deste projeto estão documentadas aqui.
O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o projeto segue o [Versionamento Semântico](https://semver.org/lang/pt-BR/).

Comparação de referência: a versão "antiga" publicada em
<https://github.com/DaviGiuberti/POO> evoluiu até o estado atual descrito abaixo.

---

## [1.1.0] - Não lançado (estado atual)

Esta é a maior atualização do projeto: o código deixou de ser um conjunto de
classes soltas e passou a ter uma **arquitetura em camadas** (entidades → casos
de uso → adaptadores → borda), com **persistência real**, **polimorfismo** em
vários pontos e uma **suíte de testes automatizados**.

### Adicionado

- **Camada de Casos de Uso** (`src/casos-de-uso/`) — orquestra as regras de
  negócio recebendo os repositórios por injeção de dependência:
  - `ComprarItem` — valida saldo, aplica promoção e cashback, registra na
    biblioteca e persiste a conta.
  - `ReembolsarItem` — devolve o valor estornado respeitando a política de prazo.
  - `AdicionarSaldo` — recarrega a carteira validando valores.
- **Planos de assinatura polimórficos** (`src/models/planos/`) — interface
  `PlanoAssinatura` implementada por `PlanoBasico`, `PlanoPlus` e `PlanoPremium`,
  cada um com seu percentual de cashback e janela de reembolso próprios.
- **Promoções polimórficas** (`src/services/promocao.ts`) — classe abstrata
  `Promocao` com `DescontoPercentual` (desconto geral) e `DescontoPorCategoria`
  (desconto focado em um gênero), cada uma calculando o desconto à sua maneira.
- **Persistência em JSON via DTOs** (`src/models/dtos.ts`,
  `src/repo/repositorioJSON.ts`) — a conta é salva e recarregada do disco
  reconstruindo os itens como **instâncias reais** (`Jogo`/`DLC`), não objetos
  crus, através da fábrica `itemFromDTO`.
- **Seed de dados** (`src/infra/seed.ts`) — `popularLojaDeTestes` separa o
  catálogo de jogos/DLCs de teste da lógica principal.
- **Suíte de testes automatizados** (`tests/`) com **Vitest** — 59 testes em 8
  arquivos cobrindo conta, planos, polimorfismo, política de reembolso,
  promoções, repositórios, casos de uso e validações.
- **Ferramentas de qualidade**: ESLint (`eslint.config.mjs`), Prettier
  (`.prettierrc.json` / `.prettierignore`) e integração contínua
  (`.github/workflows/ci.yml`) rodando lint, typecheck e testes.
- **Scripts npm**: `test`, `test:watch`, `test:coverage`, `typecheck`, `lint`,
  `lint:fix`, `format` e `format:check`.
- **Política de reembolso baseada em tempo** (`src/services/PoliticaReembolso.ts`)
  — valida elegibilidade pela data da compra e pelo prazo do plano.
- **DLCs** como itens digitais que complementam um jogo, com desconto fixo de
  complemento e cálculo de "edição completa".
- **Validações de entidade**: itens com ID/título/preço inválidos lançam erro na
  construção; jogo exige gênero; DLC exige jogo-base.

### Alterado

- **Reorganização completa de pastas** em camadas: `models/`, `casos-de-uso/`,
  `repo/`, `services/`, `views/` e `infra/`.
- **`index.ts`** virou apenas a "borda" (interface de terminal): monta os
  repositórios, injeta os casos de uso e cuida do menu — sem regra de negócio.
- **Vitrine da loja** (`src/views/lojaView.ts`) refatorada para exibir os jogos
  por tópicos/categorias e destacar itens em promoção.
- **Cashback** passou a ser calculado conforme o plano do usuário.

### Corrigido

- Bugs de saldo no fluxo de compra/saldo do menu interativo.
- Reconstrução de itens vindos do JSON, que antes voltavam como objetos sem
  métodos.

---

## [1.0.0] - Versão publicada no GitHub

Estado correspondente ao repositório <https://github.com/DaviGiuberti/POO>
antes desta atualização.

### Adicionado

- Sistema polimórfico inicial de promoções e refatoração da vitrine da loja.
- Persistência de dados da conta em JSON e primeira reorganização de pastas.
- Política de reembolso baseada em tempo.
- Menu interativo de terminal com sistema de saldo/carteira.
- Catálogo de jogos e DLCs de teste.

---

## [0.1.0] - Esqueleto inicial

### Adicionado

- Entidades base `ItemDigital`, `Jogo` e `Conta`.
- Repositório genérico em memória (`RepositorioEmMemoria`) e interface
  `IRepositorio`.
- Arquivo `index.ts` inicial para testes manuais de compra.
- `.gitignore` do projeto.
