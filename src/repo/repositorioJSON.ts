import * as fs from 'fs';
import * as path from 'path'; // 👈 1. IMPORTADO CORRETAMENTE AQUI
import { IRepositorio } from './IRepositorio.js';
import { Conta } from '../models/conta.js';


export class RepositorioContaJSON implements IRepositorio<Conta> {
    private caminhoArquivo: string;
    
    constructor() {
        // Agora o path vai funcionar perfeitamente!
        this.caminhoArquivo = path.resolve(process.cwd(), 'dados_conta.json');
    }

    private lerArquivo(): Conta[] {
        if (!fs.existsSync(this.caminhoArquivo)) {
            return []; 
        }

        try {
            const dadosRaw = fs.readFileSync(this.caminhoArquivo, 'utf-8');
            const dadosJson = JSON.parse(dadosRaw);

            return dadosJson.map((c: any) => {
                const contaReconstruida = new Conta(c.id, c.nomeUsuario, c.email, c.saldoCarteira);

                if (c.biblioteca) {
                    Object.defineProperty(contaReconstruida, 'biblioteca', {
                        value: c.biblioteca.map((b: any) => ({
                            item: b.item, 
                            dataCompra: new Date(b.dataCompra)
                        })),
                        writable: true,
                        configurable: true 
                    });
                }

                if (c.historicoTransacoes) {
                    Object.defineProperty(contaReconstruida, 'historicoTransacoes', {
                        value: c.historicoTransacoes, 
                        writable: true
                    });
                }

                return contaReconstruida;
            }); 

        } catch (error) {
            console.error("Erro ao ler o arquivo de persistência JSON, iniciando lista vazia.");
            return [];
        }
    }

    private salvarArquivo(contas: Conta[]): void {
        const dadosAoSalvar = contas.map(c => ({
            id: c.getID(),
            nomeUsuario: (c as any).nomeUsuario,
            email: (c as any).email,
            saldoCarteira: c.getSaldo(),
            biblioteca: (c as any).biblioteca,
            historicoTransacoes: c.getHistorico()
        }));
        
        fs.writeFileSync(this.caminhoArquivo, JSON.stringify(dadosAoSalvar, null, 2), 'utf-8');
    }

    public adicionar(item: Conta): void {
        const contas = this.lerArquivo();
        const index = contas.findIndex(c => c.getID() === item.getID());

        if (index !== -1) {
            contas[index] = item; 
        } else {
            contas.push(item); 
        }

        this.salvarArquivo(contas);
    }

    public buscarPorId(id: string): Conta | undefined {
        const contas = this.lerArquivo();
        return contas.find(c => c.getID() === id);
    }

    public listarTodos(): Conta[] {
        return this.lerArquivo();
    }

    public deletar(id: string): void {
        const contas = this.lerArquivo();
        const index = contas.findIndex(c => c.getID() === id);

        if (index !== -1) {
            contas.splice(index, 1);
            this.salvarArquivo(contas);
            console.log(`\n🗑️ Perfil com ID [${id}] foi removido com sucesso.`);
        } else {
            throw new Error("Perfil não encontrado para exclusão.");
        }
    }
}