import { describe, it, expect, afterEach } from "vitest";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { RepositorioEmMemoria } from "../src/repo/RepositorioEmMemoria.js";
import { RepositorioContaJSON } from "../src/repo/repositorioJSON.js";
import { Conta } from "../src/models/conta.js";
import { Jogo } from "../src/models/jogo.js";

describe("RepositorioEmMemoria", () => {
    it("adiciona, busca por id e lista todos", () => {
        const repo = new RepositorioEmMemoria<Jogo>();
        repo.adicionar(new Jogo("J1", "Jogo", 80, "FPS"));
        expect(repo.buscarPorId("J1")?.getTitulo()).toBe("Jogo");
        expect(repo.listarTodos()).toHaveLength(1);
        expect(repo.buscarPorId("X")).toBeUndefined();
    });

    it("faz upsert: o mesmo ID não duplica e atualiza o registro", () => {
        const repo = new RepositorioEmMemoria<Jogo>();
        repo.adicionar(new Jogo("J1", "Versao 1", 80, "FPS"));
        repo.adicionar(new Jogo("J1", "Versao 2", 90, "FPS"));
        expect(repo.listarTodos()).toHaveLength(1);
        expect(repo.buscarPorId("J1")?.getTitulo()).toBe("Versao 2");
    });
});

describe("RepositorioContaJSON (round-trip via DTO)", () => {
    const arquivoTemp = path.join(os.tmpdir(), `dados_conta_test_${Date.now()}.json`);

    afterEach(() => {
        if (fs.existsSync(arquivoTemp)) {
            fs.unlinkSync(arquivoTemp);
        }
    });

    it("persiste e reconstrói a conta com itens como instâncias reais (não objetos crus)", () => {
        const repo = new RepositorioContaJSON(arquivoTemp);

        const conta = new Conta("u1", "User", "u@e.com", 250);
        conta.comprarItens(new Jogo("J1", "Jogo Persistido", 80, "FPS"));
        repo.adicionar(conta);

        const recarregada = repo.buscarPorId("u1");
        expect(recarregada).toBeDefined();
        expect(recarregada!.getSaldo()).toBe(170);

        const itens = recarregada!.getBiblioteca();
        expect(itens).toHaveLength(1);
        // Métodos disponíveis => é uma instância de Jogo, não um objeto cru.
        expect(itens[0]).toBeInstanceOf(Jogo);
        expect(itens[0].getTitulo()).toBe("Jogo Persistido");
        expect(recarregada!.getTotalGasto()).toBeCloseTo(80, 5);
    });

    it("upsert: salvar a mesma conta não duplica o registro", () => {
        const repo = new RepositorioContaJSON(arquivoTemp);
        const conta = new Conta("u1", "User", "u@e.com", 100);
        repo.adicionar(conta);
        conta.adicionarSaldo(50);
        repo.adicionar(conta);
        expect(repo.listarTodos()).toHaveLength(1);
        expect(repo.buscarPorId("u1")!.getSaldo()).toBe(150);
    });
});
