import { describe, it, expect } from "vitest";
import { Jogo, DLC } from "../src/models/jogo.js";

describe("Polimorfismo comportamental de calcularPrecoFinal", () => {
    it("Jogo cobra o preço de tabela cheio", () => {
        const jogo = new Jogo("J1", "Jogo Teste", 100, "Mundo Aberto");
        expect(jogo.calcularPrecoFinal()).toBe(100);
    });

    it("DLC aplica o desconto fixo de complemento (10%)", () => {
        const dlc = new DLC("D1", "DLC Teste", 100, "J1");
        expect(dlc.calcularPrecoFinal()).toBeCloseTo(90, 5);
    });

    it("o mesmo método produz resultados diferentes conforme o tipo (polimorfismo)", () => {
        const jogo = new Jogo("J1", "Jogo", 100, "FPS");
        const dlc = new DLC("D1", "DLC", 100, "J1");
        expect(jogo.calcularPrecoFinal()).not.toBe(dlc.calcularPrecoFinal());
    });

    it("calcularPrecoEdicaoCompleta soma o jogo-base e as DLCs vinculadas (reduce)", () => {
        const jogo = new Jogo("J1", "Jogo", 100, "FPS");
        jogo.adicionarDLC(new DLC("D1", "DLC A", 50, "J1")); // 45
        jogo.adicionarDLC(new DLC("D2", "DLC B", 100, "J1")); // 90
        expect(jogo.calcularPrecoEdicaoCompleta()).toBeCloseTo(100 + 45 + 90, 5);
    });
});
