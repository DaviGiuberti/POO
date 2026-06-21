import { ehCategorizavel, ItemDigital } from "../models/ItemDigital.js";

// este arquivo define as classes de promoção, que representam as promoções ativas na loja

export abstract class Promocao {
    // classe abstrata, não pode ser instanciada diretamente
    constructor(protected nome: string) {}

    getNome(): string {
        return this.nome;
    }

    // polimorfismo: cada classe filha calcula o desconto do seu jeito.
    abstract calcularDesconto(item: ItemDigital): number;
}

// desconto geral em percentual (Promoção de inverno da Steam)
export class DescontoPercentual extends Promocao {
    constructor(
        nome: string,
        private percentual: number
    ) {
        super(nome);
    }

    calcularDesconto(item: ItemDigital): number {
        return item.calcularPrecoFinal() * (this.percentual / 100);
    }
}

// desconto focado em uma categoria específica (ex.: Semana do mundo aberto)
export class DescontoPorCategoria extends Promocao {
    constructor(
        nome: string,
        private percentual: number,
        private categoriaAlvo: string
    ) {
        super(nome);
    }

    calcularDesconto(item: ItemDigital): number {
        // o desconto só é aplicado se o item for categorizável e pertencer à categoria alvo da promoção
        if (ehCategorizavel(item) && item.getGenero() === this.categoriaAlvo) {
            return item.calcularPrecoFinal() * (this.percentual / 100);
        }

        return 0;
    }
}
