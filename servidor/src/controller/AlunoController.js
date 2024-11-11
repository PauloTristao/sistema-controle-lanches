const AlunoModel = require("../model/AlunoModel");

class AlunoController {
  // Cria um novo aluno
  async create(req, res) {
    const alunoData = req.body;

    const aluno = new AlunoModel(alunoData);
    await aluno
      .save()
      .then((response) => res.status(201).json(response))
      .catch((error) => res.status(500).json(error));
  }
  // Obtém todos os alunos, ordenados por RA
  async getAll(req, res) {
    await AlunoModel.find()
      .sort("ra")
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }

  async getAllRaAndName(req, res) {
    try {
      const alunos = await AlunoModel.find().select("ra nome").sort("ra");
      return res.status(200).json(alunos);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar alunos", error });
    }
  }

  // Obtém um aluno específico por RA
  async get(req, res) {
    await AlunoModel.findOne({ ra: req.params.ra })
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }

  async getFoto(req, res) {
    await AlunoModel.findOne({ ra: req.params.ra })
      .select("foto") // Retorna apenas o campo 'foto'
      .then((response) => {
        if (!response || !response.foto) {
          return res
            .status(404)
            .json({ message: "Aluno não encontrado ou sem foto." });
        }
        const fotoBase64 = response.foto.toString("base64"); // Converte para base64
        return res.status(200).json({
          type: "image/png", // Tipo MIME da imagem
          foto: fotoBase64, // Retorna a imagem em base64
        });
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }

  // Gera o próximo RA disponível para um novo aluno
  async getNextRa(req, res) {
    let resposta = await AlunoModel.findOne()
      .select("ra")
      .sort({ ra: "descending" })
      .limit(1);
    let ra = 1;
    if (resposta != null) {
      ra = Number.parseInt(resposta.ra) + 1;
    }
    return res.status(200).json(ra);
  }

  // Atualiza os dados de um aluno pelo RA
  async update(req, res) {
    await AlunoModel.findOneAndUpdate(
      { ra: Number.parseInt(req.params.ra) },
      req.body,
      { new: true }
    )
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }

  // Deleta um aluno pelo RA
  async delete(req, res) {
    await AlunoModel.findOneAndDelete({ ra: req.params.ra })
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }

  async getNextId(req, res) {
    let resposta = await PessoaModel.findOne()
      .select("id")
      .sort({ id: "descending" })
      .limit(1);
    let id = 1;
    if (resposta != null) {
      id = Number.parseInt(resposta.id) + 1;
    }

    return res.status(200).json(id);
  }
}

module.exports = new AlunoController();
