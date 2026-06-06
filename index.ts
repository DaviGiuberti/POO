import * as readline from 'readline-sync';
import { popularLojaDeTestes } from "./jogo.js";
import { Conta } from "./conta.js";
import { RepositorioEmMemoria } from "./RepositorioEmMemoria.js";
import { ItemDigital } from "./ItemDigital.js";
import { LojaView } from "./lojaView.js"; // <-- Nossa nova View importada aqui

const repoJogos = new RepositorioEmMemoria<ItemDigital>();
const repoContas = new RepositorioEmMemoria<Conta>();

console.log(" ======== INICIALIZANDO SIMULADOR STEAM ========\n");
popularLojaDeTestes(repoJogos);

const minhaConta = new Conta("u1", "PauloCrot", "pauloramoscrot1@gmail.com", 250.00);
repoContas.adicionar(minhaConta);

let rodando = true;
console.log(" ======== BEM VINDO À STEAM ======== ");

while (rodando) {
    console.log("\n======== MENU PRINCIPAL ======== ");
    console.log("1. Ver jogos disponíveis na loja\n");
    console.log("2. Ver minha biblioteca\n");
    console.log("3. Adicionar saldo na carteira\n");
    console.log("4. Comprar um jogo ou DLC\n");
    console.log("5. Sair\n");

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
                console.log(`✅ Sucesso! R$ ${valor.toFixed(2)} adicionados à sua carteira.`);
                console.log(`Novo saldo: R$ ${minhaConta.getSaldo().toFixed(2)}`);
            }
            break;
        }

        case "4": {
            console.log("\n ======== COMPRAR ITEM ========");
            const generoSelecionado = LojaView.renderizarSubmenuCategorias(repoJogos);
            
            if (generoSelecionado !== "") {
                LojaView.exibirJogosDaCategoria(repoJogos.listarTodos(), generoSelecionado);

                const idItem = readline.question("Digite o ID do jogo ou DLC que deseja comprar (ou pressione Enter para voltar): ");
                
                if (idItem.trim() === "") {
                    console.log("\nVoltou ao menu principal.");
                } else {
                    const itemDesejado = repoJogos.buscarPorId(idItem);

                    if (!itemDesejado) {
                        console.log("\n❌ Item não encontrado na loja");
                    } else {
                        try {
                            minhaConta.comprarItens(itemDesejado);
                            console.log(`\n✅ Sucesso! '${itemDesejado.getTitulo()}' adicionado à sua biblioteca.`);
                        } catch (error: any) {
                            console.log(`\n🔥 Erro na compra: ${error.message}`);
                        }
                    }
                }
            }
            break;
        }

        case "5": { 
            console.log("\nSaindo do simulador... Até a próxima! 👋");
            rodando = false;
            break;
        }

        default: 
            console.log("Opção inválida! Tente novamente.");
            break;
    }
}