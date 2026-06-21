import { PlanoAssinatura } from "./PlanoAssinatura.js";

// este arquivo define a classe PlanoPremium, que implementa a interface PlanoAssinatura. O plano Premium é o plano de topo de linha, com 10% de cashback e 21 dias para reembolso.

export class PlanoPremium implements PlanoAssinatura {
    public nome(): string {
        return "Premium";
    }

    public percentualCashback(): number {
        return 10;
    }

    public diasReembolso(): number {
        return 21;
    }
}
