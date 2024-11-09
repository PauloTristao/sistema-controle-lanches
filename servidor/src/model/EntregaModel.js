const mongoose = require("mongoose");

const EntregaSchema = new mongoose.Schema({
  dataEntrega: { type: Date, required: true }, // Data de entrega
  alunoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Aluno",
    required: true,
  }, // Referência ao aluno
  autorizacaoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Autorizacao",
    required: true,
  }, // Referência à autorização
});

module.exports = mongoose.model("Entrega", EntregaSchema, "entregas");
