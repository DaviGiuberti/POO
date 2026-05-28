import { ItemDigital } from "./ItemDigital";

export class Conta {
    private biblioteca: ItemDigital[] = [];
    private historicoTransacoes: string[] = [];

    constructor(
        private readonly id: string,
        private nomeUsuario: string,
        private email: string,
        private saldoCarteira: number
    ) {}
    public comprarItens(item: ItemDigital): void {
        const valor = item.calcularPrecoFinal();

        if (this.saldoCarteira < valor) {
            throw new Error("Saldo insuficiente na carteira Steam!")
        }
    
    this.saldoCarteira -= valor;
    this.biblioteca.push(item);
    this.historicoTransacoes.push(`Comprou ${item.getTitulo()} por R$${valor.toFixed(2)} en ${new Date().toLocaleDateString()}`);
    }

    public getBiblioteca(): ItemDigital[] {
        return this.biblioteca;
    }
}