const mongoose = require("mongoose");

const AutorizacaoSchema = new mongoose.Schema({
  dataLiberacao: { type: Date, required: true }, // Data de liberação do lanche
  alunoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Aluno",
    required: true,
  }, // Referência ao aluno
  qtdeLanches: { type: Number, required: true, max: 3 }, // Quantidade de lanches
});

module.exports = mongoose.model(
  "Autorizacao",
  AutorizacaoSchema,
  "autorizacoes"
);
