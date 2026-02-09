import express from "express";
import cors from "cors";
import "dotenv/config";
import { corsConfig } from "./Config/cors.js";
import { authentication } from "./Middlewares/JWTAuthentication.js";

const app = express();

// Middleware
app.use(cors(corsConfig));
app.use(express.json());
app.use(authentication);

// Route
app.get("/", async (req, res) => {
  return res.send("Hello World");
});

export default app;
