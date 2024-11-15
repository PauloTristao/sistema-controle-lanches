const AutorizacaoModel = require("../model/AutorizacaoModel");
const AlunoModel = require("../model/AlunoModel");
const { isFuture, startOfDay, endOfDay } = require("date-fns");

async function AutorizacaoValidation(req, res, next) {
  const { dataLiberacao, ra, qtdeLanches, idAutorizacao } = req.body;

  if (!dataLiberacao || isFuture(new Date(dataLiberacao)))
    return res
      .status(400)
      .json({ erro: "Informe uma data de liberação válida (não no futuro)" });

  if (!ra) return res.status(400).json({ erro: "Informe o código do aluno" });

  if (!qtdeLanches || qtdeLanches < 1 || qtdeLanches > 3)
    return res
      .status(400)
      .json({ erro: "A quantidade de lanches deve ser entre 1 e 3" });

  const alunoExistente = await AlunoModel.findOne({ ra: ra });
  if (!alunoExistente)
    return res.status(400).json({ erro: "Aluno não encontrado" });

  const dataLimpa = startOfDay(new Date(dataLiberacao));
  console.log(dataLimpa, ra);

  const autorizacaoExistente = await AutorizacaoModel.findOne({
    dataLiberacao: { $gte: dataLimpa, $lt: endOfDay(dataLimpa) },
    ra: { $eq: ra },
    _id: { $ne: idAutorizacao },
  });
  console.log(autorizacaoExistente);

  if (autorizacaoExistente)
    return res
      .status(400)
      .json({ erro: "Já existe uma autorização para esta data" });

  return next();
}

module.exports = AutorizacaoValidation;
