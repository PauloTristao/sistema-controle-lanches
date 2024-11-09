const AutorizacaoModel = require("../model/AutorizacaoModel");
const AlunoModel = require("../model/AlunoModel");
const { isFuture } = require("date-fns");

async function AutorizacaoValidation(req, res, next) {
  const { dataLiberacao, codigoAluno, qtdeLanches } = req.body;

  if (!dataLiberacao || isFuture(new Date(dataLiberacao)))
    return res
      .status(400)
      .json({ erro: "Informe uma data de liberação válida (não no futuro)" });

  if (!codigoAluno)
    return res.status(400).json({ erro: "Informe o código do aluno" });

  if (!qtdeLanches || qtdeLanches < 1 || qtdeLanches > 3)
    return res
      .status(400)
      .json({ erro: "A quantidade de lanches deve ser entre 1 e 3" });

  const alunoExistente = await AlunoModel.findById(codigoAluno);
  if (!alunoExistente)
    return res.status(400).json({ erro: "Aluno não encontrado" });

  const autorizacaoExistente = await AutorizacaoModel.findOne({
    codigoAluno,
    dataLiberacao,
  });
  if (autorizacaoExistente)
    return res
      .status(400)
      .json({ erro: "Já existe uma autorização para este aluno nesta data" });

  return next();
}

module.exports = AutorizacaoValidation;
