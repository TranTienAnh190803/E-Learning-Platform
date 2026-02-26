import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isRead: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export const Member = mongoose.model("Member", MemberSchema);
