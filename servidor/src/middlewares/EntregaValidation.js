const EntregaModel = require("../model/EntregaModel");
const AutorizacaoModel = require("../model/AutorizacaoModel");

async function EntregaValidation(req, res, next) {
  const { dataEntrega, codigoAluno } = req.body;

  if (!dataEntrega)
    return res.status(400).json({ erro: "Informe a data de entrega" });

  if (!codigoAluno)
    return res.status(400).json({ erro: "Informe o código do aluno" });

  const autorizacao = await AutorizacaoModel.findOne({
    codigoAluno,
    dataLiberacao: dataEntrega,
  });
  if (!autorizacao)
    return res
      .status(400)
      .json({
        erro: "Não existe autorização para este aluno na data informada",
      });

  const entregaExistente = await EntregaModel.findOne({
    codigoAluno,
    dataEntrega,
  });
  if (entregaExistente)
    return res
      .status(400)
      .json({
        erro: "O lanche já foi entregue para este aluno na data informada",
      });

  return next();
}

module.exports = EntregaValidation;
