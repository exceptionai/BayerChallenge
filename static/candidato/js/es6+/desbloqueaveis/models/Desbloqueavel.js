export class Desbloqueavel {

    constructor(descricao, imagem, pontos_minimos, obtido, tipo, tema) {
        this.descricao = descricao;
        this.imagem = imagem;
        this.pontos_minimos = pontos_minimos;
        this.obtido = obtido;
        this.tipo = tipo;
        this.tema = tema;
    }

    static generate(desbloqueaveisObj) {
        return desbloqueaveisObj.map(({ descricao, imagem, pontos_minimos, obtido, tipo, tema }) =>
            new Desbloqueavel(descricao, imagem, pontos_minimos, obtido, tipo, tema)
        )
    }
}