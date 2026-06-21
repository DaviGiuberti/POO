import { PlanoAssinatura } from "./PlanoAssinatura.js";

// este arquivo define a classe PlanoPlus, que implementa a interface PlanoAssinatura. O plano Plus é o plano intermediário, com 5% de cashback e 14 dias para reembolso.

export class PlanoPlus implements PlanoAssinatura {
    public nome(): string {
        return "Plus";
    }

    public percentualCashback(): number {
        return 5;
    }

    public diasReembolso(): number {
        return 14;
    }
}
