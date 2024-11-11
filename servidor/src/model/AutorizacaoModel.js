const mongoose = require("mongoose");

const AutorizacaoSchema = new mongoose.Schema({
  dataLiberacao: { type: Date, required: true }, // Data de liberação do lanche
  ra: {
    type: String,
    required: true,
  }, // Referência ao aluno
  qtdeLanches: { type: Number, required: true, max: 3 }, // Quantidade de lanches
  dataEntrega: { type: Date, dafault: null }, // Data de entrega
});

module.exports = mongoose.model(
  "Autorizacao",
  AutorizacaoSchema,
  "autorizacoes"
);
