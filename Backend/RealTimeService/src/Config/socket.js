import { Server } from "socket.io";
import { socketEventHandler } from "../Socket/SocketEvent.js";

const clientUrl = process.env.FRONTEND_URL;

let io;

export const initSocketIO = async (httpServer) => {
  // 1. Setup Socket and CORS
  io = new Server(httpServer, {
    cors: {
      origin: clientUrl,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // 2. Socket Middleware

  // 3. Handle Event
  socketEventHandler(io);

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket haven't Initialized yet");
  return io;
};
