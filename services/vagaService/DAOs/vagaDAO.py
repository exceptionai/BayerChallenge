from connections.connectionFactory import ConnectionFactory

class VagaDAO:

    def __init__(self,candidato_id = None):
        self.candidato_id = candidato_id

    def buscar_detalhes_vaga(self,vaga_id):
        query = f"select cargo, area_atuacao, requisitos_desejaveis, requisitos_obrigatorios, principais_atividades, salario, beneficios, created_at, vaga_id  FROM vaga WHERE vaga_id = {vaga_id}"
        ConnectionFactory.execute(query)
        vaga = ConnectionFactory.fetchone()
        return vaga

    def buscar_vaga_selecionada(self, vaga_id):
        query = f"select 1 from candidato_vaga where vaga_id = {vaga_id} and candidato_id ={self.candidato_id}"
        ConnectionFactory.execute(query)
        vaga = ConnectionFactory.fetchone()
        return vaga

    def buscar_resumo_vagas(self):
        query = f"SELECT v.cargo, v.area_atuacao, e.cidade, v.created_at,v.vaga_id,(SELECT cv.candidato_id FROM candidato_vaga cv WHERE v.vaga_id = cv.vaga_id AND cv.candidato_id = {self.candidato_id}) FROM vaga v INNER JOIN endereco e on e.endereco_id = v.endereco_id"
        ConnectionFactory.execute(query)
        vagas = ConnectionFactory.fetchall()
        return vagas
    
    def buscar_vagas_recrutador(self):
        query = "SELECT v.cargo, COUNT(cv.candidato_id),(SELECT COUNT(cv2.candidato_id) from candidato_vaga cv2 WHERE cv2.vaga_id = v.vaga_id AND cv2.pontuacao_alcancada > v.pontuacao_minima ), f.descricao, v.created_at, v.vaga_id FROM vaga v LEFT JOIN candidato_vaga cv ON cv.vaga_id = v.vaga_id LEFT JOIN fase f ON f.fase_id = v.fase_id group by v.vaga_id"
        ConnectionFactory.execute(query)
        vagas = ConnectionFactory.fetchall()
        return vagas

    def cadastrar(self,obj_vaga, endereco_id):
        query = f'INSERT INTO vaga (`cargo`,`area_atuacao`,`requisitos_desejaveis`,`requisitos_obrigatorios`,`principais_atividades`,`salario`,`beneficios`,`endereco_id`  ) VALUES ("{obj_vaga["cargo"]}","{obj_vaga["area_atuacao"]}","{obj_vaga["requisitos_desejaveis"]}","{obj_vaga["requisitos_obrigatorios"]}","{obj_vaga["principais_atividades"]}",{int(obj_vaga["salario"])},"{obj_vaga["beneficios"]}",{endereco_id})'
        ConnectionFactory.execute(query)
        return ConnectionFactory.get_cursor().lastrowid
    
    def quantidade(self):
        query = "SELECT COUNT(vaga_id),count(2) FROM vaga"
        ConnectionFactory.execute(query)
        quantidade = ConnectionFactory.fetchone()
        return quantidade
