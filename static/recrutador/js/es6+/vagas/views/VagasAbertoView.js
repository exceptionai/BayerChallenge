import { Formater } from "../../../../../candidato/js/es6+/shared/utils/Formater.js";
import { NotificacaoService } from "../../../../../candidato/js/es6+/curriculo/services/NotificacaoService.js";

export class VagasAbertoView {
    constructor(seletorContainer) {
        this._container = $(seletorContainer);
        this._init();
    }

    _init() {
        const tituloMensagem = localStorage.getItem("tituloMensagem");
        const mensagem = localStorage.getItem("mensagem");
        if (mensagem && tituloMensagem) {
            NotificacaoService.sucesso(mensagem, tituloMensagem);
            localStorage.removeItem("mensagem");
            localStorage.removeItem("tituloMensagem");
        }

    }

    _template(vaga, descricaoBotao) {
        const dataAbertura = Formater.stringData(vaga.abertura);
        return `
            <div class="card" style="width: 19rem;">
                <div class="card-body">
                    <h4 class="card-title pl-2 pb-2 border-bottom border-alternate">${vaga.cargo}</h4>
                    <div class="card-text d-flex flex-column mt-3 ">
                        <div id="candidatos">
                            <i class="fas fa-user col-1"></i>
                            <span class="text-secondary "> Candidatos: <span class="text-bold">${vaga.candidatos}</span> </span>
                        </div>
                        <div id="candidatos">
                            <i class="fas fa-user-check col-1"></i>
                            <span class="text-secondary">Candidatos Potênciais: <span class="text-bold">${vaga.candidatosPotenciais}</span> </span>
                        </div>
                        <div id="candidatos">
                            <i class="fas fa-list col-1"></i>
                            <span class="text-secondary"> Fase: ${vaga.fase}</span>
                        </div>

                        <div id="dataAbertura">
                            <i class="far fa-calendar-alt col-1"></i>
                            <span class="text-secondary">Abertura: ${dataAbertura}</span>
                        </div>

                    </div>
                    <div class="d-flex justify-content-center mt-3 border-top">
                        <a class="btn btn-primary mt-3" href="/recrutador/vagasAberto/${vaga.id}">${descricaoBotao}</a>

                    </div>
                </div>
            </div>
        `;
    }

    render(vaga) {
        const template = this._template(vaga)
        this._container.append(template);
    }

    renderAll(vagas, descricaoBotao = "Detalhes da Vaga") {
        const vagasContainer = $("<div id='containerCardsVagas' class='d-flex flex-wrap flex-row '></div>");
        for (let vaga of vagas) {
            const template = this._template(vaga, descricaoBotao);
            vagasContainer.append(template);
        }
        if (!vagas.length) vagasContainer.html("<h2 class='font-white'>Não há novas vagas cadastradas</h2>");
        this._container.append(vagasContainer);
    }
}