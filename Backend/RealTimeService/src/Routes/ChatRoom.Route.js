import express from "express";
import {
  createChatRoom,
  deleteChatRoom,
  getChat,
  getMemberId,
  getParticipatedChatRoom,
  joinChatRoom,
  leaveChatRoom,
  sendMessage,
} from "../Controllers/ChatRoom.Controller.js";
import { authorization } from "../Middlewares/JWTAuthorization.js";

const route = express.Router();

route.post("/create-chat-room", authorization("INSTRUCTOR"), createChatRoom); // CoreService call (create course)
route.post("/join-chat-room", authorization("STUDENT"), joinChatRoom); // CoreService call (enroll course)
route.post("/leave-chat-room", leaveChatRoom); // CoreService call (leave/kick course)
route.delete(
  "/delete-chat-room/:courseId",
  authorization("INSTRUCTOR"),
  deleteChatRoom,
); // CoreService call (delete course)
route.get("/get-member-id", getMemberId);
route.get("/get-participated-chat-room", getParticipatedChatRoom);
route.get("/get-chat/:chatRoomId", getChat);
route.post("/send-message/:chatRoom/:content", sendMessage);

export default route;
