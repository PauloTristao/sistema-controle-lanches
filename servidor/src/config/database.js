const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/escola";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro na conexão com o MongoDB:"));
db.once("open", () => {
  console.log("Conectado ao MongoDB");
});

module.exports = mongoose;
