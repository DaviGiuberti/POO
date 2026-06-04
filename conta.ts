import { ItemDigital } from './ItemDigital';
import { DLC } from './jogo';

export class Conta {
  private biblioteca: ItemDigital[] = [];
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
    if (item instanceof DLC) {
      const possuiJogoBase = this.biblioteca.some(
        (jogoSalvo) => jogoSalvo.getID() === item.getIdJogoPrincipal(),
      );

      if (!possuiJogoBase) {
        // Adicionado os () em getTitulo()
        throw new Error(
          `Compra bloqueada! Você precisa ter o jogo base para adquirir a DLC: ${item.getTitulo()}.`,
        );
      }
    }

    const valor = item.calcularPrecoFinal();

    if (this.saldoCarteira < valor) {
      throw new Error('Saldo insuficiente na carteira Steam!');
    }

    // Corrigido aqui: Essas 3 linhas pertencem ao bloco do comprarItens,
    // então elas precisam ficar alinhadas para dentro (8 espaços da margem)
    this.saldoCarteira -= valor;
    this.biblioteca.push(item);
    this.historicoTransacoes.push(
      `Comprou ${item.getTitulo()} por R$${valor.toFixed(2)} em ${new Date().toLocaleDateString()}`,
    );
  } // Fecha o comprarItens alinhado com o 'public' lá de cima

  public adicionarSaldo(valor: number): void {
    if (valor <= 0) {
      throw new Error('O valor do depósito deve ser maior que zero.');
    }
    // Corrigido aqui: Esta linha está dentro do método, vai para a direita
    this.saldoCarteira += valor;
  } // Fecha o adicionarSaldo alinhado com o seu respectivo 'public'

  public getBiblioteca(): ItemDigital[] {
    return this.biblioteca;
  }
}
