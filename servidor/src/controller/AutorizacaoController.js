const AutorizacaoModel = require("../model/AutorizacaoModel");

class AutorizacaoController {
  // Cria uma nova autorização
  async create(req, res) {
    const { alunoId, dataAutorizacao, qtdeLanches } = req.body;

    // Verifica se a quantidade de lanches não excede 3
    if (qtdeLanches > 3) {
      return res
        .status(400)
        .json({ message: "Quantidade máxima de lanches é 3." });
    }

    // Verifica se já existe uma autorização para o aluno na mesma data
    const existingAutorizacao = await AutorizacaoModel.findOne({
      alunoId,
      dataAutorizacao,
    });
    if (existingAutorizacao) {
      return res
        .status(400)
        .json({
          message: "Autorização já existe para esse aluno na data informada.",
        });
    }

    const autorizacao = new AutorizacaoModel(req.body);
    await autorizacao
      .save()
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  }

  // Obtém todas as autorizações
  async getAll(req, res) {
    await AutorizacaoModel.find()
      .populate("alunoId", "nome foto")
      .sort("dataAutorizacao")
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  }

  // Obtém autorizações por data específica
  async getByDate(req, res) {
    const { data } = req.params;
    await AutorizacaoModel.find({ dataAutorizacao: data })
      .populate("alunoId", "nome foto")
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  }

  // Atualiza uma autorização pelo ID
  async update(req, res) {
    const { id } = req.params;
    const { qtdeLanches } = req.body;

    if (qtdeLanches > 3) {
      return res
        .status(400)
        .json({ message: "Quantidade máxima de lanches é 3." });
    }

    await AutorizacaoModel.findByIdAndUpdate(id, req.body, { new: true })
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  }

  // Deleta uma autorização pelo ID
  async delete(req, res) {
    const { id } = req.params;
    await AutorizacaoModel.findByIdAndDelete(id)
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  }
}

module.exports = new AutorizacaoController();
