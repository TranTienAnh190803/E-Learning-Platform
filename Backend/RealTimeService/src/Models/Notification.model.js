import mongoose from "mongoose";

const notificationType = ["NEW_LESSON", "NEW_STUDENT", "DELETE_COURSE"];

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: [Number],
    required: true,
  },
  type: {
    type: String,
    enum: notificationType,
    required: true,
    set: (value) => {
      if (typeof value === "number") return notificationType[value];
      return value;
    },
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  contentUrl: {
    type: String,
    required: false,
  },
  sendAt: {
    type: Date,
    required: false,
  },
  isRead: {
    type: Boolean,
    required: true,
  },
  readAt: {
    type: Date,
    required: false,
  },
});

export const Notification = mongoose.model("Notification", NotificationSchema);
