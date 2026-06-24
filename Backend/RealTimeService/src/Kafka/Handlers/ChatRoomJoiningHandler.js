import { ChatRoom } from "../../Models/ChatRoom.Model.js";
import { Member } from "../../Models/MemberSchema.Model.js";
import { Participation } from "../../Models/Participation.Model.js";

export const chatRoomJoiningHandler = async (message) => {
    const { courseId, email, fullname, userId } = message;
    
    // Kiểm tra ChatRoom đã tồn tại chưa
    const chatRoom = await ChatRoom.findOne({ courseId: courseId });
    if (!chatRoom) {
      return
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
}