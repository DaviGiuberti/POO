import { Jogo } from "./jogo";
import { Conta } from "./conta";
import { RepositorioEmMemoria } from "./RepositorioEmMemoria";

const repoJogos = new RepositorioEmMemoria<Jogo>();
const repoContas = new RepositorioEmMemoria<Conta>();

console.log("🚀 --- INICIALIZANDO SIMULADOR STEAM --- 🚀\n");

const jogo1 = new Jogo("g1", "Hand Simulator", 19.99, "Simulação");
const jogo2 = new Jogo("g2", "Hearts of Iron IV", 149.00, "Estratégia");

repoJogos.adicionar(jogo1);
repoJogos.adicionar(jogo2);

console.log(`Jogos cadastrados no sistema: ${repoJogos.listarTodos().length}`);

const minhaConta = new Conta("u1", "PauloCrot", "pauloramoscrot1@gmail.com", 250.00);
repoContas.adicionar(minhaConta);

console.log(`Usuário cadastrado: ${minhaConta.getBiblioteca().length} jogos na biblioteca`);


console.log(`Tentando comprar: ${jogo1.getTitulo()}`);

try {
    minhaConta.comprarItens(jogo1);
    console.log("✅ Compra realizada com sucesso!");

    console.log(`Jogos atuais na biblioteca:`, minhaConta.getBiblioteca().map(j => j.getTitulo()));
} catch (error: any) {
    console.error(`❌ Erro na compra: ${error.message}`);
}

console.log(`\nTentando comprar: ${jogo2.getTitulo()}`);
try {
    minhaConta.comprarItens(jogo2);
    console.log("✅ Compra realizada com sucesso!");
} catch (error: any) {

    console.log(`❌ Bloqueio esperado: ${error.message}`);
}