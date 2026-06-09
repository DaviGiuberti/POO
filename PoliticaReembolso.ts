import {ItemDigital} from "./ItemDigital.js"

export interface RegistroCompra {
    item: ItemDigital; 
    dataCompra: Date;
}

export class PoliticaReembolso {
    private static readonly LIMITE_DIAS = 7;

    /**
     * lógica para validar se uma compra está elegível com base no tempo
     * caso não esteja, solta um erro com o motivo
     */
    public static validarElegibilidade(compra: RegistroCompra): void {
       const agora = new Date(); 
        const diferencaEmMilissegundos = agora.getTime() - compra.dataCompra.getTime();
        const diferencaEmDias = diferencaEmMilissegundos / (1000 * 60 * 60 * 24);
        
        if (diferencaEmDias > this.LIMITE_DIAS) {
            throw new Error(`Reembolso negado! O prazo limite de ${this.LIMITE_DIAS} dias expirou. (comprado há ${Math.floor(diferencaEmDias)} dias)`);
        }
    }
}