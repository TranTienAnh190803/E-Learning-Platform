import { getIO } from "../Config/socket.js";
import { ChatRoom } from "../Models/ChatRoom.Model.js";
import { Member } from "../Models/MemberSchema.Model.js";

export const createChatRoom = async (req, res) => {
  const { courseId, title, email, fullname, userId } = req.body;

  try {
    const io = getIO();
    const member = await Member.findOne({ userId: userId });

    // Member đã tồn tại chưa (đã tồn tại -> tạo phòng; chưa tồn tại -> tạo member + tạo phòng)
    if (!member) {
      const newMember = {
        userId: userId,
        fullname: fullname,
        email: email,
      };
      const addedMember = await Member.create(newMember);

      const chatRoom = {
        courseId: courseId,
        roomName: title,
        member: [addedMember._id],
        ownerId: userId,
      };
      await ChatRoom.create(chatRoom);
    } else {
      const chatRoom = {
        courseId: courseId,
        roomName: title,
        member: [member._id],
        ownerId: userId,
      };
      await ChatRoom.create(chatRoom);
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

    await ChatRoom.updateOne(
      { courseId: courseId },
      { $addToSet: { member: member._id } },
    );

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

    await ChatRoom.updateOne(
      { courseId: courseId },
      { $pull: { member: member._id } },
    );

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
    const deletedChatRoom = await ChatRoom.findOneAndDelete({
      courseId: courseId,
    });
    if (deletedChatRoom) {
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

export const getOwnedChatRoom = async (req, res) => {
  const { userId } = req.user;

  try {
    const ownedChatRoom = await ChatRoom.find({ ownerId: userId })
      .select("-member -_v")
      .lean();
    if (ownedChatRoom && ownedChatRoom.length > 0) {
      return res.status(200).json({
        success: true,
        data: ownedChatRoom,
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
