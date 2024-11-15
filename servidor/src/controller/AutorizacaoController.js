const AutorizacaoModel = require("../model/AutorizacaoModel");

class AutorizacaoController {
  async create(req, res) {
    const { ra, dataLiberacao, qtdeLanches } = req.body;

    if (qtdeLanches > 3) {
      return res
        .status(400)
        .json({ message: "Quantidade máxima de lanches é 3." });
    }

    const existingAutorizacao = await AutorizacaoModel.findOne({
      ra,
      dataLiberacao,
    });
    if (existingAutorizacao) {
      return res.status(400).json({
        message: "Autorização já existe para esse aluno na data informada.",
      });
    }
    const autorizacao = new AutorizacaoModel(req.body);
    await autorizacao
      .save()
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  }

  async getAll(req, res) {
    await AutorizacaoModel.find()
      .populate("ra", "nome foto")
      .sort("dataLiberacao")
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  }

  async getByDate(req, res) {
    const { data } = req.params;

    try {
      const inicioDia = new Date(`${data}T00:00:00.000Z`);
      const fimDia = new Date(`${data}T23:59:59.999Z`);

      const autorizacoes = await AutorizacaoModel.find({
        dataLiberacao: { $gte: inicioDia, $lte: fimDia },
      });
      console.log(autorizacoes);

      res.status(200).json(autorizacoes);
    } catch (error) {
      console.error("Erro ao buscar autorizações:", error);
      res.status(500).json({ message: "Erro ao buscar autorizações", error });
    }
  }

  async update(req, res) {
    const { id } = req.params;

    await AutorizacaoModel.findByIdAndUpdate(id, req.body, { new: true })
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  }

  async delete(req, res) {
    const { id } = req.params;
    await AutorizacaoModel.findByIdAndDelete(id)
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  }

  async marcarComoEntregue(req, res) {
    const { id } = req.params;
    const { dataEntrega } = req.body;
    console.log(dataEntrega, id);
    try {
      const autorizacao = await AutorizacaoModel.findById(id);
      if (!autorizacao) {
        return res.status(404).json({ message: "Autorização não encontrada." });
      }

      autorizacao.dataEntrega = dataEntrega;

      await autorizacao.save();
      res
        .status(200)
        .json({ message: "Entrega marcada com sucesso!", autorizacao });
    } catch (error) {
      console.error("Erro ao marcar como entregue:", error);
      res.status(500).json({ message: "Erro ao marcar entrega", error });
    }
  }
}

module.exports = new AutorizacaoController();
