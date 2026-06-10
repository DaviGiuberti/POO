export abstract class ItemDigital {
    constructor(
        protected readonly id: string,
        protected titulo: string,
        protected precoBase: number
    ) {}

    public getID(): string { 
        return this.id; 
    }
    
    public getTitulo(): string { 
        return this.titulo; 
    }

    public abstract calcularPrecoFinal(): number;
}