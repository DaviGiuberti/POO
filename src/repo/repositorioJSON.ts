import * as fs from "fs";
import * as path from "path";
import { IRepositorio } from "./IRepositorio.js";
import { Conta } from "../models/conta.js";
import { ContaDTO } from "../models/dtos.js";

// esse arequivo existe para que o save do usuario seja salvo entre execuções

export class RepositorioContaJSON implements IRepositorio<Conta> { // implementa a interface e grava e le arquivo dados_conta.json
    private caminhoArquivo: string;

    constructor(caminhoArquivo?: string) {
        this.caminhoArquivo = caminhoArquivo ?? path.resolve(process.cwd(), "dados_conta.json");
    }

    private lerArquivo(): Conta[] {
        if (!fs.existsSync(this.caminhoArquivo)) {
            return [];
        }

        try {
            const dadosRaw = fs.readFileSync(this.caminhoArquivo, "utf-8");
            const dtos: ContaDTO[] = JSON.parse(dadosRaw);
            return dtos.map((dto) => Conta.fromDTO(dto));
        } catch {
            console.error("Erro ao ler o arquivo de persistência JSON, iniciando lista vazia.");
            return [];
        }
    }

    private salvarArquivo(contas: Conta[]): void {
        const dtos: ContaDTO[] = contas.map((c) => c.toDTO());
        fs.writeFileSync(this.caminhoArquivo, JSON.stringify(dtos, null, 2), "utf-8");
    }

    public adicionar(item: Conta): void {
        const contas = this.lerArquivo();
        const index = contas.findIndex((c) => c.getID() === item.getID());

        if (index !== -1) {
            contas[index] = item;
        } else {
            contas.push(item);
        }

        this.salvarArquivo(contas);
    }

    public buscarPorId(id: string): Conta | undefined {
        const contas = this.lerArquivo();
        return contas.find((c) => c.getID() === id);
    }

    public listarTodos(): Conta[] {
        return this.lerArquivo();
    }

    public deletar(id: string): void {
        const contas = this.lerArquivo();
        const index = contas.findIndex((c) => c.getID() === id);

        if (index !== -1) {
            contas.splice(index, 1);
            this.salvarArquivo(contas);
            console.log(`\n🗑️ Perfil com ID [${id}] foi removido com sucesso.`);
        } else {
            throw new Error("Perfil não encontrado para exclusão.");
        }
    }
}
