const express = require("express");
const router = express.Router();
const EntregaController = require("../controller/EntregaController");
const EntregaValidation = require("../middlewares/EntregaValidation");

router.post("/", EntregaValidation, EntregaController.create);
router.get("/filter/getAll", EntregaController.getAll);
router.get("/filter/getByDate/:data", EntregaController.getByDate);

module.exports = router;
