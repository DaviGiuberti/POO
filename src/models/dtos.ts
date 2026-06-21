// define a interface de dados DTO para salvar em JSON
// servem para "ver" campos privados das entidades, para não ter q ficar acessando privates (A infraestrutura não pode ver os campos privados da entidade)

// DTO para os itens digitais (jogos e dlcs)
export interface ItemDigitalDTO {
    tipo: "Jogo" | "DLC";
    id: string;
    titulo: string;
    precoBase: number;
    genero?: string;
    idJogoPrincipal?: string;
}

// DTO para os registros de compra na biblioteca do usuário. Inclui o item comprado, a data da compra, o preço pago (com promoções aplicadas) e o cashback creditado.
export interface RegistroCompraDTO {
    item: ItemDigitalDTO;
    dataCompra: string;
    precoPago: number;
    cashbackCreditado?: number;
}

// DTO para a conta do usuário, incluindo os dados pessoais, saldo, plano de assinatura, biblioteca (lista de registros de compra
export interface ContaDTO {
    id: string;
    nomeUsuario: string;
    email: string;
    saldoCarteira: number;
    plano?: string;
    biblioteca: RegistroCompraDTO[];
    historicoTransacoes: string[];
}
