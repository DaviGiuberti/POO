import { ItemDigital } from "./ItemDigital.js";
import { RepositorioEmMemoria } from "./RepositorioEmMemoria.js";

export class Jogo extends ItemDigital {
    private dlcs: DLC[] = [];

    constructor(
        id: string, 
        titulo: string, 
        precoBase: number, 
        private genero: string // Mantido private, mas criamos o método de acesso abaixo
    ) {
        super(id, titulo, precoBase);
    }

    public adicionarDLC(dlc: DLC): void {
        this.dlcs.push(dlc);
    }

    // Método de acesso essencial para o menu por tópicos funcionar sem quebrar
    public getGenero(): string {
        return this.genero;
    }

    // Implementação de polimorfismo
    public calcularPrecoFinal(): number {
        // Retorna o preço base cheio por enquanto
        return this.precoBase;
    }
}

export class DLC extends ItemDigital {
    constructor(
        id: string, 
        titulo: string, 
        precoBase: number, 
        private idJogoPrincipal: string
    ) {
        super(id, titulo, precoBase);
    }

    public getIdJogoPrincipal(): string {
        return this.idJogoPrincipal;
    }

    // Corrigido: Agora a DLC cobra o preço real dela em vez de multiplicar por zero!
    public calcularPrecoFinal(): number {
        return this.precoBase;
    }
}

// --- FUNÇÃO DE SEEDING (POPULAR O BANCO) ---
export function popularLojaDeTestes(repoJogos: RepositorioEmMemoria<ItemDigital>): void {
    // 📂 Categoria: Mundo Aberto / Ação
    repoJogos.adicionar(new Jogo("10", "Grand Theft Auto V", 80.00, "Mundo Aberto"));
    repoJogos.adicionar(new DLC("11", "GTA Online: Pacote de Dinheiro Tubarao", 30.00, "10"));
    repoJogos.adicionar(new Jogo("12", "Cyberpunk 2077", 199.90, "Mundo Aberto"));
    repoJogos.adicionar(new DLC("13", "DLC Phantom Liberty", 99.90, "12"));
    repoJogos.adicionar(new Jogo("14", "Elden Ring", 229.00, "Mundo Aberto"));
    repoJogos.adicionar(new DLC("15", "DLC Shadow of the Erdtree", 154.00, "14"));
    repoJogos.adicionar(new Jogo("16", "Resident Evil 4 Remake", 169.00, "Mundo Aberto"));
    repoJogos.adicionar(new DLC("17", "DLC Separate Ways", 48.00, "16"));

    // 📂 Categoria: FPS / Tiro
    repoJogos.adicionar(new Jogo("20", "Valorant", 0.00, "FPS"));
    repoJogos.adicionar(new DLC("21", "Passe de Batalha: Colecao Saqueadora", 40.00, "20"));
    repoJogos.adicionar(new Jogo("22", "Counter-Strike 2", 0.00, "FPS"));
    repoJogos.adicionar(new Jogo("23", "Call of Duty: Black Ops 6", 339.00, "FPS"));
    repoJogos.adicionar(new Jogo("24", "Overwatch 2", 0.00, "FPS"));

    // 📂 Categoria: Esportes / Corrida
    repoJogos.adicionar(new Jogo("30", "Rocket League", 0.00, "Esportes"));
    repoJogos.adicionar(new Jogo("31", "EA SPORTS FC 24", 150.00, "Esportes"));
    repoJogos.adicionar(new Jogo("32", "Forza Horizon 5", 249.00, "Esportes"));
    repoJogos.adicionar(new DLC("33", "DLC Pacote de Expansao Hot Wheels", 79.00, "32"));
    repoJogos.adicionar(new Jogo("34", "F1 24", 359.00, "Esportes"));

    // 📂 Categoria: Estratégia / Simuladores
    repoJogos.adicionar(new Jogo("40", "Hearts of Iron IV", 80.00, "Estrategia"));
    repoJogos.adicionar(new DLC("42", "DLC Trial of Allegiance", 40.00, "40")); // Nova DLC do HoI4 de respeito
    repoJogos.adicionar(new Jogo("43", "Football Manager", 199.00, "Estrategia"));
    repoJogos.adicionar(new Jogo("44", "Age of Empires IV", 99.90, "Estrategia"));

    // 📂 Categoria: Simulador
    repoJogos.adicionar(new Jogo("41", "Hand Simulator", 10.00, "Simulador"));
    repoJogos.adicionar(new Jogo("50", "The Sims 4", 0.00, "Simulador"));
    repoJogos.adicionar(new DLC("51", "DLC Rumo a Fama", 159.00, "50"));
    repoJogos.adicionar(new Jogo("52", "Minecraft", 149.00, "Simulador"));
}