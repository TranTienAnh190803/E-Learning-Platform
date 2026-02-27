import mongoose from "mongoose";
import { getIO } from "../Config/socket.js";
import { ChatRoom } from "../Models/ChatRoom.Model.js";
import { Member } from "../Models/MemberSchema.Model.js";
import { Message } from "../Models/Message.Model.js";
import { Participation } from "../Models/Participation.Model.js";

export const createChatRoom = async (req, res) => {
  const { courseId, title, email, fullname, userId } = req.body;

  try {
    const io = getIO();
    const member = await Member.findOne({ userId: userId });

    // Member đã tồn tại chưa (đã tồn tại -> tạo phòng; chưa tồn tại -> tạo member + tạo phòng)
    if (!member) {
      // Member
      const newMember = {
        userId: userId,
        fullname: fullname,
        email: email,
      };
      const addedMember = await Member.create(newMember);

      // ChatRoom
      const chatRoom = {
        courseId: courseId,
        roomName: title,
      };
      const addedRoom = await ChatRoom.create(chatRoom);

      // Participation
      const participation = {
        member: addedMember._id,
        chatRoom: addedRoom._id,
      };
      await Participation.create(participation);
    } else {
      // ChatRoom
      const chatRoom = {
        courseId: courseId,
        roomName: title,
        member: [member._id],
      };
      const addedRoom = await ChatRoom.create(chatRoom);

      // Participation
      const participation = {
        member: member._id,
        chatRoom: addedRoom._id,
      };
      await Participation.create(participation);
    }

    // ChatRoom Socket
    io.join(`chat-room:${courseId}`);

    return res.status(200).json({
      success: true,
      message: "Create chat room successfully",
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
};

export const joinChatRoom = async (req, res) => {
  const { courseId, email, fullname, userId } = req.body;

  try {
    const io = getIO();

    const chatRoom = await ChatRoom.findOne({ courseId: courseId });
    if (!chatRoom) {
      return res.status(400).json({
        success: false,
        message: "Chat room does not exist",
        statusCode: 400,
      });
    }

    let member = await Member.findOne({ userId: userId });
    // Member đã tồn tại chưa (đã tồn tại -> vào phòng chat; chưa tồn tại -> tạo member + vào phòng chat luôn)
    if (!member) {
      const newMember = {
        userId: userId,
        fullname: fullname,
        email: email,
      };
      member = await Member.create(newMember);
    }

    const participation = {
      member: member._id,
      chatRoom: chatRoom._id,
    };
    await Participation.create(participation);

    // ChatRoom Socket
    io.join(`chat-room:${courseId}`);

    return res.status(200).json({
      success: true,
      message: "Join chat room successfully",
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
};

export const leaveChatRoom = async (req, res) => {
  const { courseId, userId } = req.body;

  try {
    const chatRoom = await ChatRoom.findOne({ courseId: courseId });
    if (!chatRoom) {
      return res.status(400).json({
        success: false,
        message: "Chat room does not exist",
        statusCode: 400,
      });
    }

    const member = await Member.findOne({ userId: userId });
    if (!member) {
      return res.status(400).json({
        success: false,
        message: "Member not found",
        statusCode: 400,
      });
    }

    await Participation.deleteMany({
      member: member._id,
      chatRoom: chatRoom._id,
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
};

export const deleteChatRoom = async (req, res) => {
  const { courseId } = req.params;

  try {
    const chatRoom = await ChatRoom.findOne({ courseId: courseId });
    if (chatRoom) {
      await ChatRoom.deleteOne(chatRoom);

      return res.status(200).json({
        success: true,
        message: "Deleted chat room successfully.",
        statusCode: 200,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Chat room not found.",
      statusCode: 404,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
};

export const getMemberId = async (req, res) => {
  const { userId } = req.user;

  try {
    const member = await Member.findOne({ userId: userId });
    if (member) {
      return res.status(200).json({
        success: true,
        data: member._id,
        statusCode: 200,
      });
    }

    return res.status(404).json({
      success: false,
      statusCode: 404,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
};

export const getParticipatedChatRoom = async (req, res) => {
  const { userId } = req.user;

  try {
    const member = await Member.findOne({ userId: userId });
    if (!member)
      return res.status(404).json({
        success: false,
        message: "Member not found.",
        statusCode: 404,
      });

    // ChatRoom
    const participation = await Participation.find({
      member: member._id,
    }).lean();
    const chatRoomId = participation.map((value) => value.chatRoom);
    const chatRooms = await ChatRoom.find({ _id: { $in: chatRoomId } })
      .select("-__v")
      .lean();
    if (chatRooms && chatRooms.length > 0) {
      const mapParticipate = new Map(
        participation.map((x) => [x.chatRoom.toString(), x.isRead]),
      );
      // Result = [{ _id, courseId, roomName, isRead }]
      const result = chatRooms
        .map((x) => ({
          ...x,
          isRead: Boolean(mapParticipate.get(x._id.toString())),
        }))
        .sort((a, b) => a.isRead - b.isRead);

      return res.status(200).json({
        success: true,
        data: result,
        statusCode: 200,
      });
    }

    return res.status(200).json({
      success: true,
      data: [],
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
};

export const getChat = async (req, res) => {
  const { chatRoomId } = req.params;

  try {
    const chat = await Message.find({
      chatRoom: new mongoose.Types.ObjectId(chatRoomId),
    })
      .select("-__v")
      .sort({ sendAt: -1 })
      .lean();

    if (chat.length > 0)
      return res.status(200).json({
        success: true,
        data: chat,
        statusCode: 200,
      });

    return res.status(200).json({
      success: true,
      data: [],
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
};
