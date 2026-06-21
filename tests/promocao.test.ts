import { describe, it, expect } from "vitest";
import { Jogo, DLC } from "../src/models/jogo.js";
import { DescontoPercentual, DescontoPorCategoria } from "../src/services/promocao.js";

describe("DescontoPercentual", () => {
    it("calcula o desconto como percentual do preço de tabela", () => {
        const jogo = new Jogo("J1", "Jogo", 200, "FPS");
        const promo = new DescontoPercentual("Promo Geral", 25);
        expect(promo.calcularDesconto(jogo)).toBeCloseTo(50, 5);
    });

    it("aplica o desconto também sobre o preço de tabela da DLC (já com complemento)", () => {
        const dlc = new DLC("D1", "DLC", 100, "J1"); // tabela = 90
        const promo = new DescontoPercentual("Promo Geral", 50);
        expect(promo.calcularDesconto(dlc)).toBeCloseTo(45, 5);
    });
});

describe("DescontoPorCategoria", () => {
    it("aplica desconto apenas a itens da categoria-alvo", () => {
        const jogoAlvo = new Jogo("J1", "Mundo Aberto", 100, "Mundo Aberto");
        const promo = new DescontoPorCategoria("Inverno", 50, "Mundo Aberto");
        expect(promo.calcularDesconto(jogoAlvo)).toBeCloseTo(50, 5);
    });

    it("não aplica desconto a itens de outra categoria", () => {
        const jogoFora = new Jogo("J2", "FPS", 100, "FPS");
        const promo = new DescontoPorCategoria("Inverno", 50, "Mundo Aberto");
        expect(promo.calcularDesconto(jogoFora)).toBe(0);
    });

    it("não aplica desconto a DLCs (não categorizáveis)", () => {
        const dlc = new DLC("D1", "DLC", 100, "J1");
        const promo = new DescontoPorCategoria("Inverno", 50, "Mundo Aberto");
        expect(promo.calcularDesconto(dlc)).toBe(0);
    });
});

describe("getPrecoFinal (preço de tabela + promoção)", () => {
    it("retorna o preço de tabela quando não há promoção", () => {
        const jogo = new Jogo("J1", "Jogo", 80, "Mundo Aberto");
        expect(jogo.getPrecoFinal()).toBe(80);
    });

    it("subtrai o desconto do preço de tabela", () => {
        const jogo = new Jogo("J1", "Jogo", 80, "Mundo Aberto");
        const promo = new DescontoPorCategoria("Inverno", 50, "Mundo Aberto");
        expect(jogo.getPrecoFinal(promo)).toBeCloseTo(40, 5);
    });

    it("nunca retorna preço negativo", () => {
        const jogo = new Jogo("J1", "Jogo", 80, "Mundo Aberto");
        const promo = new DescontoPercentual("Mega", 150);
        expect(jogo.getPrecoFinal(promo)).toBe(0);
    });
});
