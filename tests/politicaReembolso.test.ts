import { describe, it, expect } from "vitest";
import { PoliticaReembolso, RegistroCompra } from "../src/services/PoliticaReembolso.js";
import { Jogo } from "../src/models/jogo.js";

function compraComDiasAtras(dias: number): RegistroCompra {
    const data = new Date();
    data.setTime(data.getTime() - dias * 24 * 60 * 60 * 1000);
    return {
        item: new Jogo("J1", "Jogo", 80, "FPS"),
        dataCompra: data,
        precoPago: 80,
    };
}

describe("PoliticaReembolso (regra dos 7 dias)", () => {
    it("permite reembolso de compra recente", () => {
        expect(() => PoliticaReembolso.validarElegibilidade(compraComDiasAtras(1))).not.toThrow();
    });

    it("permite reembolso dentro do limite (6 dias)", () => {
        expect(() => PoliticaReembolso.validarElegibilidade(compraComDiasAtras(6))).not.toThrow();
    });

    it("nega reembolso após o limite (10 dias)", () => {
        expect(() => PoliticaReembolso.validarElegibilidade(compraComDiasAtras(10))).toThrow(/prazo limite/i);
    });
});

describe("PoliticaReembolso — bordas exatas (com data injetada)", () => {
    const base = new Date("2026-01-01T12:00:00.000Z");
    const compra: RegistroCompra = {
        item: new Jogo("J1", "Jogo", 80, "FPS"),
        dataCompra: base,
        precoPago: 80,
    };

    const maisDias = (dias: number, ms = 0): Date =>
        new Date(base.getTime() + dias * 24 * 60 * 60 * 1000 + ms);

    it("permite reembolso exatamente no limite (7 dias cravados)", () => {
        expect(() => PoliticaReembolso.validarElegibilidade(compra, 7, maisDias(7))).not.toThrow();
    });

    it("nega reembolso 1ms após o limite (7 dias)", () => {
        expect(() => PoliticaReembolso.validarElegibilidade(compra, 7, maisDias(7, 1))).toThrow(
            /prazo limite/i
        );
    });

    it("respeita um limite de dias maior (21): permite no 20º dia, nega no 22º", () => {
        expect(() => PoliticaReembolso.validarElegibilidade(compra, 21, maisDias(20))).not.toThrow();
        expect(() => PoliticaReembolso.validarElegibilidade(compra, 21, maisDias(22))).toThrow(
            /prazo limite/i
        );
    });
});
