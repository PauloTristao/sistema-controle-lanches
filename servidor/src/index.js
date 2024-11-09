const express = require("express");
const cors = require("cors");
const server = express();

const AlunoRouter = require("./routes/AlunoRouter");
const AutorizacaoRouter = require("./routes/AutorizacaoRouter");
const EntregaRouter = require("./routes/EntregaRouter");

server.use(express.json({ limit: "10mb" }));
server.use(cors());

server.get("/teste", (req, res) => {
  res.send(
    "<marquee><center><h1> tudo certo com a api!!!!</h1></center></marquee>"
  );
});

server.use("/aluno", AlunoRouter);
server.use("/autorizacao", AutorizacaoRouter);
server.use("/entrega", EntregaRouter);

server.listen(3000, () => {
  console.log("Servidor Online na porta 3000");
});
