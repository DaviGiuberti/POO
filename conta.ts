import { ItemDigital } from "./ItemDigital";
import { DLC } from "./jogo";

export class Conta {
    private biblioteca: ItemDigital[] = [];
    private historicoTransacoes: string[] = [];

    constructor(
        private readonly id: string,
        private nomeUsuario: string,
        private email: string,
        private saldoCarteira: number
    ) {}

    public getID(): string {
        return this.id;
    }


    public comprarItens(item: ItemDigital): void {
        if (item instanceof DLC) {
            const possuiJogoBase = this.biblioteca.some(
                (jogoSalvo) => jogoSalvo.getID() === item.getIdJogoPrincipal()
            );

            if(!possuiJogoBase) {
                throw new Error(`Compra bloqueada! Você precisa tem o jogo base para adquirir a DLC: ${item.getTitulo}.`)
            }
        }
        const valor = item.calcularPrecoFinal();

        if (this.saldoCarteira < valor) {
            throw new Error("Saldo insuficiente na carteira Steam!")
        }
    
    this.saldoCarteira -= valor;
    this.biblioteca.push(item);
    this.historicoTransacoes.push(`Comprou ${item.getTitulo()} por R$${valor.toFixed(2)} em ${new Date().toLocaleDateString()}`);
    }

    public getBiblioteca(): ItemDigital[] {
        return this.biblioteca;
    }
}