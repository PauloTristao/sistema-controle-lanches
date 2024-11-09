const mongoose = require("../config/database");

const AlunoSchema = new mongoose.Schema({
  ra: { type: String, required: true, unique: true }, // RA do aluno
  nome: { type: String, required: true }, // Nome do aluno
  foto: { type: Buffer }, // URL ou caminho da foto do aluno
});

module.exports = mongoose.model("Aluno", AlunoSchema, "alunos");
