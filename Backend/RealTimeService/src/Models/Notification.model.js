import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["NEW_LESSON", "NEW_STUDENT", "DELETE_COURSE"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  contentUrl: {
    type: String,
    required: false,
  },
  isRead: {
    type: Boolean,
    required: true,
  },
  readAt: {
    type: Date,
    required: true,
  },
});

export const Notification = mongoose.model("Notification", NotificationSchema);
