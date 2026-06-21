import { Categorizavel, ItemDigital } from "./ItemDigital.js";
import { ItemDigitalDTO } from "./dtos.js";

// Esse arquivo define as classes de Jogo e DLC, filhas de ItemDigital, e a função itemFromDTO que reconstrói um item a partir de um DTO.

export class Jogo extends ItemDigital implements Categorizavel {
    // herança de item digital e implementação da interface Categorizavel
    // um Jogo agrega as DLCs que o complementam.
    private dlcs: DLC[] = [];

    constructor(
        id: string,
        titulo: string,
        precoBase: number,
        private genero: string
    ) {
        // chama o construtor da superclasse ItemDigital para inicializar id, titulo e precoBase
        super(id, titulo, precoBase);
        // jogo precisa ter genero
        if (!genero || genero.trim().length === 0) {
            throw new Error("Jogo inválido: o gênero não pode ser vazio.");
        }
    }
    // adiciona uma DLC ao jogo, que será usada para calcular o preço da edição completa
    public adicionarDLC(dlc: DLC): void {
        this.dlcs.push(dlc);
    }
    // retorna uma cópia do array de DLCs
    public getDLCs(): DLC[] {
        return [...this.dlcs];
    }
    // implementa o método da interface Categorizavel, retornando o gênero do jogo
    public getGenero(): string {
        return this.genero;
    }

    // polimorfismo: o preço final de um jogo é o preço base, já dlc tem desconto de complemento
    public calcularPrecoFinal(): number {
        return this.precoBase;
    }

    // calcula o preço da edição completa do jogo, somando o preço base do jogo com o preço final de todas as DLCs associadas
    public calcularPrecoEdicaoCompleta(): number {
        return this.dlcs.reduce((total, dlc) => total + dlc.calcularPrecoFinal(), this.precoBase);
    }
    // converte o jogo em um DTO, incluindo o gênero e o tipo "Jogo"
    public toDTO(): ItemDigitalDTO {
        return {
            tipo: "Jogo",
            id: this.id,
            titulo: this.titulo,
            precoBase: this.precoBase,
            genero: this.genero,
        };
    }
}

// classe DLC é um item digital que complementa um jogo, com desconto fixo de 10%
export class DLC extends ItemDigital {
    // herança de item digital
    // desconto fixo de 10% para DLCs, que são complementos de jogos
    public static readonly DESCONTO_COMPLEMENTO = 0.1;

    constructor(
        id: string,
        titulo: string,
        precoBase: number,
        private idJogoPrincipal: string
    ) {
        super(id, titulo, precoBase);

        if (!idJogoPrincipal || idJogoPrincipal.trim().length === 0) {
            throw new Error("DLC inválida: é obrigatório referenciar o jogo-base.");
        }
    }

    public getIdJogoPrincipal(): string {
        return this.idJogoPrincipal;
    }

    // o preço final de uma DLC é o preço base com um desconto de complemento, que é uma porcentagem fixa do preço base
    public calcularPrecoFinal(): number {
        return this.precoBase * (1 - DLC.DESCONTO_COMPLEMENTO);
    }

    public toDTO(): ItemDigitalDTO {
        return {
            tipo: "DLC",
            id: this.id,
            titulo: this.titulo,
            precoBase: this.precoBase,
            idJogoPrincipal: this.idJogoPrincipal,
        };
    }
}

// função de fábrica que reconstrói um item digital (Jogo ou DLC) a partir de um DTO, usando o campo "tipo" para determinar qual classe instanciar.
export function itemFromDTO(dto: ItemDigitalDTO): ItemDigital {
    const tipo = dto.tipo ?? (dto.idJogoPrincipal != null ? "DLC" : "Jogo");

    if (tipo === "DLC") {
        return new DLC(dto.id, dto.titulo, dto.precoBase, dto.idJogoPrincipal ?? "");
    }

    return new Jogo(dto.id, dto.titulo, dto.precoBase, dto.genero ?? "Desconhecido");
}
