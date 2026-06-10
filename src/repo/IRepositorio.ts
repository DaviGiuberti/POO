export interface IRepositorio<T> {
    adicionar(item: T): void;
    buscarPorId(id: string): T | undefined;
    listarTodos(): T[];
}