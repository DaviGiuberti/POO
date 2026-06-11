import { Promocao } from "../services/promocao.js"

export abstract class ItemDigital {
    constructor(
        protected readonly id: string,
        protected titulo: string,
        protected precoBase: number
    ) {}

    public getPrecoFinal(promocaoAtiva?: Promocao): number {

        const precoOriginal = this.calcularPrecoFinal();

        if (!promocaoAtiva) {
            return precoOriginal;
        }

        const desconto = promocaoAtiva.calcularDesconto(this);
        const precoComDesconto = this.getPrecoBase() - desconto;

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

    public abstract calcularPrecoFinal(): number;
}