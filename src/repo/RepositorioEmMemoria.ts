import { IRepositorio } from "./IRepositorio";

export class RepositorioEmMemoria<T extends { getID(): string }> implements IRepositorio<T> {
    private dados: T[] = [];

    public adicionar(item: T): void {
        this.dados.push(item);
    }

    public buscarPorId(id: string): T | undefined {
        return this.dados.find(item => item.getID() === id);
    }

    public listarTodos(): T[] {
        return [...this.dados];
    }

}