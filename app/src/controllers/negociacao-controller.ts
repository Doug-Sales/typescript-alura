import { Negociacao } from "../models/negociacao.js";
import { Negociacoes } from "../models/negociacoes.js";
import { MensagemView } from "../views/mensagem-view.js";
import { NegociacoesView } from "../views/negociacoes-view.js";
import { DiaDaSemana } from "../enums/dia-da-semana.js";
import { logarTempoDeExecucao } from "../decorator/logar-tempo-de-execucao.js";
import { inspect } from "../decorator/inspect.js";
import { domInjector } from "../decorator/dom-injector.js";
import { NegociacoesService } from "../services/negociacoes-service.js";
import { imprimir } from "../utils/imprimir.js";


export class NegociacaoController {
    @domInjector('#data')
    private inputData: HTMLInputElement;
    @domInjector('#quantidade')
    private inputQuantidade: HTMLInputElement;
    @domInjector('#valor')
    private inputValor: HTMLInputElement;
    private negociacoes = new Negociacoes();
    private negociacoesView = new NegociacoesView('#negociacoesView');
    private mensagemView = new MensagemView('#mensagemView');
    private negociacoesService = new NegociacoesService();

    constructor() {
        this.negociacoesView.update(this.negociacoes);
    }

    @inspect
    @logarTempoDeExecucao()
    public adiciona(): void {
        const negociacao = Negociacao.criaDe(
            this.inputData.value,
            this.inputQuantidade.value,
            this.inputValor.value
        );

        if (!this.eDiaUtil(negociacao.data)) {
            this.mensagemView
                .update('Apenas negociações em dias uteis são aceitas');
            return;
        }

        this.negociacoes.adiciona(negociacao);

        imprimir(negociacao, this.negociacoes);

        this.limparFormulario();
        this.atualizaView();
    }

    public importaDados(): void {
        this.negociacoesService
            .obterNegociacoesDoDia()
            .then(negociacoesDeHoje => {
                return negociacoesDeHoje.filter(negociacaoDeHoje => {
                    return !this.negociacoes
                        .lista()
                        .some(negociacao => negociacao
                            .ehIgual(negociacaoDeHoje)
                        );
                });
            })
            .then(negociacaoDeHoje => {
                for (let negociacao of negociacaoDeHoje) {
                    this.negociacoes.adiciona(negociacao)
                }
                this.negociacoesView.update(this.negociacoes)
            });
    }

    private eDiaUtil(data: Date): boolean {
        return data.getDay() > DiaDaSemana.DOMINGO && data.getDay() < DiaDaSemana.SABADO;
    }

    private limparFormulario(): void {
        this.inputData.value = '';
        this.inputQuantidade.value = '';
        this.inputValor.value = '';
        this.inputData.focus();
    }

    private atualizaView(): void {
        this.negociacoesView.update(this.negociacoes);
        this.mensagemView.update('Negociação adicionada com sucesso');
    }

}