const mongoose = require("../config/database");

const AlunoSchema = new mongoose.Schema({
  ra: { type: String, required: true, unique: true },
  nome: { type: String, required: true },
  foto: { type: String },
});

module.exports = mongoose.model("Aluno", AlunoSchema, "alunos");
