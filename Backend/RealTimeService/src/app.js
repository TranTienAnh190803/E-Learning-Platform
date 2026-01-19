import express from "express";
import "dotenv/config";

const app = express();

app.get("/", async (req, res) => {
  return res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log("Run program");
});
