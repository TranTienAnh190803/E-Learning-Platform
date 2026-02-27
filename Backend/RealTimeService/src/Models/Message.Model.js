import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sendAt: {
    type: Date,
    required: true,
  },
});

export const Message = mongoose.model("Message", messageSchema);
