import * as readline from 'readline-sync';
import { Jogo, DLC } from '../models/jogo.js';
import { ItemDigital } from '../models/ItemDigital.js';
import { RepositorioEmMemoria } from '../repo/RepositorioEmMemoria.js';
import { Promocao } from '../services/promocao.js'; // Ajustado o caminho para buscar de models se necessário

export class LojaView {
    
    public static exibirLojaPorTopicos(
        repoJogos: RepositorioEmMemoria<ItemDigital>,
        promocaoAtiva?: Promocao
    ): void {
        const itens = repoJogos.listarTodos();
        const generos = ['Mundo Aberto', 'FPS', 'Esportes', 'Estrategia', 'Simulador'];

        generos.forEach((genero) => {
            const itensFiltrados = itens.filter(
                (item) => item instanceof Jogo && item.getGenero() === genero,
            );

            if (itensFiltrados.length > 0) {
                console.log(`\n📂 Categoria: ${genero.toUpperCase()}`);
                console.log('---------------------------------------');

                itensFiltrados.forEach((item) => {
                    const precoOriginal = item.calcularPrecoFinal();
                    const precoFinal = item.getPrecoFinal(promocaoAtiva);

                    if (precoFinal < precoOriginal) {
                        console.log(`  [ID: ${item.getID()}] ${item.getTitulo()} - 💥 DE: R$ ${precoOriginal.toFixed(2)} POR: R$ ${precoFinal.toFixed(2)}`);
                    } else {
                        console.log(`  [ID: ${item.getID()}] ${item.getTitulo()} - R$ ${precoOriginal.toFixed(2)}`);
                    }

                    // Exibe as DLCs vinculadas
                    const dlcsDoJogo = itens.filter(
                        (d: ItemDigital) => d instanceof DLC && d.getIdJogoPrincipal() === item.getID()
                    );

                    dlcsDoJogo.forEach((dlc: ItemDigital) => {
                        const precoDlcOriginal = dlc.calcularPrecoFinal();
                        const precoDlcFinal = dlc.getPrecoFinal(promocaoAtiva);

                        if (precoDlcFinal < precoDlcOriginal) {
                            console.log(`    ┗━► [ID: ${dlc.getID()}] DLC: ${dlc.getTitulo()} - 💥 DE: R$ ${precoDlcOriginal.toFixed(2)} POR: R$ ${precoDlcFinal.toFixed(2)}`);
                        } else {
                            console.log(`    ┗━► [ID: ${dlc.getID()}] DLC: ${dlc.getTitulo()} - R$ ${precoDlcOriginal.toFixed(2)}`);
                        }
                    });
                });
                console.log("=======================================");
            }
        });
    }

    // Isola toda a renderização do submenu de compras
    public static renderizarSubmenuCategorias(
        repoJogos: RepositorioEmMemoria<ItemDigital>,
    ): string {
        console.log('Selecione a categoria que deseja navegar:');
        console.log('1. Mundo Aberto');
        console.log('2. FPS');
        console.log('3. Esportes');
        console.log('4. Estratégia');
        console.log('5. Simulador');
        console.log('6. Voltar ao menu principal');

        const escolha = readline.question('\nEscolha uma categoria: ');

        switch (escolha) {
            case '1': return 'Mundo Aberto';
            case '2': return 'FPS';
            case '3': return 'Esportes';
            case '4': return 'Estrategia';
            case '5': return 'Simulador';
            default: return '';
        }
    }

    public static exibirJogosDaCategoria(
        itens: ItemDigital[],
        genero: string,
        promocaoAtiva?: Promocao
    ): void {
        const itensFiltrados = itens.filter(
            (item) => item instanceof Jogo && item.getGenero() === genero,
        );

        console.log(`\n Categoria: ${genero.toUpperCase()}`);
        console.log('---------------------------------------');

        itensFiltrados.forEach((item) => {
            const precoOriginal = item.calcularPrecoFinal();
            const precoFinal = item.getPrecoFinal(promocaoAtiva);

            if (precoFinal < precoOriginal) {
                console.log(`  [ID: ${item.getID()}] ${item.getTitulo()} - DE: R$ ${precoOriginal.toFixed(2)} POR: R$ ${precoFinal.toFixed(2)}`);
            } else {
                console.log(`  [ID: ${item.getID()}] ${item.getTitulo()} - R$ ${precoOriginal.toFixed(2)}`);
            }

            const dlcsDoJogo = itens.filter(
                (d) => d instanceof DLC && d.getIdJogoPrincipal() === item.getID(),
            );

            dlcsDoJogo.forEach((dlc) => {
                const precoDlcOriginal = dlc.calcularPrecoFinal();
                const precoDlcFinal = dlc.getPrecoFinal(promocaoAtiva);

                if (precoDlcFinal < precoDlcOriginal) {
                    console.log(`    ┗━► [ID: ${dlc.getID()}] DLC: ${dlc.getTitulo()} - 💥 DE: R$ ${precoDlcOriginal.toFixed(2)} POR: R$ ${precoDlcFinal.toFixed(2)}`);
                } else {
                    console.log(`    ┗━► [ID: ${dlc.getID()}] DLC: ${dlc.getTitulo()} - R$ ${precoDlcOriginal.toFixed(2)}`);
                }
            });
        });
        console.log('=======================================\n');
    }
}