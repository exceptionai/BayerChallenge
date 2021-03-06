import { DesbloqueavelView } from '../views/DesbloqueavelView.js';
import { DesbloqueavelService } from '../services/DesbloqueavelService.js';
import { Desbloqueavel } from '../models/Desbloqueavel.js';
import { NotificacaoService } from '../../curriculo/services/NotificacaoService.js';

export class DesbloqueavelController {

    constructor(userService) {
        this.service = new DesbloqueavelService();
        this.userService = userService;
        this.desbloqueaveis = [];
        this._init();
    }

    async _init() {
        const usuario = await this.userService.obterUsuario()
        this.view = new DesbloqueavelView("#desloqueavelContainer", usuario);
        this.gerarDesbloqueaveis();

    }

    async obterDesbloqueaveis() {
        const desbloqueaveisService = await this.service.buscarDesbloqueaveis();
        this.desbloqueaveis = Desbloqueavel.generate(desbloqueaveisService);
        return this.desbloqueaveis;
    }

    async gerarDesbloqueaveis() {
        const desbloqueaveis = await this.obterDesbloqueaveis();
        this.view.renderAll(desbloqueaveis, this.desbloquear.bind(this));
    }

    async desbloquear(desbloqueavel) {
        const desbloqueavelAnterior = this.desbloqueaveis.find(desbloqueavelLista =>
            desbloqueavelLista.selecionado
        )
        if (desbloqueavelAnterior) {
            desbloqueavelAnterior.selecionado = false;
        }
        if (!desbloqueavel.obtido) {
            this.userService.diminuirPontos(desbloqueavel.pontos_minimos);
        }

        if (!desbloqueavel.obtido) {
            await this.service.obterDesbloqueavel(desbloqueavel.id);
            NotificacaoService.sucesso("Desbloqueavel obtido com sucesso");
        }

        this.userService.updateTema(desbloqueavel.id).then(() => {
            this.userService.getTema().then(tema =>
                this.userService.setTema(tema))
        })
        window.atualizarTema();
        desbloqueavel.selecionado = true;
        desbloqueavel.obtido = true;
        desbloqueavel.pontos_minimos = 0;

        this.view.renderAll(this.desbloqueaveis, this.desbloquear.bind(this));
    }


}