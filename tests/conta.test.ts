import { describe, it, expect } from "vitest";
import { Conta } from "../src/models/conta.js";
import { Jogo, DLC } from "../src/models/jogo.js";
import { DescontoPorCategoria } from "../src/services/promocao.js";
import { ContaDTO } from "../src/models/dtos.js";

describe("Conta.adicionarSaldo", () => {
    it("credita um valor válido", () => {
        const conta = new Conta("u1", "User", "u@e.com", 100);
        conta.adicionarSaldo(50);
        expect(conta.getSaldo()).toBe(150);
    });

    it("rejeita valor zero ou negativo", () => {
        const conta = new Conta("u1", "User", "u@e.com", 100);
        expect(() => conta.adicionarSaldo(0)).toThrow(/maior que zero/i);
        expect(() => conta.adicionarSaldo(-10)).toThrow(/maior que zero/i);
    });
});

describe("Conta.comprarItens", () => {
    it("debita o saldo e registra a compra", () => {
        const conta = new Conta("u1", "User", "u@e.com", 100);
        conta.comprarItens(new Jogo("J1", "Jogo", 80, "FPS"));
        expect(conta.getSaldo()).toBe(20);
        expect(conta.getBiblioteca().map((i) => i.getID())).toContain("J1");
    });

    it("rejeita compra com saldo insuficiente", () => {
        const conta = new Conta("u1", "User", "u@e.com", 10);
        expect(() => conta.comprarItens(new Jogo("J1", "Jogo", 80, "FPS"))).toThrow(/saldo insuficiente/i);
    });

    it("bloqueia compra de item duplicado", () => {
        const conta = new Conta("u1", "User", "u@e.com", 1000);
        const jogo = new Jogo("J1", "Jogo", 80, "FPS");
        conta.comprarItens(jogo);
        expect(() => conta.comprarItens(jogo)).toThrow(/já possui/i);
    });

    it("exige o jogo-base para comprar uma DLC", () => {
        const conta = new Conta("u1", "User", "u@e.com", 1000);
        const dlc = new DLC("J1-D1", "DLC", 50, "J1");
        expect(() => conta.comprarItens(dlc)).toThrow(/jogo-base/i);
    });

    it("permite comprar a DLC depois de possuir o jogo-base", () => {
        const conta = new Conta("u1", "User", "u@e.com", 1000);
        conta.comprarItens(new Jogo("J1", "Jogo", 80, "FPS"));
        conta.comprarItens(new DLC("J1-D1", "DLC", 50, "J1"));
        expect(conta.getBiblioteca().map((i) => i.getID())).toContain("J1-D1");
    });
});

describe("Conta.reembolsarItem", () => {
    it("estorna exatamente o valor pago, sem lucro em itens promocionais", () => {
        const conta = new Conta("u1", "User", "u@e.com", 250);
        const promo = new DescontoPorCategoria("Inverno", 50, "Mundo Aberto");
        const jogo = new Jogo("MA-01", "GTA V", 80, "Mundo Aberto");

        conta.comprarItens(jogo, promo); // paga 40
        expect(conta.getSaldo()).toBe(210);

        conta.reembolsarItem("MA-01"); // estorna 40, não 80
        expect(conta.getSaldo()).toBe(250);
        expect(conta.getBiblioteca()).toHaveLength(0);
    });

    it("falha ao reembolsar item inexistente", () => {
        const conta = new Conta("u1", "User", "u@e.com", 250);
        expect(() => conta.reembolsarItem("X")).toThrow(/não foi encontrado/i);
    });

    it("nega reembolso após 7 dias (via conta reconstruída de DTO)", () => {
        const dezDiasAtras = new Date();
        dezDiasAtras.setTime(dezDiasAtras.getTime() - 10 * 24 * 60 * 60 * 1000);

        const dto: ContaDTO = {
            id: "u1",
            nomeUsuario: "User",
            email: "u@e.com",
            saldoCarteira: 100,
            biblioteca: [
                {
                    item: { tipo: "Jogo", id: "J1", titulo: "Jogo Antigo", precoBase: 80, genero: "FPS" },
                    dataCompra: dezDiasAtras.toISOString(),
                    precoPago: 80,
                },
            ],
            historicoTransacoes: [],
        };

        const conta = Conta.fromDTO(dto);
        expect(() => conta.reembolsarItem("J1")).toThrow(/prazo limite/i);
    });
});

describe("Conta.getTotalGasto", () => {
    it("soma o preço pago de todos os itens da biblioteca (reduce)", () => {
        const conta = new Conta("u1", "User", "u@e.com", 1000);
        conta.comprarItens(new Jogo("J1", "Jogo A", 80, "FPS"));
        conta.comprarItens(new Jogo("J2", "Jogo B", 120, "FPS"));
        expect(conta.getTotalGasto()).toBeCloseTo(200, 5);
    });
});
