import { IRepositorio } from "../repo/IRepositorio.js";
import { ItemDigital } from "../models/ItemDigital.js";
import { Jogo, DLC } from "../models/jogo.js";

// catalogo da loja

export function popularLojaDeTestes(repoJogos: IRepositorio<ItemDigital>): void {
    const adicionarDLC = (jogoBase: Jogo, dlc: DLC): void => {
        repoJogos.adicionar(dlc);
        jogoBase.adicionarDLC(dlc);
    };

    // 📂 Categoria: Mundo Aberto / Ação (Prefixo: MA)
    const gta = new Jogo("MA-01", "Grand Theft Auto V", 80.0, "Mundo Aberto");
    repoJogos.adicionar(gta);
    adicionarDLC(gta, new DLC("MA-01-D1", "GTA Online: Pacote de Dinheiro Tubarao", 30.0, "MA-01"));

    const cyberpunk = new Jogo("MA-02", "Cyberpunk 2077", 199.9, "Mundo Aberto");
    repoJogos.adicionar(cyberpunk);
    adicionarDLC(cyberpunk, new DLC("MA-02-D1", "DLC Phantom Liberty", 99.9, "MA-02"));

    const eldenRing = new Jogo("MA-03", "Elden Ring", 229.0, "Mundo Aberto");
    repoJogos.adicionar(eldenRing);
    adicionarDLC(eldenRing, new DLC("MA-03-D1", "DLC Shadow of the Erdtree", 154.0, "MA-03"));

    const re4 = new Jogo("MA-04", "Resident Evil 4 Remake", 169.0, "Mundo Aberto");
    repoJogos.adicionar(re4);
    adicionarDLC(re4, new DLC("MA-04-D1", "DLC Separate Ways", 48.0, "MA-04"));

    // 📂 Categoria: FPS / Tiro (Prefixo: FPS)
    const valorant = new Jogo("FPS-01", "Valorant", 0.0, "FPS");
    repoJogos.adicionar(valorant);
    adicionarDLC(valorant, new DLC("FPS-01-D1", "Passe de Batalha: Colecao Saqueadora", 40.0, "FPS-01"));

    repoJogos.adicionar(new Jogo("FPS-02", "Counter-Strike 2", 0.0, "FPS"));
    repoJogos.adicionar(new Jogo("FPS-03", "Call of Duty: Black Ops 6", 339.0, "FPS"));
    repoJogos.adicionar(new Jogo("FPS-04", "Overwatch 2", 0.0, "FPS"));

    // 📂 Categoria: Esportes / Corrida (Prefixo: ESP)
    repoJogos.adicionar(new Jogo("ESP-01", "Rocket League", 0.0, "Esportes"));
    repoJogos.adicionar(new Jogo("ESP-02", "EA SPORTS FC 24", 150.0, "Esportes"));

    const forza = new Jogo("ESP-03", "Forza Horizon 5", 249.0, "Esportes");
    repoJogos.adicionar(forza);
    adicionarDLC(forza, new DLC("ESP-03-D1", "DLC Pacote de Expansao Hot Wheels", 79.0, "ESP-03"));

    repoJogos.adicionar(new Jogo("ESP-04", "F1 24", 359.0, "Esportes"));

    // 📂 Categoria: Estratégia (Prefixo: EST)
    const hoi4 = new Jogo("EST-01", "Hearts of Iron IV", 80.0, "Estrategia");
    repoJogos.adicionar(hoi4);
    adicionarDLC(hoi4, new DLC("EST-01-D1", "DLC Trial of Allegiance", 40.0, "EST-01"));

    repoJogos.adicionar(new Jogo("EST-02", "Football Manager", 199.0, "Estrategia"));
    repoJogos.adicionar(new Jogo("EST-03", "Age of Empires IV", 99.9, "Estrategia"));

    // 📂 Categoria: Simulador (Prefixo: SIM)
    repoJogos.adicionar(new Jogo("SIM-01", "Hand Simulator", 10.0, "Simulador"));

    const sims4 = new Jogo("SIM-02", "The Sims 4", 0.0, "Simulador");
    repoJogos.adicionar(sims4);
    adicionarDLC(sims4, new DLC("SIM-02-D1", "DLC Rumo a Fama", 159.0, "SIM-02"));
    // Bug corrigido: antes era instanciada como `new Jogo(...)` com gênero "SIM-02" inválido.
    adicionarDLC(sims4, new DLC("SIM-02-D2", "DLC Estações", 159.0, "SIM-02"));

    repoJogos.adicionar(new Jogo("SIM-03", "Minecraft", 149.0, "Simulador"));
}
