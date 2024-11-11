const EntregaModel = require("../model/EntregaModel");
const AutorizacaoModel = require("../model/AutorizacaoModel");

class EntregaController {
  // Cria um novo registro de entrega
  async create(req, res) {
    const { alunoId, dataEntrega, qtdeLanches } = req.body;

    // Verifica se existe uma autorização para o aluno na mesma data
    const autorizacao = await AutorizacaoModel.findOne({
      alunoId,
      dataAutorizacao: dataEntrega,
    });
    if (!autorizacao) {
      return res
        .status(400)
        .json({ message: "Nenhuma autorização encontrada para essa data." });
    }

    // Verifica se já existe uma entrega para o aluno na mesma data
    const existingEntrega = await EntregaModel.findOne({
      alunoId,
      dataEntrega,
    });
    if (existingEntrega) {
      return res.status(400).json({
        message: "Entrega já registrada para esse aluno na data informada.",
      });
    }

    // Verifica se a quantidade de lanches entregues não excede a autorizada
    if (qtdeLanches > autorizacao.qtdeLanches) {
      return res
        .status(400)
        .json({ message: "Quantidade de lanches excede a autorização." });
    }

    const entrega = new EntregaModel(req.body);
    await entrega
      .save()
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  }

  // Obtém todas as entregas
  async getAll(req, res) {
    await EntregaModel.find()
      .populate("alunoId", "nome foto")
      .sort("dataEntrega")
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  }

  // Obtém entregas por data específica
  async getByDate(req, res) {
    const { data } = req.params;
    await EntregaModel.find({ dataEntrega: data })
      .populate("alunoId", "nome foto")
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  }
}

module.exports = new EntregaController();
