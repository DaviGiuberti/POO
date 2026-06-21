import { PlanoAssinatura } from "./PlanoAssinatura.js";

// este arquivo define a classe PlanoBasico, que implementa a interface PlanoAssinatura. O plano básico é o plano padrão, com 0% de cashback e 7 dias para reembolso.

export class PlanoBasico implements PlanoAssinatura {
    // polimorfismo puro
    public nome(): string {
        return "Básico";
    }

    public percentualCashback(): number {
        return 0;
    }

    public diasReembolso(): number {
        return 7;
    }
}
