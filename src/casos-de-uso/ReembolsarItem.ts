import { IRepositorio } from "../repo/IRepositorio.js";
import { Conta } from "../models/conta.js";

export interface ResultadoReembolso {
    tituloItem: string;
    valorEstornado: number;
    saldoAtual: number;
}

/**
 * Caso de uso: reembolsar um item da biblioteca.
 * A regra de prazo (7 dias) e o estorno vivem no domínio; aqui apenas
 * carregamos a conta, executamos e persistimos.
 */
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
