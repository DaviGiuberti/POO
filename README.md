# 🎮 Biblioteca de Jogos (Simulador estilo Steam)

Simulador de uma loja de jogos digitais inspirado na Steam, feito em **TypeScript**
para a disciplina de **Programação Orientada a Objetos (POO)**. O programa roda no
terminal: você navega por uma loja de jogos e DLCs, gerencia o saldo da carteira,
compra itens (com promoções e cashback) e solicita reembolsos.

---

## ✅ Pré-requisitos

Você só precisa do **Node.js 20 ou superior** instalado.

Para conferir se já tem:

```bash
node --version
```

Se aparecer algo como `v20.x.x` (ou maior), está tudo certo. Se não tiver,
baixe em <https://nodejs.org>.

---

## 🚀 Como rodar (passo a passo)

Abra um terminal **dentro da pasta do projeto** e rode, na ordem:

```bash
# 1. Instalar as dependências (só na PRIMEIRA vez)
npm install

# 2. Iniciar o simulador
npm start
```

Pronto. O `npm start` compila o código e abre o menu interativo:

```
======== MENU PRINCIPAL ========
1. Ver jogos disponíveis na loja
2. Ver minha biblioteca
3. Adicionar saldo na carteira
4. Comprar um jogo ou DLC
5. Solicitar Reembolso
6. Sair
```

Basta digitar o número da opção e apertar **Enter**.

> 💡 Para **comprar** (opção 4): escolha a categoria, veja a lista de jogos com
> seus **IDs** (ex.: `MA-01`, `FPS-02`) e digite o ID do item desejado.

---

## 💾 A conta (save) e como criar uma nova

Seu perfil é salvo automaticamente no arquivo **`dados_conta.json`** (saldo,
biblioteca e histórico). Ele é recarregado sempre que você abre o programa.

A conta padrão é o usuário `u1` (**PauloCrot**, R$ 250,00, plano **Premium**).

Para **começar do zero / criar uma conta nova**, escolha uma opção:

- **Mais fácil:** apague o arquivo `dados_conta.json`. No próximo `npm start`, o
  programa cria um perfil novo automaticamente.
- **Personalizar:** edite a linha do `new Conta(...)` em [index.ts](index.ts) e
  troque nome, e-mail, saldo inicial e plano. Ex.:
  ```typescript
  minhaConta = new Conta(ID_USUARIO, "SeuNome", "seu@email.com", 500.0, new PlanoBasico());
  ```
- **Vários perfis:** altere a constante `ID_USUARIO` em [index.ts](index.ts) para
  outro valor (ex.: `"u2"`), criando um novo registro no mesmo arquivo.

Planos disponíveis: `PlanoBasico` (0% cashback, 7 dias de reembolso),
`PlanoPlus` (5%, 14 dias) e `PlanoPremium` (10%, 21 dias).

---

## 🧪 Como rodar os testes

O projeto tem **59 testes automatizados** (Vitest) que validam toda a lógica de
negócio (compra, reembolso, saldo, promoções, planos e validações).

```bash
npm test              # roda todos os testes uma vez
npm run test:watch    # re-testa automaticamente ao salvar
npm run test:coverage # roda os testes mostrando a cobertura de código
```

Saída esperada:

```
 Test Files  8 passed (8)
      Tests  59 passed (59)
```

---

## 🛠️ Todos os comandos disponíveis

| Comando | O que faz |
|---|---|
| `npm install` | Instala as dependências (primeira vez). |
| `npm start` | Compila e roda o simulador no terminal. |
| `npm run build` | Apenas compila o TypeScript para a pasta `dist/`. |
| `npm test` | Roda os 59 testes uma vez. |
| `npm run test:watch` | Roda os testes em modo contínuo. |
| `npm run test:coverage` | Roda os testes com relatório de cobertura. |
| `npm run typecheck` | Verifica os tipos sem gerar arquivos. |
| `npm run lint` | Analisa a qualidade do código (ESLint). |
| `npm run format` | Formata o código (Prettier). |

---

## 📂 Estrutura do projeto (arquitetura em camadas)

```
index.ts                  → Borda: menu do terminal (interação com o usuário)
src/
├── views/                → Telas da loja (LojaView)
├── casos-de-uso/         → Regras de negócio: ComprarItem, ReembolsarItem, AdicionarSaldo
├── models/               → Entidades: Conta, ItemDigital, Jogo, DLC
│   └── planos/           → Planos de assinatura (Básico, Plus, Premium)
├── services/             → Promoções e Política de Reembolso
├── repo/                 → Repositórios (em memória e persistência em JSON)
└── infra/                → Catálogo de jogos de teste (seed)
tests/                    → Testes automatizados (Vitest)
```

O fluxo geral: **`index.ts` (menu)** → **casos de uso** → **entidades** (que aplicam
as regras) → **repositório** (que salva no `dados_conta.json`).