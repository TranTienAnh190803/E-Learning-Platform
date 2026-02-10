import express from "express";
import {
  getAllNotification,
  pushNotification,
} from "../Controllers/Notification.Controller.js";

const route = express.Router();

route.get("/get-notification", getAllNotification);
route.post("/push-notification", pushNotification);

export default route;
