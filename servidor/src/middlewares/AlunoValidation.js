const AlunoModel = require("../model/AlunoModel");

async function AlunoValidation(req, res, next) {
  const { ra, nome, foto } = req.body;
  // Validação do RA
  if (!ra || ra.length < 3) {
    return res
      .status(400)
      .json({ erro: "Informe um RA válido com ao menos 3 caracteres" });
  }

  // Validação do Nome
  if (!nome || nome.length < 2) {
    return res
      .status(400)
      .json({ erro: "Informe o nome com ao menos 2 caracteres" });
  }

  // Validação da Foto (esperando que venha de `req.file`)
  if (!foto) {
    return res.status(400).json({ erro: "Informe a foto do aluno" });
  }

  // Checando se é uma atualização ou um novo cadastro
  const alteracaoRegistro = req.params.id != null;

  if (alteracaoRegistro) {
    const alunoExistente = await AlunoModel.findOne({ _id: req.params.id });
    if (!alunoExistente) {
      return res.status(400).json({ erro: "Aluno não encontrado" });
    }
  } else {
    const alunoDuplicado = await AlunoModel.findOne({ ra });
    if (alunoDuplicado) {
      return res
        .status(400)
        .json({ erro: "Já existe um aluno cadastrado com este RA" });
    }
  }

  return next();
}

module.exports = AlunoValidation;
