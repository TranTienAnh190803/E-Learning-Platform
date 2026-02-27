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
});

ChatRoomSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    const chatRoomId = this._id;
    await mongoose.model("Participation").deleteMany({ chatRoom: chatRoomId });
  },
);

export const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
