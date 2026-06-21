import { describe, it, expect } from "vitest";
import { Conta } from "../src/models/conta.js";
import { Jogo } from "../src/models/jogo.js";
import { ContaDTO } from "../src/models/dtos.js";
import {
    PlanoAssinatura,
    PlanoBasico,
    PlanoPlus,
    PlanoPremium,
    planoPorNome,
} from "../src/models/planos/index.js";

describe("PlanoAssinatura (polimorfismo)", () => {
    const casos: Array<[PlanoAssinatura, string, number, number]> = [
        [new PlanoBasico(), "Básico", 0, 7],
        [new PlanoPlus(), "Plus", 5, 14],
        [new PlanoPremium(), "Premium", 10, 21],
    ];

    it.each(casos)(
        "%s expõe nome, cashback e janela de reembolso próprios",
        (plano, nome, cashback, dias) => {
            expect(plano.nome()).toBe(nome);
            expect(plano.percentualCashback()).toBe(cashback);
            expect(plano.diasReembolso()).toBe(dias);
        }
    );

    it("a fábrica planoPorNome reconstrói o plano correto e cai no Básico por padrão", () => {
        expect(planoPorNome("Plus")).toBeInstanceOf(PlanoPlus);
        expect(planoPorNome("Premium")).toBeInstanceOf(PlanoPremium);
        expect(planoPorNome(undefined)).toBeInstanceOf(PlanoBasico);
        expect(planoPorNome("Inexistente")).toBeInstanceOf(PlanoBasico);
    });
});

describe("Cashback do plano na compra/reembolso", () => {
    it("plano Básico não gera cashback (comportamento original preservado)", () => {
        const conta = new Conta("u1", "User", "u@e.com", 200, new PlanoBasico());
        const cashback = conta.comprarItens(new Jogo("J1", "Jogo", 100, "FPS"));
        expect(cashback).toBe(0);
        expect(conta.getSaldo()).toBe(100);
    });

    it("plano Plus credita 5% de cashback na compra", () => {
        const conta = new Conta("u1", "User", "u@e.com", 200, new PlanoPlus());
        const cashback = conta.comprarItens(new Jogo("J1", "Jogo", 100, "FPS"));
        expect(cashback).toBeCloseTo(5, 5);
        // 200 - 100 + 5 = 105
        expect(conta.getSaldo()).toBeCloseTo(105, 5);
    });

    it("o reembolso reverte o cashback: o saldo volta ao estado anterior à compra", () => {
        const conta = new Conta("u1", "User", "u@e.com", 200, new PlanoPremium());
        conta.comprarItens(new Jogo("J1", "Jogo", 100, "FPS")); // cashback 10 -> saldo 110
        expect(conta.getSaldo()).toBeCloseTo(110, 5);

        conta.reembolsarItem("J1"); // estorna 100, reverte 10 -> saldo 200
        expect(conta.getSaldo()).toBeCloseTo(200, 5);
        expect(conta.getBiblioteca()).toHaveLength(0);
    });
});

describe("Janela de reembolso varia conforme o plano", () => {
    function contaComCompraAntiga(plano: string, diasAtras: number): Conta {
        const data = new Date();
        data.setTime(data.getTime() - diasAtras * 24 * 60 * 60 * 1000);

        const dto: ContaDTO = {
            id: "u1",
            nomeUsuario: "User",
            email: "u@e.com",
            saldoCarteira: 100,
            plano,
            biblioteca: [
                {
                    item: { tipo: "Jogo", id: "J1", titulo: "Jogo", precoBase: 80, genero: "FPS" },
                    dataCompra: data.toISOString(),
                    precoPago: 80,
                    cashbackCreditado: 0,
                },
            ],
            historicoTransacoes: [],
        };

        return Conta.fromDTO(dto);
    }

    it("Premium (21 dias) ainda permite reembolso de uma compra de 14 dias atrás", () => {
        const conta = contaComCompraAntiga("Premium", 14);
        expect(() => conta.reembolsarItem("J1")).not.toThrow();
    });

    it("Básico (7 dias) nega o reembolso da mesma compra de 14 dias atrás", () => {
        const conta = contaComCompraAntiga("Básico", 14);
        expect(() => conta.reembolsarItem("J1")).toThrow(/prazo limite/i);
    });
});
