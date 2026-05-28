import { ItemDigital } from "./ItemDigital";

export class Jogo extends ItemDigital {
    private dlcs: DLC[] = [];

    constructor(id: string, titulo: string, precoBase: number, private genero: string) {
        super(id, titulo, precoBase);
    }
    public adicionarDLC (dlc: DLC): void {
        this.dlcs.push(dlc);
    }

    //Implementação de polimorfismo
    public calcularPrecoFinal(): number {
        // caso sla, o jogo tenha uma promo ou algo do tipo
        return this.precoBase;
    }
}

export class DLC extends ItemDigital {
    constructor(id: string, titulo: string, precoBase: number, private idJogoPrincipal: string) {
        super(id, titulo, precoBase);
 }
    public calcularPrecoFinal(): number {
        return this.precoBase * 0.0;
    }
}