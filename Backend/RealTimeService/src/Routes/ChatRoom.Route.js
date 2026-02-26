import express from "express";
import {
  createChatRoom,
  deleteChatRoom,
  getOwnedChatRoom,
  joinChatRoom,
  leaveChatRoom,
} from "../Controllers/ChatRoom.Controller.js";
import { authorization } from "../Middlewares/JWTAuthorization.js";

const route = express.Router();

route.post("/create-chat-room", authorization("INSTRUCTOR"), createChatRoom);
route.post("/join-chat-room", authorization("STUDENT"), joinChatRoom);
route.post("/leave-chat-room", leaveChatRoom);
route.delete("/delete-chat-room", authorization("INSTRUCTOR"), deleteChatRoom);
route.get(
  "/get-owned-chat-room",
  authorization("INSTRUCTOR"),
  getOwnedChatRoom,
);

export default route;
