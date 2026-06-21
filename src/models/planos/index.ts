import { PlanoAssinatura } from "./PlanoAssinatura.js";
import { PlanoBasico } from "./PlanoBasico.js";
import { PlanoPlus } from "./PlanoPlus.js";
import { PlanoPremium } from "./PlanoPremium.js";

export { PlanoAssinatura } from "./PlanoAssinatura.js";
export { PlanoBasico } from "./PlanoBasico.js";
export { PlanoPlus } from "./PlanoPlus.js";
export { PlanoPremium } from "./PlanoPremium.js";

// este arquivo reexporta os planos de assinatura, para facilitar a importação em outros arquivos.
// assim, ao invés de importar cada plano individualmente, pode importar tudo de uma vez só.
// também tem a função de definir a função de fábrica planoPorNome, que é usada para converter o nome do plano salvo no JSON em uma instância real do plano correspondente, sem expor os detalhes de implementação dos planos para o resto do código.

export function planoPorNome(nome?: string): PlanoAssinatura {
    switch (nome) {
        case "Plus":
            return new PlanoPlus();
        case "Premium":
            return new PlanoPremium();
        default:
            return new PlanoBasico();
    }
}
