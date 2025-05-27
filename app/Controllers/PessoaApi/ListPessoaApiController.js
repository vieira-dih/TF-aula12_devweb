import PessoaModel from "../../Models/PessoaModel.js";
import TelefoneModel from "../../Models/TelefoneModel.js";

export default async (request, response) => {

    const HTTP_STATUS = CONSTANTS.HTTP;

    const ORDENACAO_PADRAO = ["id", "asc"];

    const ORDENCAO_CAMPOS_PERMITIDOS = ["id", "created_at", "updated_at"];

    const ORDENCAO_DIRECAO_PERMITIDOS = ["ASC", "DESC"];

    try {
        const {
          limit = 10,
          offset = 0,
          orderBy = ORDENACAO_PADRAO.join(",")
        } = request.query;
    
        // Validação do orderBy
        const [campo, direcao] = orderBy.split(",");
    
        const campoOrdenacao = ORDENCAO_CAMPOS_PERMITIDOS.includes(campo) ? campo : ORDENACAO_PADRAO[0];
        const direcaoOrdenacao = ORDENACAO_DIRECAO_PERMITIDOS.includes(direcao?.toUpperCase()) ? direcao.toUpperCase() : ORDENACAO_PADRAO[1].toUpperCase();
    
        const pessoas = await PessoaModel.findAll({
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [[campoOrdenacao, direcaoOrdenacao]],
          include: [
            {
              model: TelefoneModel,
              as: "telefones" 
            }
          ]
        });
    
        return response.status(HTTP_STATUS.OK).json(pessoas);
    
      } catch (error) {
        console.error("Erro ao listar pessoas:", error);
        return response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          error: "Erro interno ao buscar pessoas."
        });
      }
    };

  