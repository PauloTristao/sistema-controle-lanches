const AlunoModel = require("../model/AlunoModel");

class AlunoController {
  async create(req, res) {
    const alunoData = req.body;

    const aluno = new AlunoModel(alunoData);
    await aluno
      .save()
      .then((response) => res.status(201).json(response))
      .catch((error) => res.status(500).json(error));
  }

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
      const alunos = await AlunoModel.find().select("ra nome _id").sort("ra");

      return res.status(200).json(alunos);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar alunos", error });
    }
  }

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
      .select("foto")
      .then((response) => {
        if (!response || !response.foto) {
          return res
            .status(404)
            .json({ message: "Aluno não encontrado ou sem foto." });
        }
        const fotoBase64 = response.foto.toString("base64");
        return res.status(200).json({
          type: "image/png",
          foto: fotoBase64,
        });
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }

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

  async update(req, res) {
    const { id } = req.params;

    await AlunoModel.findByIdAndUpdate(id, req.body, { new: true })
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  }

  async delete(req, res) {
    await AlunoModel.findOneAndDelete({ ra: req.params.id })
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
