const AutorizacaoModel = require("../model/AutorizacaoModel");

class AutorizacaoController {
  // Cria uma nova autorização
  async create(req, res) {
    const { ra, dataLiberacao, qtdeLanches } = req.body;
    // Verifica se a quantidade de lanches não excede 3
    if (qtdeLanches > 3) {
      return res
        .status(400)
        .json({ message: "Quantidade máxima de lanches é 3." });
    }

    // Verifica se já existe uma autorização para o aluno na mesma data
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

  // Obtém todas as autorizações
  async getAll(req, res) {
    await AutorizacaoModel.find()
      .populate("ra", "nome foto")
      .sort("dataLiberacao")
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  }

  // Obtém autorizações por data específica
  async getByDate(req, res) {
    const { data } = req.params;

    try {
      // Cria o início e fim do dia em UTC
      const inicioDia = new Date(`${data}T00:00:00.000Z`);
      const fimDia = new Date(`${data}T23:59:59.999Z`);

      const autorizacoes = await AutorizacaoModel.find({
        dataLiberacao: { $gte: inicioDia, $lte: fimDia }, // Filtra pelo intervalo de datas em UTC
      });
      console.log(autorizacoes);

      res.status(200).json(autorizacoes);
    } catch (error) {
      console.error("Erro ao buscar autorizações:", error);
      res.status(500).json({ message: "Erro ao buscar autorizações", error });
    }
  }

  // Atualiza uma autorização pelo ID
  async update(req, res) {
    const { id } = req.params;

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

  async marcarComoEntregue(req, res) {
    const { id } = req.params;
    const { dataEntrega } = req.body; // Espera que a data de entrega seja enviada
    console.log(dataEntrega, id);
    try {
      const autorizacao = await AutorizacaoModel.findById(id);
      if (!autorizacao) {
        return res.status(404).json({ message: "Autorização não encontrada." });
      }

      // Atualiza a data de entrega no documento
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
