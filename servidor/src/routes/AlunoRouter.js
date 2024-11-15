const express = require("express");
const multer = require("multer");
const router = express.Router();
const AlunoController = require("../controller/AlunoController");
const AlunoValidation = require("../middlewares/AlunoValidation");

router.post("/", AlunoValidation, AlunoController.create);
router.put("/:id", AlunoValidation, AlunoController.update);
router.delete("/:id", AlunoController.delete);
router.get("/:id", AlunoController.get);
router.get("/filter/getAll", AlunoController.getAll);
router.get("/filter/getAllRaAndName", AlunoController.getAllRaAndName);
router.get("/filter/getNextId", AlunoController.getNextId);
router.get("/:ra/foto", AlunoController.getFoto);

module.exports = router;
