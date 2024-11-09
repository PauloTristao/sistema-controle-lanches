const express = require("express");
const multer = require("multer");
const router = express.Router();
const AlunoController = require("../controller/AlunoController");
const AlunoValidation = require("../middlewares/AlunoValidation");

// Configuração do multer
const storage = multer.memoryStorage(); // Armazenar a imagem em memória
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10 MB, por exemplo
});

// Rota para criar aluno
router.post(
  "/",
  upload.single("foto"),
  AlunoValidation,
  AlunoController.create
);
router.put("/:id", AlunoValidation, AlunoController.update);
router.delete("/:id", AlunoController.delete);
router.get("/:id", AlunoController.get);
router.get("/filter/getAll", AlunoController.getAll);
router.get("/filter/getNextId", AlunoController.getNextId);

module.exports = router;
