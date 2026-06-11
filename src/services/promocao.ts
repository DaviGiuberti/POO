import { ItemDigital } from "../models/ItemDigital.js";

export abstract class Promocao {
    constructor(protected nome: string) {}

    getNome(): string {
        return this.nome;
    }

    // Método de polimorfismo: cada classe filha vai calcular o desconto do seu jeito
    abstract calcularDesconto(item: ItemDigital): number;
}

// Classe filha 1: Desconto geral em percentual (ex: Promoção de inverno da steam)
export class DescontoPercentual extends Promocao {
    constructor(nome: string, private percentual: number) {
        super(nome); // Corrigido de "none" para "nome"
    }

    calcularDesconto(item: ItemDigital): number {
        return item.getPrecoBase() * (this.percentual / 100);
    }
}

// Classe Filha 2: Desconto focado em uma Categoria específica (ex: Semana do mundo aberto)
export class DescontoPorCategoria extends Promocao {
    constructor(
        nome: string, 
        private percentual: number, 
        private categoriaAlvo: string
    ) {
        super(nome);
    }

    calcularDesconto(item: ItemDigital): number {
        if ('getGenero' in item && (item as any).getGenero() === this.categoriaAlvo) {
            return item.getPrecoBase() * (this.percentual / 100);   
        }

        return 0;
    }
}