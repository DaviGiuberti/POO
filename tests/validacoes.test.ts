import { describe, it, expect } from "vitest";
import { Conta } from "../src/models/conta.js";
import { Jogo, DLC } from "../src/models/jogo.js";

describe("RN10 — validação no construtor da Conta", () => {
    it("aceita uma conta válida", () => {
        expect(() => new Conta("u1", "User", "u@e.com", 100)).not.toThrow();
    });

    it("rejeita nome com menos de 2 caracteres", () => {
        expect(() => new Conta("u1", "A", "u@e.com", 100)).toThrow(/nome/i);
    });

    it("rejeita e-mail sem '@'", () => {
        expect(() => new Conta("u1", "User", "email-invalido", 100)).toThrow(/e-mail/i);
    });

    it("rejeita saldo inicial negativo", () => {
        expect(() => new Conta("u1", "User", "u@e.com", -1)).toThrow(/saldo/i);
    });

    it("rejeita id vazio", () => {
        expect(() => new Conta("", "User", "u@e.com", 100)).toThrow(/ID/i);
    });

    it("aceita saldo inicial zero", () => {
        expect(() => new Conta("u1", "User", "u@e.com", 0)).not.toThrow();
    });
});

describe("RN10 — validação no construtor do Jogo / ItemDigital", () => {
    it("aceita um jogo válido (inclusive gratuito, preço 0)", () => {
        expect(() => new Jogo("J1", "Valorant", 0, "FPS")).not.toThrow();
    });

    it("rejeita título com menos de 2 caracteres", () => {
        expect(() => new Jogo("J1", "X", 80, "FPS")).toThrow(/título/i);
    });

    it("rejeita preço base negativo", () => {
        expect(() => new Jogo("J1", "Jogo", -10, "FPS")).toThrow(/preço/i);
    });

    it("rejeita gênero vazio", () => {
        expect(() => new Jogo("J1", "Jogo", 80, "")).toThrow(/gênero/i);
    });
});

describe("RN10 — validação no construtor da DLC", () => {
    it("aceita uma DLC válida", () => {
        expect(() => new DLC("J1-D1", "Expansão", 30, "J1")).not.toThrow();
    });

    it("rejeita DLC sem referência ao jogo-base", () => {
        expect(() => new DLC("J1-D1", "Expansão", 30, "")).toThrow(/jogo-base/i);
    });
});
