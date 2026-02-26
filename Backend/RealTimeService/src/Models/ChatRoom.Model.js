import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema({
  courseId: {
    type: Number,
    required: true,
    unique: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  member: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
  ],
});

export const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
