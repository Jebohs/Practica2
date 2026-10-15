import express from "express";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello from Express + TypeScript");
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));