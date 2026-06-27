import { IRepositorio } from "../repo/IRepositorio.js";
import { Conta } from "../models/conta.js";

// Para adicionar saldo na conta, precisa ser > 0

export class AdicionarSaldo {
    constructor(private readonly repoContas: IRepositorio<Conta>) {}

    public executar(idConta: string, valor: number): number {
        const conta = this.repoContas.buscarPorId(idConta);
        if (!conta) {
            throw new Error(`Conta '${idConta}' não encontrada.`);
        }

        conta.adicionarSaldo(valor);
        this.repoContas.adicionar(conta);

        return conta.getSaldo();
    }
}
