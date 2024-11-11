const AutorizacaoModel = require("../model/AutorizacaoModel");
const AlunoModel = require("../model/AlunoModel");
const { isFuture, startOfDay, endOfDay } = require("date-fns");

async function AutorizacaoValidation(req, res, next) {
  const { dataLiberacao, ra, qtdeLanches, idAutorizacao } = req.body;

  // Valida se a data de liberação não é no futuro
  if (!dataLiberacao || isFuture(new Date(dataLiberacao)))
    return res
      .status(400)
      .json({ erro: "Informe uma data de liberação válida (não no futuro)" });

  // Valida se o código do aluno foi fornecido
  if (!ra) return res.status(400).json({ erro: "Informe o código do aluno" });

  // Valida se a quantidade de lanches está no intervalo correto
  if (!qtdeLanches || qtdeLanches < 1 || qtdeLanches > 3)
    return res
      .status(400)
      .json({ erro: "A quantidade de lanches deve ser entre 1 e 3" });

  // Verifica se o aluno existe
  const alunoExistente = await AlunoModel.findOne({ ra: ra });
  if (!alunoExistente)
    return res.status(400).json({ erro: "Aluno não encontrado" });

  // Verifica se já existe uma autorização para qualquer aluno na mesma data
  const dataLimpa = startOfDay(new Date(dataLiberacao));
  console.log(dataLimpa, ra);

  // Verifica se já existe uma autorização para o aluno em qualquer hora daquele dia
  const autorizacaoExistente = await AutorizacaoModel.findOne({
    dataLiberacao: { $gte: dataLimpa, $lt: endOfDay(dataLimpa) }, // Filtra pela data, ignorando horas
    ra: { $eq: ra },
  });
  console.log(autorizacaoExistente);

  if (autorizacaoExistente)
    return res
      .status(400)
      .json({ erro: "Já existe uma autorização para esta data" });

  // Se todas as validações passarem, continua para o próximo middleware ou lógica
  return next();
}

module.exports = AutorizacaoValidation;
