import { Promocao } from "../services/promocao.js";
import { ItemDigitalDTO } from "./dtos.js";

// esse arquivo define a classe abstrata ItemDigital (molde para jogo e dlc) e tambem define a interface Categorizavel, que é implementada por jogos e dlcs que possuem gênero (para aplicar promoções de desconto por categoria)

export interface Categorizavel {
    getGenero(): string;
}

// função de type guard para verificar se um item é categorizável (tem gênero)
export function ehCategorizavel(item: ItemDigital): item is ItemDigital & Categorizavel {
    return typeof (item as Partial<Categorizavel>).getGenero === "function";
}

// classe abstrata que define o molde para jogos e dlcs
export abstract class ItemDigital {
    // abstract pq n pode criar itemdigital sem ser jogo ou dlc
    constructor(
        protected readonly id: string, // encapsulamento
        protected titulo: string,
        protected precoBase: number
    ) {
        if (!id || id.trim().length === 0) {
            throw new Error("Item inválido: o ID não pode ser vazio.");
        }
        if (!titulo || titulo.trim().length < 2) {
            throw new Error("Item inválido: o título deve ter ao menos 2 caracteres.");
        }
        if (!Number.isFinite(precoBase) || precoBase < 0) {
            throw new Error("Item inválido: o preço base não pode ser negativo.");
        }
    }

    // retorna o preço final do item, aplicando a promoção ativa (se houver). Se o preço final for negativo, retorna 0.
    public getPrecoFinal(promocaoAtiva?: Promocao): number {
        const precoTabela = this.calcularPrecoFinal();

        if (!promocaoAtiva) {
            return precoTabela;
        }

        const desconto = promocaoAtiva.calcularDesconto(this);
        const precoComDesconto = precoTabela - desconto;

        return precoComDesconto < 0 ? 0 : precoComDesconto;
    }

    public getID(): string {
        return this.id;
    }

    public getTitulo(): string {
        return this.titulo;
    }

    public getPrecoBase(): number {
        return this.precoBase;
    }

    // polimorfismo, todo item tem q saber calcular seu preço final
    public abstract calcularPrecoFinal(): number;

    // método abstrato que converte o item digital em um DTO
    public abstract toDTO(): ItemDigitalDTO;
}
