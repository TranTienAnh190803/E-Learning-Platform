import "dotenv/config";
import http from "http";
import app from "./app.js";
import { connectDB } from "./Config/db.js";
import { getIO, initSocketIO } from "./Config/socket.js";
import "./Kafka/Consumer.js";  // Start Kafka consumer

// Create http Service contain resourse from app.js
const server = http.createServer(app);

// Connect MongoDB
connectDB();

// Integrate Socket.io
initSocketIO(server);

// Listen
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
