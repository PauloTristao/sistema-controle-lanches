const mongoose = require("mongoose");

const AutorizacaoSchema = new mongoose.Schema({
  dataLiberacao: { type: Date, required: true },
  ra: {
    type: String,
    required: true,
  },
  qtdeLanches: { type: Number, required: true, max: 3 },
  dataEntrega: { type: Date, dafault: null },
});

module.exports = mongoose.model(
  "Autorizacao",
  AutorizacaoSchema,
  "autorizacoes"
);
