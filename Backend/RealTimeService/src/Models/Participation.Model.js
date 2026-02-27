import mongoose from "mongoose";

const ParticipationSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
  isRead: {
    type: Boolean,
    required: true,
    default: true,
  },
  participatedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const Participation = mongoose.model(
  "Participation",
  ParticipationSchema,
);
