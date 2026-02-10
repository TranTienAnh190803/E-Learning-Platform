import express from "express";
import cors from "cors";
import "dotenv/config";
import { corsConfig } from "./Config/cors.js";
import { authentication } from "./Middlewares/JWTAuthentication.js";
import notificationRoute from "./Routes/Notification.Route.js";

const app = express();

// Middleware
app.use(cors(corsConfig));
app.use(express.json());
app.use(authentication);

// Route
app.use("/notification-api", notificationRoute);

export default app;
