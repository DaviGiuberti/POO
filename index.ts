import * as readline from "readline-sync";
import { Conta } from "./src/models/conta.js";
import { ItemDigital } from "./src/models/ItemDigital.js";
import { PlanoPremium } from "./src/models/planos/index.js";
import { RepositorioEmMemoria } from "./src/repo/RepositorioEmMemoria.js";
import { RepositorioContaJSON } from "./src/repo/repositorioJSON.js";
import { LojaView } from "./src/views/lojaView.js";
import { DescontoPorCategoria } from "./src/services/promocao.js";
import { popularLojaDeTestes } from "./src/infra/seed.js";
import { ComprarItem } from "./src/casos-de-uso/ComprarItem.js";
import { ReembolsarItem } from "./src/casos-de-uso/ReembolsarItem.js";
import { AdicionarSaldo } from "./src/casos-de-uso/AdicionarSaldo.js";

// nós, usuario 1
const ID_USUARIO = "u1";

// caso tiver erro desconhecido
function mensagemDeErro(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

// Infraestrutura (repositórios)
const repoJogos = new RepositorioEmMemoria<ItemDigital>();
const repoContas = new RepositorioContaJSON();

// promoção ativa na loja
const promocaoAtiva = new DescontoPorCategoria(
    "PROMOÇÃO DE INVERNO: ESPECIAL MUNDO ABERTO",
    50,
    "Mundo Aberto"
);

// casos de uso que recebem os repositórios
const comprarItem = new ComprarItem(repoContas, repoJogos);
const reembolsarItem = new ReembolsarItem(repoContas);
const adicionarSaldo = new AdicionarSaldo(repoContas);

console.log(" ======== INICIALIZANDO SIMULADOR STEAM ========\n");
// enche a loja com alguns jogos e dlcs de teste em "infra"
popularLojaDeTestes(repoJogos);

// tenta carregar o perfil do usuário, ou cria um novo se não existir
let minhaConta = repoContas.buscarPorId(ID_USUARIO);

// se não tiver perfil salvo, cria um novo com saldo inicial e plano premium (pra testar)
if (!minhaConta) {
    console.log("📝 Nenhum perfil encontrado. Criando novo save de usuário...");
    minhaConta = new Conta(ID_USUARIO, "PauloCrot", "pauloramoscrot1@gmail.com", 250.0, new PlanoPremium());
    repoContas.adicionar(minhaConta);
} else {
    console.log(`💾 Perfil carregado com sucesso! Bem-vindo de volta, ${minhaConta.getNomeUsuario()}.`);
}

console.log(`\n👑 Plano de assinatura: ${minhaConta.getNomePlano()}`);
console.log(`EVENTO ATIVO: ${promocaoAtiva.getNome()}!`);

let rodando = true;
console.log(" ======== BEM VINDO À STEAM ======== ");

while (rodando) {
    console.log("\n======== MENU PRINCIPAL ======== ");
    console.log("1. Ver jogos disponíveis na loja\n");
    console.log("2. Ver minha biblioteca\n");
    console.log("3. Adicionar saldo na carteira\n");
    console.log("4. Comprar um jogo ou DLC\n");
    console.log("5. Solicitar Reembolso\n");
    console.log("6. Sair\n");

    const opcao = readline.question("Escolha uma opcao: ");

    switch (opcao) {
        case "1": {
            console.log("\n ======== JOGOS NA LOJA ========");
            // exibe a loja por tópicos (categorias) e jogos com desconto
            LojaView.exibirLojaPorTopicos(repoJogos, promocaoAtiva);
            break;
        }

        case "2": {
            console.log("\n ======== MINHA BIBLIOTECA ========");
            const biblioteca = minhaConta.getBiblioteca();
            if (biblioteca.length === 0) {
                console.log("Sua biblioteca está vazia");
            } else {
                // exibe a biblioteca do usuário com ID e título dos jogos
                biblioteca.forEach((jogo) => console.log(`- [ID: ${jogo.getID()}] ${jogo.getTitulo()}`));
                console.log(`\nTotal de itens: ${biblioteca.length}`);
                console.log(`Total gasto: R$ ${minhaConta.getTotalGasto().toFixed(2)}`);
            }
            break;
        }

        case "3": {
            console.log("\n ======== ADICIONAR SALDO ========");
            // exibe o saldo atual e pergunta quanto o usuário quer adicionar
            console.log(`Saldo atual: R$ ${minhaConta.getSaldo().toFixed(2)}`);
            const valorStr = readline.question("Digite o valor para adicionar: R$ ");
            const valor = parseFloat(valorStr);
            if (isNaN(valor)) {
                console.log("Valor inválido!");
            } else {
                // executa o caso de uso de adicionar saldo, que pode lançar erro se o valor for negativo
                try {
                    const novoSaldo = adicionarSaldo.executar(ID_USUARIO, valor);
                    minhaConta = repoContas.buscarPorId(ID_USUARIO)!;
                    console.log(`Sucesso! R$ ${valor.toFixed(2)} adicionados à sua carteira.`);
                    console.log(`Novo saldo: R$ ${novoSaldo.toFixed(2)}`);
                } catch (error: unknown) {
                    console.log(`Falha: ${mensagemDeErro(error)}`);
                }
            }
            break;
        }

        case "4": {
            console.log("\n ======== COMPRAR ITEM ========");
            // exibe as categorias disponíveis e pergunta qual categoria o usuário quer explorar
            const generoSelecionado = LojaView.renderizarSubmenuCategorias(repoJogos);
            // se o usuário escolher uma categoria, exibe os jogos daquela categoria e pergunta qual jogo ele quer comprar (pelo ID)
            if (generoSelecionado !== "") {
                LojaView.exibirJogosDaCategoria(repoJogos.listarTodos(), generoSelecionado, promocaoAtiva);

                const idItem = readline.question(
                    "Digite o ID do jogo ou DLC que deseja comprar (Ou pressione ENTER para sair) "
                );

                if (idItem.trim() === "") {
                    // se o usuário não digitar um ID, volta para o menu principal
                    console.log("\nVoltou ao menu principal.");
                } else {
                    try {
                        // executa o caso de uso de comprar item, que pode lançar erros por saldo insuficiente, item não encontrado, etc.
                        // o resultado da compra inclui o preço original, o preço pago, o cashback creditado e o saldo restante, que são exibidos para o usuário
                        const resultado = comprarItem.executar(ID_USUARIO, idItem.trim(), promocaoAtiva);
                        // depois de comprar, recarrega o perfil do usuário para atualizar o saldo e a biblioteca
                        minhaConta = repoContas.buscarPorId(ID_USUARIO)!;
                        console.log(`\nPreço original: R$ ${resultado.precoOriginal.toFixed(2)}`);
                        console.log(`Preço com desconto: R$ ${resultado.precoPago.toFixed(2)}`);
                        if (resultado.cashbackCreditado > 0) {
                            console.log(
                                `Cashback (${minhaConta.getNomePlano()}): +R$ ${resultado.cashbackCreditado.toFixed(2)}`
                            );
                        }
                        console.log(
                            `\nSucesso! '${resultado.item.getTitulo()}' adicionado à sua biblioteca.`
                        );
                        console.log(`Saldo restante: R$ ${resultado.saldoRestante.toFixed(2)}`);
                    } catch (error: unknown) {
                        // se der erro na compra, exibe a mensagem de erro (ex: saldo insuficiente, item não encontrado, etc.)
                        console.log(`\nErro na compra: ${mensagemDeErro(error)}`);
                    }
                }
            }
            break;
        }

        case "5": {
            // opção de solicitar reembolso de um item da biblioteca, que pode ser um jogo ou uma DLC
            console.log("\n ======== SOLICITAR REEMBOLSO ========");
            // exibe os itens da biblioteca do usuário e pergunta qual item ele quer reembolsar (pelo ID)
            const biblioteca = minhaConta.getBiblioteca();

            if (biblioteca.length === 0) {
                console.log("Você nao tem nenhum jogo ou DLC na biblioteca para devolver.");
            } else {
                console.log("Seus jogos comprados: ");
                biblioteca.forEach((jogo) => {
                    console.log(`- [ID: ${jogo.getID()}] ${jogo.getTitulo()}`);
                });

                const idParaReembolso = readline.question(
                    "\nDigite o ID do item que deseja devolver (ou Enter para voltar): "
                );

                if (idParaReembolso.trim() === "") {
                    // se o usuário não digitar um ID, volta para o menu principal
                    console.log("\nVoltou ao menu principal.");
                } else {
                    try {
                        // executa o caso de uso de reembolso, que pode lançar erros por item não encontrado, prazo de reembolso expirado, etc.
                        const resultado = reembolsarItem.executar(ID_USUARIO, idParaReembolso.trim());
                        minhaConta = repoContas.buscarPorId(ID_USUARIO)!;
                        console.log(
                            `\n Reembolso aprovado! R$ ${resultado.valorEstornado.toFixed(2)} de '${resultado.tituloItem}' foram estornados.`
                        );
                        console.log(`Novo saldo da carteira: R$ ${resultado.saldoAtual.toFixed(2)}`);
                    } catch (error: unknown) {
                        console.log(`\n Falha no reembolso: ${mensagemDeErro(error)}`);
                    }
                }
            }
            break;
        }

        case "6": {
            console.log("\nSaindo do simulador... Até a próxima! 👋");
            rodando = false;
            break;
        }

        default:
            console.log("Opção inválida! Tente novamente.");
            break;
    }
}
