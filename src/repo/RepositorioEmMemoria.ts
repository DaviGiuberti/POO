import { IRepositorio } from "./IRepositorio.js";

// esse arquivo existe para dados que não precisam ficar apos fechar o programa

export class RepositorioEmMemoria<T extends { getID(): string }> implements IRepositorio<T> {
    // implementa a interface IRepositorio<T> para armazenar dados em memória
    private dados: T[] = [];
    public adicionar(item: T): void {
        const index = this.dados.findIndex((d) => d.getID() === item.getID());
        if (index !== -1) {
            this.dados[index] = item;
        } else {
            this.dados.push(item);
        }
    }

    public buscarPorId(id: string): T | undefined {
        return this.dados.find((item) => item.getID() === id);
    }

    public listarTodos(): T[] {
        return [...this.dados];
    }
}
