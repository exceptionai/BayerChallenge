import { CurriculoService } from '../services/CurriculoService.js';
import { CurriculoView } from '../views/CurriculoView.js';
import { HttpService } from '../services/HttpService.js';
import { ValidacaoFormularioController } from '../controllers/ValidacaoFormularioController.js';
import { NotificacaoService } from '../services/NotificacaoService.js';
import { FormHelper } from '../services/FormHelper.js';
import { IdiomasView } from '../views/IdiomasView.js';
import { ExperienciasAnterioresView } from '../views/ExperienciasAnterioresView.js';
import { CursosComplementaresView } from '../views/CursosComplementaresView.js';
import { FormacoesAcademicasView } from '../views/FormacoesAcademicasView.js';

export class CurriculoController {
    constructor(vaga, cidadeID, estadoID, dispostoMudarEstadoID, formularioID) {
        this._vaga = vaga;
        this._cidadeID = cidadeID;
        this._estadoID = estadoID;
        this._dispostoMudarEstadoID = dispostoMudarEstadoID;
        this._estados = [];
        this._contadorIdiomas = 0;
        this._contadorExperiencias = 0;
        this._form = document.querySelector(formularioID);
        this._service = new CurriculoService();
        this._control_endereco();
    }

    _control_endereco() {
        const self = this;
        document.addEventListener('DOMContentLoaded', async() => {
            const curriculoService = new CurriculoService();
            $(this._estadoID).removeAttr('disabled');
            this._estados = await curriculoService.loadEstados('#uf');
            this.atualizaEstados(this._estadoID);

            $(document).on('change', '#uf', async function(e) {
                self._valida_estado(this.value);
                self.atualizaCidades(self._cidadeID, $(self._estadoID).val());

            });

        });
    }

    atualizaEstados(element) {

        let label = $(element).data('label');
        label = label ? label : 'Estado';

        let options = '<option value="">' + label + '</option>';
        for (let i in this._estados) {
            let estado = this._estados[i];
            options += '<option value="' + estado.sigla + '">' + estado.nome + '</option>';
        }

        $(element).html(options);
    }

    atualizaCidades(element, estado_sigla) {
        let label = $(element).data('label');
        label = label ? label : 'Cidade';

        let options = '<option value="">' + label + '</option>';
        for (let estado of this._estados) {
            if (estado.sigla !== estado_sigla)
                continue;
            for (let cidade of estado.cidades) {
                options += '<option value="' + cidade + '">' + cidade + '</option>';
            }
        }
        $(element).html(options);
    }

    geraIdiomasDinamicamente(idioma_ID, botao_idiomas_ID) {
        const view = new IdiomasView();
        this._gerarCampoDinamicamente(
            idioma_ID, botao_idiomas_ID,
            view.template.bind(view),
            "campoIdiomaAdicional"
        )
    }

    geraExperienciasDinamicamente(experiencia_ID, botao_experiencia_ID) {
        const view = new ExperienciasAnterioresView();
        this._gerarCampoDinamicamente(
            experiencia_ID, botao_experiencia_ID,
            view.template.bind(view),
            "experienciaAnterior"
        )
    }

    geraCursosDinamicamente(cursosID, botaoCursosID) {
        const view = new CursosComplementaresView();
        this._gerarCampoDinamicamente(
            cursosID, botaoCursosID,
            view.template.bind(view),
            "cursosComplementares"
        )
    }

    geraFormacaoDinamicamente(experienciasID, botaoExperienciasID) {
        const view = new FormacoesAcademicasView();
        this._gerarCampoDinamicamente(
            experienciasID, botaoExperienciasID,
            view.template.bind(view),
            "formacao"
        )
    }

    _gerarCampoDinamicamente(camposID, botaoID, view, campoAdicionalID) {
        const curriculoView = new CurriculoView()
        const botao = curriculoView.botao(botaoID);
        const campo = curriculoView.campo(camposID);

        botao.click(() => {
            const campoID = curriculoView.adicionarCampo(campo, view());
            const linkRemover = curriculoView.botaoRemover(campoAdicionalID, campoID);

            linkRemover.click(event => {
                event.preventDefault();
                curriculoView.removerCampo(campoAdicionalID, campoID)
            });
            ValidacaoFormularioController.adicionaValidacao(campoAdicionalID + campoID);
        })
    }

    _valida_estado(estado) {
        if (estado !== this._vaga.estado) {
            $(this._dispostoMudarEstadoID).show();
        } else {
            $(this._dispostoMudarEstadoID).hide();
        }

    }

    esconderHeader() {
        $(window).bind('scroll', function() {
            const distance = 80;
            if ($(window).scrollTop() > distance) {
                $('.header-logo').fadeIn(300);

            } else {
                $('.header-logo').fadeOut(300);
            }
        });
    }

    enviarCurriculo() {
        if (ValidacaoFormularioController.valida(this._form)) {
            let curriculoObj = FormHelper.paraObjeto(this._form);
            let curriculoJSON = JSON.stringify(curriculoObj);
            this._service.enviar("http://localhost:5500/inserir/curriculo", curriculoJSON)
                .then(resposta => {
                    NotificacaoService.sucesso(resposta, 'Sucesso')
                })
                .catch(erro => {
                    NotificacaoService.invalido(erro, 'Erro ao Enviar')
                })
        }

    }
}