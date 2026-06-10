import { ItemDigital } from "./ItemDigital.js";
import { RepositorioEmMemoria } from "../repo/RepositorioEmMemoria.js";

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
    // 📂 Categoria: Mundo Aberto / Ação (Prefixo: MA)
    repoJogos.adicionar(new Jogo("MA-01", "Grand Theft Auto V", 80.00, "Mundo Aberto"));
    repoJogos.adicionar(new DLC("MA-01-D1", "GTA Online: Pacote de Dinheiro Tubarao", 30.00, "MA-01"));
    
    repoJogos.adicionar(new Jogo("MA-02", "Cyberpunk 2077", 199.90, "Mundo Aberto"));
    repoJogos.adicionar(new DLC("MA-02-D1", "DLC Phantom Liberty", 99.90, "MA-02"));
    
    repoJogos.adicionar(new Jogo("MA-03", "Elden Ring", 229.00, "Mundo Aberto"));
    repoJogos.adicionar(new DLC("MA-03-D1", "DLC Shadow of the Erdtree", 154.00, "MA-03"));
    
    repoJogos.adicionar(new Jogo("MA-04", "Resident Evil 4 Remake", 169.00, "Mundo Aberto"));
    repoJogos.adicionar(new DLC("MA-04-D1", "DLC Separate Ways", 48.00, "MA-04"));

    // 📂 Categoria: FPS / Tiro (Prefixo: FPS)
    repoJogos.adicionar(new Jogo("FPS-01", "Valorant", 0.00, "FPS"));
    repoJogos.adicionar(new DLC("FPS-01-D1", "Passe de Batalha: Colecao Saqueadora", 40.00, "FPS-01"));
    
    repoJogos.adicionar(new Jogo("FPS-02", "Counter-Strike 2", 0.00, "FPS"));
    repoJogos.adicionar(new Jogo("FPS-03", "Call of Duty: Black Ops 6", 339.00, "FPS"));
    repoJogos.adicionar(new Jogo("FPS-04", "Overwatch 2", 0.00, "FPS"));

    // 📂 Categoria: Esportes / Corrida (Prefixo: ESP)
    repoJogos.adicionar(new Jogo("ESP-01", "Rocket League", 0.00, "Esportes"));
    repoJogos.adicionar(new Jogo("ESP-02", "EA SPORTS FC 24", 150.00, "Esportes"));
    
    repoJogos.adicionar(new Jogo("ESP-03", "Forza Horizon 5", 249.00, "Esportes"));
    repoJogos.adicionar(new DLC("ESP-03-D1", "DLC Pacote de Expansao Hot Wheels", 79.00, "ESP-03"));
    
    repoJogos.adicionar(new Jogo("ESP-04", "F1 24", 359.00, "Esportes"));

    // 📂 Categoria: Estratégia (Prefixo: EST)
    repoJogos.adicionar(new Jogo("EST-01", "Hearts of Iron IV", 80.00, "Estrategia"));
    repoJogos.adicionar(new DLC("EST-01-D1", "DLC Trial of Allegiance", 40.00, "EST-01"));
    
    repoJogos.adicionar(new Jogo("EST-02", "Football Manager", 199.00, "Estrategia"));
    repoJogos.adicionar(new Jogo("EST-03", "Age of Empires IV", 99.90, "Estrategia"));

    // 📂 Categoria: Simulador (Prefixo: SIM)
    repoJogos.adicionar(new Jogo("SIM-01", "Hand Simulator", 10.00, "Simulador"));
    
    repoJogos.adicionar(new Jogo("SIM-02", "The Sims 4", 0.00, "Simulador"));
    repoJogos.adicionar(new DLC("SIM-02-D1", "DLC Rumo a Fama", 159.00, "SIM-02"));
    
    repoJogos.adicionar(new Jogo("SIM-02-D2", "DLC Estações", 159.00, "SIM-02")); // Exemplo de segunda DLC vinculada ao mesmo jogo
    repoJogos.adicionar(new Jogo("SIM-03", "Minecraft", 149.00, "Simulador"));
}