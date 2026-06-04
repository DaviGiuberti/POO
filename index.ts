import * as readline from 'readline-sync';
import { Jogo, DLC } from "./jogo.js";
import { Conta } from "./conta.js";
import { RepositorioEmMemoria } from "./RepositorioEmMemoria.js";
import { ItemDigital } from "./ItemDigital.js";

// Corrigido para ItemDigital para aceitar tanto Jogo quanto DLC no futuro
const repoJogos = new RepositorioEmMemoria<ItemDigital>();
const repoContas = new RepositorioEmMemoria<Conta>();

console.log(" ======== INICIALIZANDO SIMULADOR STEAM ========\n");

const jogo1 = new Jogo("1", "Hand Simulator", 10.00, "Simulador");
const jogo2 = new Jogo("3", "Hearts of Iron IV", 80.00, "Estrategia");

repoJogos.adicionar(jogo1);
repoJogos.adicionar(jogo2);

const minhaConta = new Conta("u1", "PauloCrot", "pauloramoscrot1@gmail.com", 250.00);
repoContas.adicionar(minhaConta);

let rodando = true;

console.log(" ======== BEM VINDO À STEAM ======== ");

while (rodando) {
    console.log("\n======== MENU PRINCIPAL ======== ");
    console.log("1. Ver jogos disponíveis na loja\n");
    console.log("2. Ver minha biblioteca\n");
    console.log("3. Adicionar saldo na carteira\n");
    console.log("4. Comprar um jogo ou DLC\n"); // Adicionado o número 4 que faltava
    console.log("5. Sair\n");

    const opcao = readline.question("Escolha uma opcao: ");

    switch (opcao) {
        case "1": {
            console.log("\n ======== JOGOS NA LOJA ========");
            const jogos = repoJogos.listarTodos();
            jogos.forEach(jogo => {
                // Corrigida a lógica do ternário para identificar se é Jogo ou DLC
                const tipo = jogo instanceof DLC ? "DLC" : "Jogo Base";
                console.log(`- [ID: ${jogo.getID()}] ${jogo.getTitulo()} | R$ ${jogo.calcularPrecoFinal().toFixed(2)} (${tipo})`);       
            });
            break;
        }

        case "2": {
            console.log("\n ======== MINHA BIBLIOTECA ========");
            const biblioteca = minhaConta.getBiblioteca();
            // Corrigido de 'lenght' para 'length'
            if (biblioteca.length === 0) {
                console.log("Sua biblioteca está vazia");
            } else {
                // Adicionado os () em getTitulo()
                biblioteca.forEach(jogo => console.log(`- ${jogo.getTitulo()}`));
            }
            break;
        }

        case "3": {
            console.log("\n ======== ADICIONAR SALDO ========");
            // Adicionada a leitura do teclado que faltava para criar a variável valorStr
            const valorStr = readline.question("Digite o valor para adicionar: R$ ");
            const valor = parseFloat(valorStr);
            if (isNaN(valor) || valor <= 0) {
                console.log("Valor inválido!");
            } else {
                console.log(`Método de depósito pendente de implementação na classe Conta. Tentou colocar: R$ ${valor.toFixed(2)}`);
            }
            break;
        }

        case "4": {
            console.log(" ======== COMPRAR ITEM ========");
            const idItem = readline.question("Digite o ID do jogo ou DLC que deseja comprar: ");
            // Corrigido de repoResitorio minúsculo e retirado as aspas de "idItem"
            const itemDesejado = repoJogos.buscarPorId(idItem);

            if(!itemDesejado) {
                console.log(" Item não encontrado na loja");
            } else {
                try {
                    minhaConta.comprarItens(itemDesejado);
                    console.log(`Sucesso! '${itemDesejado.getTitulo()}' adicionado à sua biblioteca.`);
                } catch (error: any) {
                    console.log(` Erro na compra ${error.message} `);
                }
            }
            break;
        }

        case "5": {
            console.log("\nSaindo do simulador... Até a próxima! ");
            rodando = false;
            break;
        }

        default: 
            console.log("Opção inválida! Tente novamente.");
            break;
    }
}