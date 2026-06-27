import { IRepositorio } from "../repo/IRepositorio.js";
import { Conta } from "../models/conta.js";

export interface ResultadoReembolso {
    tituloItem: string;
    valorEstornado: number;
    saldoAtual: number;
}

// Reembolso, procura conta, ve se tem o item, atualiza saldo, reembolsa. Aqui nao verificamos o prazo de 7 ou mais dias

export class ReembolsarItem {
    constructor(private readonly repoContas: IRepositorio<Conta>) {}

    public executar(idConta: string, idItem: string): ResultadoReembolso {
        const conta = this.repoContas.buscarPorId(idConta);
        if (!conta) {
            throw new Error(`Conta '${idConta}' não encontrada.`);
        }

        const itemAlvo = conta.getBiblioteca().find((i) => i.getID() === idItem);
        const tituloItem = itemAlvo?.getTitulo() ?? idItem;
        const saldoAntes = conta.getSaldo();

        conta.reembolsarItem(idItem);
        this.repoContas.adicionar(conta);

        return {
            tituloItem,
            valorEstornado: conta.getSaldo() - saldoAntes,
            saldoAtual: conta.getSaldo(),
        };
    }
}
