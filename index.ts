import * as readline from 'readline-sync';
import { popularLojaDeTestes } from "./src/models/jogo.js";
import { Conta } from "./src/models/conta.js";
import { RepositorioEmMemoria } from "./src/repo/RepositorioEmMemoria.js";
import { RepositorioContaJSON } from "./src/repo/repositorioJSON.js";
import { ItemDigital } from "./src/models/ItemDigital.js";
import { LojaView } from "./src/views/lojaView.js"; 
import { DescontoPorCategoria, DescontoPercentual } from "./src/services/promocao.js";

const repoJogos = new RepositorioEmMemoria<ItemDigital>();
const repoContas = new RepositorioContaJSON();

// Configurando as promoções
const promocaoAtiva = new DescontoPorCategoria("PROMOÇÃO DE INVERNO: ESPECIAL MUNDO ABERTO", 50, "Mundo Aberto");

console.log(" ======== INICIALIZANDO SIMULADOR STEAM ========\n");
popularLojaDeTestes(repoJogos); // Mantido apenas uma vez para não duplicar os jogos

let minhaConta = repoContas.buscarPorId("u1");

if (!minhaConta) {
    console.log("📝 Nenhum perfil encontrado. Criando novo save de usuário...");
    minhaConta = new Conta("u1", "PauloCrot", "pauloramoscrot1@gmail.com", 250.00);
    repoContas.adicionar(minhaConta);
} else {
    console.log(`💾 Perfil carregado com sucesso! Bem-vindo de volta, ${minhaConta.getID()}.`);
}

// O aviso do evento ativo fica melhor aqui dentro do fluxo principal, logo antes do loop começar!
console.log(`\nEVENTO ATIVO: ${promocaoAtiva.getNome()}!`);

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
            LojaView.exibirLojaPorTopicos(repoJogos);
            break;
        }

        case "2": {
            console.log("\n ======== MINHA BIBLIOTECA ========");
            const biblioteca = minhaConta.getBiblioteca();
            if (biblioteca.length === 0) {
                console.log("Sua biblioteca está vazia");
            } else {
                biblioteca.forEach(jogo => console.log(`- ${jogo.getTitulo()}`));
            }
            break;
        }

        case "3": {
            console.log("\n ======== ADICIONAR SALDO ========");
            console.log(`Saldo atual: R$ ${minhaConta.getSaldo().toFixed(2)}`);
            const valorStr = readline.question("Digite o valor para adicionar: R$ ");
            const valor = parseFloat(valorStr);
            if (isNaN(valor) || valor <= 0) {
                console.log("Valor inválido!");
            } else {
                minhaConta.adicionarSaldo(valor);
                console.log(`Sucesso! R$ ${valor.toFixed(2)} adicionados à sua carteira.`);
                console.log(`Novo saldo: R$ ${minhaConta.getSaldo().toFixed(2)}`);
            }
            break;
        }

        case "4": {
            console.log("\n ======== COMPRAR ITEM ========");
            const generoSelecionado = LojaView.renderizarSubmenuCategorias(repoJogos);
            
            if (generoSelecionado !== "") {
 LojaView.exibirJogosDaCategoria(repoJogos.listarTodos(), generoSelecionado, promocaoAtiva);

        const idItem = readline.question("Digite o ID do jogo ou DLC que deseja comprar (Ou pressione ENTER para sair) ");
                
                if (idItem.trim() === "") {
                    console.log("\nVoltou ao menu principal.");
                } else {
                    const itemDesejado = repoJogos.buscarPorId(idItem);

                    if (!itemDesejado) {
                        console.log("\nItem não encontrado na loja");
                    } else {
                        try {
                            const precoFinal = itemDesejado.getPrecoFinal(promocaoAtiva);

                            // Corrigido para adicionar os parênteses () no método toFixed
                            console.log(`\nPreço original: R$ ${itemDesejado.calcularPrecoFinal().toFixed(2)}`);
                            console.log(`Preço com desconto: R$ ${precoFinal.toFixed(2)}`);
                            
                            minhaConta.comprarItens(itemDesejado, promocaoAtiva);
                            
                            console.log(`\nSucesso! '${itemDesejado.getTitulo()}' adicionado à sua biblioteca.`);
                            repoContas.adicionar(minhaConta);
                        } catch (error: any) {
                            console.log(`\nErro na compra: ${error.message}`);
                        }
                    }
                }
            }
            break;
        }

        case "5": {
            console.log("\n ======== SOLICITAR REEMBOLSO ========");
            const biblioteca = minhaConta.getBiblioteca();

            if (biblioteca.length === 0) {
                console.log("Você nao tem nenhum jogo ou DLC na biblioteca para devolver.");
            } else {
                console.log("Seus jogos comprados: ");
                biblioteca.forEach(jogo => {
                    console.log(`- [ID: ${jogo.getID()}] ${jogo.getTitulo()}`);
                });

                const idParaReembolso = readline.question("\nDigite o ID do item que deseja devolver (ou Enter para voltar): ");

                if (idParaReembolso.trim() === "") {
                    console.log("\nVoltou ao menu principal.");
                } else {
                    try {
                        minhaConta.reembolsarItem(idParaReembolso);
                        console.log("\n Reembolso aprovado! O valor integral foi estornado para o seu saldo");
                        console.log(`Novo saldo da carteira: R$ ${minhaConta.getSaldo().toFixed(2)}`);
                    } catch (error: any) {
                        console.log(`\n Falha no reembolso: ${error.message}`);
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