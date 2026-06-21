// Este arquivo define a interface PlanoAssinatura, que representa os planos de assinatura disponíveis no sistema.
// Cada plano tem um nome, um percentual de cashback e uma janela de reembolso. A interface é implementada por classes concretas que representam os planos específicos (Básico, Plus, Premium).

export interface PlanoAssinatura {
    // interface
    nome(): string;
    percentualCashback(): number;
    diasReembolso(): number;
}
