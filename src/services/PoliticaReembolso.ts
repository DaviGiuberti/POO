import { ItemDigital } from "../models/ItemDigital.js";

// este arquivo define a classe PoliticaReembolso
// checa se pode ser reembolsado com base na data da compra e no limite de dias para reembolso (que varia conforme o plano de assinatura do usuário)

export interface RegistroCompra { // 
    item: ItemDigital;
    dataCompra: Date;
    precoPago: number;
    cashbackCreditado?: number;
}

export class PoliticaReembolso {
    // Janela padrão de reembolso (plano Básico). Planos superiores estendem este prazo.
    public static readonly LIMITE_DIAS_PADRAO = 7;

    public static validarElegibilidade( // verifica se a compra é elegível para reembolso com base na data da compra e no limite de dias para reembolso
        compra: RegistroCompra,
        limiteDias: number = PoliticaReembolso.LIMITE_DIAS_PADRAO,
        agora: Date = new Date()
    ): void {
        const diferencaEmMilissegundos = agora.getTime() - compra.dataCompra.getTime();
        const diferencaEmDias = diferencaEmMilissegundos / (1000 * 60 * 60 * 24);

        if (diferencaEmDias > limiteDias) {
            throw new Error(
                `Reembolso negado! O prazo limite de ${limiteDias} dias expirou. (comprado há ${Math.floor(diferencaEmDias)} dias)`
            );
        }
    }
}
