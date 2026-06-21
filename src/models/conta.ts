import { ItemDigital } from "./ItemDigital.js";
import { DLC, itemFromDTO } from "./jogo.js";
import { RegistroCompra, PoliticaReembolso } from "../services/PoliticaReembolso.js";
import { Promocao } from "../services/promocao.js";
import { PlanoAssinatura, PlanoBasico, planoPorNome } from "./planos/index.js";
import { ContaDTO } from "./dtos.js";

// esse arquivo representa a conta do usuario. Guarda saldo, biblioteca e histórico de transações e tem as regras de negócio para comprar e reembolsar itens


export class Conta {
    private biblioteca: RegistroCompra[] = []; // encapsulamento: a biblioteca é um array de registros de compra, não exposto diretamente
    private historicoTransacoes: string[] = [];

    constructor(
        private readonly id: string,
        private nomeUsuario: string,
        private email: string,
        private saldoCarteira: number,

        private plano: PlanoAssinatura = new PlanoBasico() // parâmetro com valor padrão
    ) {

        if (!id || id.trim().length === 0) {
            throw new Error("Conta inválida: o ID não pode ser vazio.");
        }
        if (!nomeUsuario || nomeUsuario.trim().length < 2) {
            throw new Error("Conta inválida: o nome deve ter ao menos 2 caracteres.");
        }
        if (!email || !email.includes("@")) {
            throw new Error("Conta inválida: e-mail deve conter '@'.");
        }
        if (!Number.isFinite(saldoCarteira) || saldoCarteira < 0) {
            throw new Error("Conta inválida: o saldo da carteira não pode ser negativo.");
        }
    }

    public getID(): string {
        return this.id;
    }

    public getNomeUsuario(): string {
        return this.nomeUsuario;
    }

    public getNomePlano(): string {
        return this.plano.nome();
    }



    // quando comrpa nao pode duplicado, dlc precisa do jogo, precisa ter saldo e credita o cashback
    // tambem registra a transacao, guarda o preco pago e o cashback e retorna o cashback creditado
    public comprarItens(item: ItemDigital, promocao?: Promocao): number {
        const jaPossui = this.biblioteca.some((c) => c.item.getID() === item.getID());
        if (jaPossui) {
            throw new Error("Você já possui este item na sua biblioteca.");
        }

        if (item instanceof DLC) { // Regra de negócio: para comprar uma DLC, o usuário precisa ter o jogo-base na biblioteca.
            const possuiJogoBase = this.biblioteca.some((c) => c.item.getID() === item.getIdJogoPrincipal());
            if (!possuiJogoBase) {
                throw new Error(
                    `Para comprar esta DLC você precisa possuir o jogo-base (ID ${item.getIdJogoPrincipal()}).`
                );
            }
        }

        const precoCobrado = item.getPrecoFinal(promocao);  // o preço final do item pode variar conforme promoções (polimorfismo: o item calcula seu próprio preço final com base no preço base e na promoção)

        if (this.saldoCarteira < precoCobrado) {
            throw new Error("Saldo insuficiente na carteira.");
        }

        // polimorfismo: o cashback varia conforme o plano
        const cashback = precoCobrado * (this.plano.percentualCashback() / 100);

        this.saldoCarteira = this.saldoCarteira - precoCobrado + cashback;

        this.historicoTransacoes.push( // registra a transação no histórico, incluindo o cashback se houver
            `Comprou ${item.getTitulo()} por R$${precoCobrado.toFixed(2)} em ${new Date().toLocaleDateString("pt-BR")}` +
                (cashback > 0 ? ` (cashback ${this.plano.nome()}: +R$${cashback.toFixed(2)})` : "")
        );

        this.biblioteca.push({
            item: item,
            dataCompra: new Date(),
            precoPago: precoCobrado,
            cashbackCreditado: cashback,
        });

        return cashback;
    }

    /**
     * Reembolsa um item da biblioteca respeitando a janela de prazo do plano
     * (Básico 7d, Plus 14d, Premium 21d). O estorno é exatamente o valor pago
     * (precoPago) e o cashback recebido é revertido — assim o saldo volta ao
     * estado anterior à compra, sem lucro indevido em promoções nem em cashback.
     */
    // reembolsa. verifica se tem ele, o plano, pra saber quantos dias pode devolver e o cashback é revertido
    public reembolsarItem(idItem: string): void {
        const indexCompra = this.biblioteca.findIndex((c) => c.item.getID() === idItem);
        if (indexCompra === -1) {
            throw new Error("Este item não foi encontrado na sua biblioteca.");
        }

        const compra = this.biblioteca[indexCompra];

        // regra de negócio: a janela de reembolso depende do plano (polimorfismo).
        PoliticaReembolso.validarElegibilidade(compra, this.plano.diasReembolso());

        const cashbackRevertido = compra.cashbackCreditado ?? 0;
        const valorEstorno = compra.precoPago - cashbackRevertido;
        this.saldoCarteira += valorEstorno;

        this.biblioteca.splice(indexCompra, 1);

        this.historicoTransacoes.push( // registra a transação de reembolso no histórico, incluindo o valor estornado e a data
            `Reembolsou ${compra.item.getTitulo()} (+R$${valorEstorno.toFixed(2)}) em ${new Date().toLocaleDateString("pt-BR")}`
        );
    }

    public adicionarSaldo(valor: number): void {
        if (valor <= 0) {
            throw new Error("O valor do depósito deve ser maior que zero.");
        }
        this.saldoCarteira += valor;
    }

    // para exibir a biblioteca pro usuario, nao expõe os registros de compra, mas sim os itens digitais (jogos/dlcs) em si
    public getBiblioteca(): ItemDigital[] {
        return this.biblioteca.map((c) => c.item);
    }

    public getSaldo(): number {
        return this.saldoCarteira;
    }

    public getHistorico(): string[] {
        return [...this.historicoTransacoes];
    }

    // para exibir o total gasto pelo usuário, soma o preço pago de todas as compras na biblioteca
    public getTotalGasto(): number {
        return this.biblioteca.reduce((total, c) => total + c.precoPago, 0);
    }

    // converte a conta para um DTO
    public toDTO(): ContaDTO {
        return {
            id: this.id,
            nomeUsuario: this.nomeUsuario,
            email: this.email,
            saldoCarteira: this.saldoCarteira,
            plano: this.plano.nome(),
            biblioteca: this.biblioteca.map((c) => ({
                item: c.item.toDTO(),
                dataCompra: c.dataCompra.toISOString(),
                precoPago: c.precoPago,
                cashbackCreditado: c.cashbackCreditado ?? 0,
            })),
            historicoTransacoes: [...this.historicoTransacoes],
        };
    }


    // reconstroi conta a partir de um DTO
    public static fromDTO(dto: ContaDTO): Conta { // por ser metodo da propria classe, pode preencher campos privados
        const conta = new Conta(
            dto.id,
            dto.nomeUsuario,
            dto.email,
            dto.saldoCarteira,
            planoPorNome(dto.plano)
        );

        conta.biblioteca = (dto.biblioteca ?? []).map((registro) => {
            const item = itemFromDTO(registro.item);
            return {
                item,
                dataCompra: new Date(registro.dataCompra),
                // Compatibilidade com dados legados sem precoPago.
                precoPago: registro.precoPago ?? item.calcularPrecoFinal(),
                cashbackCreditado: registro.cashbackCreditado ?? 0,
            };
        });

        conta.historicoTransacoes = [...(dto.historicoTransacoes ?? [])];

        return conta;
    }
}
