import { ItemDigital } from './ItemDigital.js';
import { DLC } from './jogo.js';
import { RegistroCompra, PoliticaReembolso } from '../services/PoliticaReembolso.js'; // Corrigido o './'

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

  public comprarItens(item: ItemDigital): void {
    const jaPossui = this.biblioteca.some(c => c.item.getID() === item.getID());
    if (jaPossui) {
      throw new Error(`Você já possui o item '${item.getTitulo()}' na sua biblioteca!`);
    }
    
    if (item instanceof DLC) {
      const possuiJogoBase = this.biblioteca.some(
        (compraSalva) => compraSalva.item.getID() === item.getIdJogoPrincipal(),
      );

      if (!possuiJogoBase) {
        throw new Error(
          `Compra bloqueada! Você precisa ter o jogo base para adquirir a DLC: ${item.getTitulo()}.`,
        );
      }
    }

    const valor = item.calcularPrecoFinal();

    if (this.saldoCarteira < valor) {
      throw new Error('Saldo insuficiente na carteira Steam!');
    }

    this.saldoCarteira -= valor;
    // Corrigido: Agora guarda apenas o registro estruturado com a data de compra
    this.biblioteca.push({ item, dataCompra: new Date() });
    
    this.historicoTransacoes.push(
      `Comprou ${item.getTitulo()} por R$${valor.toFixed(2)} em ${new Date().toLocaleDateString()}`,
    );
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