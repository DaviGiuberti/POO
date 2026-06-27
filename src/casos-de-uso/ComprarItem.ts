import { IRepositorio } from "../repo/IRepositorio.js";
import { Conta } from "../models/conta.js";
import { ItemDigital } from "../models/ItemDigital.js";
import { Promocao } from "../services/promocao.js";

export interface ResultadoCompra {
    item: ItemDigital;
    precoOriginal: number;
    precoPago: number;
    cashbackCreditado: number;
    saldoRestante: number;
}


// para comprar um item, precisa carregar a conta, recebe repositorios etc

export class ComprarItem {
    constructor(
        private readonly repoContas: IRepositorio<Conta>,
        private readonly repoItens: IRepositorio<ItemDigital>
    ) {}

    public executar(idConta: string, idItem: string, promocao?: Promocao): ResultadoCompra {
        const conta = this.repoContas.buscarPorId(idConta);
        if (!conta) {
            throw new Error(`Conta '${idConta}' não encontrada.`);
        }

        const item = this.repoItens.buscarPorId(idItem);
        if (!item) {
            throw new Error("Item não encontrado na loja.");
        }

        const precoOriginal = item.calcularPrecoFinal();
        const precoPago = item.getPrecoFinal(promocao);

        const cashbackCreditado = conta.comprarItens(item, promocao);
        this.repoContas.adicionar(conta);

        return {
            item,
            precoOriginal,
            precoPago,
            cashbackCreditado,
            saldoRestante: conta.getSaldo(),
        };
    }
}
