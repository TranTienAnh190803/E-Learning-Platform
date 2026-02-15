import express from "express";
import {
  getAllNotification,
  pushNotification,
  readAllNotification,
  readNotification,
} from "../Controllers/Notification.Controller.js";
import { Notification } from "../Models/Notification.Model.js";

const route = express.Router();

route.get("/get-notification", getAllNotification);
route.post("/push-notification", pushNotification);
route.patch("/read-notification/:notificationId", readNotification);
route.patch("/read-all", readAllNotification);

export default route;
