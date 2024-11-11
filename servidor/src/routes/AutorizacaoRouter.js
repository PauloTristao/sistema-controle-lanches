const express = require("express");
const router = express.Router();
const AutorizacaoController = require("../controller/AutorizacaoController");
const AutorizacaoValidation = require("../middlewares/AutorizacaoValidation");

router.post("/", AutorizacaoValidation, AutorizacaoController.create);
router.put("/:id", AutorizacaoValidation, AutorizacaoController.update);
router.put("/marcar-entregue/:id", AutorizacaoController.marcarComoEntregue);
router.delete("/:id", AutorizacaoController.delete);
router.get("/filter/getAll", AutorizacaoController.getAll);
router.get("/filter/getByDate/:data", AutorizacaoController.getByDate);

module.exports = router;
