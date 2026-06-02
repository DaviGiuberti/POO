import { IRepositorio } from "./IRepositorio";

export class RepositorioEmMemoria<T extends { getId(): string }> implements IRepositorio<T> {
    private dados: T[] = [];

    public adicionar(item: T): void {
        this.dados.push(item);
    }

    public buscarPorId(id: string): T | undefined {
        return this.dados.find(item => item.getId() === id);
    }

    public listarTodos(): T[] {
        return [...this.dados];
    }

    public deletar(id: string): boolean {
        const index = this.dados.findIndex(item => item.getId() === id);
        if (index !== -1) {
            this.dados.splice(index, 1);
            return true;
        }
        return false;
    }
}