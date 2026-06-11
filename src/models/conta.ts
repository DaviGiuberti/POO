import { ItemDigital } from './ItemDigital.js';
import { DLC } from './jogo.js';
import { RegistroCompra, PoliticaReembolso } from '../services/PoliticaReembolso.js'; 
import { Promocao } from "../services/promocao.js"; 

export class Conta {
  private biblioteca: RegistroCompra[] = [];
  private historicoTransacoes: string[] = [];

  constructor(
    private readonly id: string,
    private nomeUsuario: string,
    private email: string,
    private saldoCarteira: number,
  ) {}

  public getID(): string {
    return this.id;
  }

public comprarItens(item: ItemDigital, promocao?: Promocao): void {
    const precoCobrado = item.getPrecoFinal(promocao);

    if (this.saldoCarteira < precoCobrado) {
        throw new Error("Saldo insuficiente na carteira.");
    }

    // Deduz o valor correto (com ou sem desconto) do saldo
    this.saldoCarteira -= precoCobrado;

    // Registra a transação com o preço que foi pago de verdade
    this.historicoTransacoes.push(
        `Comprou ${item.getTitulo()} por R$${precoCobrado.toFixed(2)} em ${new Date().toLocaleDateString('pt-BR')}`
    );

    // Cria o registro da compra para a biblioteca
    const novaCompra: RegistroCompra = {
        item: item,
        dataCompra: new Date()
    };

    this.biblioteca.push(novaCompra);
}

  public reembolsarItem(idItem: string): void {
    const indexCompra = this.biblioteca.findIndex(c => c.item.getID() === idItem);
    if (indexCompra === -1) {
      throw new Error("Este item não foi encontrado na sua biblioteca.");
    }

    const compra = this.biblioteca[indexCompra];

    // 🔥 Adicionado de volta: Aplica a nossa regra de negócio de 7 dias!
    PoliticaReembolso.validarElegibilidade(compra);

    const valorEstorno = compra.item.calcularPrecoFinal();
    this.saldoCarteira += valorEstorno;

    this.biblioteca.splice(indexCompra, 1);

    // Corrigido para toFixed() com F maiúsculo e fechamento da string
    this.historicoTransacoes.push(`Reembolsou ${compra.item.getTitulo()} (+R$${valorEstorno.toFixed(2)}) em ${new Date().toLocaleDateString()}`);
  }

  public adicionarSaldo(valor: number): void {
    if (valor <= 0) {
      throw new Error('O valor do depósito deve ser maior que zero.');
    }
    this.saldoCarteira += valor;
  } 

  // Corrigido: Desempacota os registros para retornar os jogos puros para o index.ts
  public getBiblioteca(): ItemDigital[] {
    return this.biblioteca.map(c => c.item);
  }

  public getSaldo(): number {
    return this.saldoCarteira;
  }

  public getHistorico(): string[] {
    return this.historicoTransacoes;
  }
}