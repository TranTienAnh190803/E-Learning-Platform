import express from "express";
import cors from "cors";
import "dotenv/config";
import { corsConfig } from "./Config/cors.js";

const app = express();

app.use(cors(corsConfig));
app.use(express.json());

app.get("/", async (req, res) => {
  return res.send("Hello World");
});

export default app;
