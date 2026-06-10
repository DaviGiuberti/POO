import * as readline from 'readline-sync';
import { Jogo, DLC } from '../models/jogo.js';
import { ItemDigital } from '../models/ItemDigital.js';
import { RepositorioEmMemoria } from '../repo/RepositorioEmMemoria.js';

export class LojaView {
  // Transforma a listagem por tópicos em um método isolado
  public static exibirLojaPorTopicos(
    repoJogos: RepositorioEmMemoria<ItemDigital>,
  ): void {
    const itens = repoJogos.listarTodos();
    const generos = [
      'Mundo Aberto',
      'FPS',
      'Esportes',
      'Estrategia',
      'Simulador',
    ];

    generos.forEach((genero) => {
      const itensFiltrados = itens.filter(
        (item) => item instanceof Jogo && item.getGenero() === genero,
      );

      if (itensFiltrados.length > 0) {
        console.log(`\n📂 Categoria: ${genero.toUpperCase()}`);
        console.log('---------------------------------------');

        itensFiltrados.forEach((item) => {
          console.log(
            `  [ID: ${item.getID()}] ${item.getTitulo()} - R$ ${item.calcularPrecoFinal().toFixed(2)}`,
          );

          const dlcsDoJogo = itens.filter(
            (d) => d instanceof DLC && d.getIdJogoPrincipal() === item.getID(),
          );
          dlcsDoJogo.forEach((dlc) => {
            console.log(
              `    ┗━► [ID: ${dlc.getID()}] DLC: ${dlc.getTitulo()} - R$ ${dlc.calcularPrecoFinal().toFixed(2)}`,
            );
          });
        });
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
      case '1':
        return 'Mundo Aberto';
      case '2':
        return 'FPS';
      case '3':
        return 'Esportes';
      case '4':
        return 'Estrategia';
      case '5':
        return 'Simulador';
      default:
        return ''; // Retorna vazio caso queira voltar ou digite errado
    }
  }

  // Desenha apenas os itens de uma única categoria escolhida
  public static exibirJogosDaCategoria(
    itens: ItemDigital[],
    genero: string,
  ): void {
    const itensFiltrados = itens.filter(
      (item) => item instanceof Jogo && item.getGenero() === genero,
    );

    console.log(`\n Categoria: ${genero.toUpperCase()}`);
    console.log('---------------------------------------');

    itensFiltrados.forEach((item) => {
      console.log(
        `  [ID: ${item.getID()}] ${item.getTitulo()} - R$ ${item.calcularPrecoFinal().toFixed(2)}`,
      );

      const dlcsDoJogo = itens.filter(
        (d) => d instanceof DLC && d.getIdJogoPrincipal() === item.getID(),
      );
      dlcsDoJogo.forEach((dlc) => {
        console.log(
          `    ┗━► [ID: ${dlc.getID()}] DLC: ${dlc.getTitulo()} - R$ ${dlc.calcularPrecoFinal().toFixed(2)}`,
        );
      });
    });
    console.log('=======================================\n');
  }
}
