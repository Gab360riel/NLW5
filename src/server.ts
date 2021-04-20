import express from 'express';

const app = express()

app.get("/", (req, res) => {
  return res.json({response: "Hello World"})
})

app.post("/", (req, res) => {
  return res.json({response: "Usuário salvo com sucesso!"})
})

app.listen(3333, () => console.log("O servidor está rodando na porta 3333"))
