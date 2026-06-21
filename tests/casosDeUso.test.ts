import { describe, it, expect, beforeEach } from "vitest";
import { RepositorioEmMemoria } from "../src/repo/RepositorioEmMemoria.js";
import { Conta } from "../src/models/conta.js";
import { ItemDigital } from "../src/models/ItemDigital.js";
import { Jogo, DLC } from "../src/models/jogo.js";
import { DescontoPorCategoria } from "../src/services/promocao.js";
import { ComprarItem } from "../src/casos-de-uso/ComprarItem.js";
import { ReembolsarItem } from "../src/casos-de-uso/ReembolsarItem.js";
import { AdicionarSaldo } from "../src/casos-de-uso/AdicionarSaldo.js";

describe("Casos de uso (com injeção de repositórios em memória)", () => {
    let repoContas: RepositorioEmMemoria<Conta>;
    let repoItens: RepositorioEmMemoria<ItemDigital>;
    const promo = new DescontoPorCategoria("Inverno", 50, "Mundo Aberto");

    beforeEach(() => {
        repoContas = new RepositorioEmMemoria<Conta>();
        repoItens = new RepositorioEmMemoria<ItemDigital>();
        repoContas.adicionar(new Conta("u1", "User", "u@e.com", 250));
        repoItens.adicionar(new Jogo("MA-01", "GTA V", 80, "Mundo Aberto"));
        repoItens.adicionar(new DLC("MA-01-D1", "DLC", 30, "MA-01"));
    });

    it("ComprarItem aplica a promoção e persiste a conta", () => { // Fluxo A passo 4-7
        const uc = new ComprarItem(repoContas, repoItens);
        const resultado = uc.executar("u1", "MA-01", promo);

        expect(resultado.precoOriginal).toBe(80);
        expect(resultado.precoPago).toBeCloseTo(40, 5);
        expect(resultado.saldoRestante).toBe(210);
        expect(repoContas.buscarPorId("u1")!.getBiblioteca()).toHaveLength(1);
    });

    it("ComprarItem propaga erro de item inexistente", () => { // Fluxo A - passo 5
        const uc = new ComprarItem(repoContas, repoItens);
        expect(() => uc.executar("u1", "NAO-EXISTE", promo)).toThrow(/não encontrado/i);
    });

    it("ReembolsarItem estorna o valor pago", () => { // Fluxo B - passo 2-5
        new ComprarItem(repoContas, repoItens).executar("u1", "MA-01", promo);
        const resultado = new ReembolsarItem(repoContas).executar("u1", "MA-01");

        expect(resultado.tituloItem).toBe("GTA V");
        expect(resultado.valorEstornado).toBeCloseTo(40, 5);
        expect(resultado.saldoAtual).toBe(250);
    });

    it("AdicionarSaldo credita e persiste", () => { // Fluxo C - passo 2-4
        const novoSaldo = new AdicionarSaldo(repoContas).executar("u1", 100);
        expect(novoSaldo).toBe(350);
        expect(repoContas.buscarPorId("u1")!.getSaldo()).toBe(350);
    });

    it("AdicionarSaldo valida valor inválido", () => { // Fluxo C
        expect(() => new AdicionarSaldo(repoContas).executar("u1", -5)).toThrow(/maior que zero/i);
    });
});
