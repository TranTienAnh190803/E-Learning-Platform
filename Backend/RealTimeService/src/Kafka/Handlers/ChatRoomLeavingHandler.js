import { ChatRoom } from "../../Models/ChatRoom.Model.js";
import { Member } from "../../Models/MemberSchema.Model.js";
import { Participation } from "../../Models/Participation.Model.js";

export const chatRoomLeavingHandler = async (message) => {
    const { courseId, userId } = message;
    
    const chatRoom = await ChatRoom.findOne({ courseId: courseId });
    if (!chatRoom) {
      return 
    }

    const member = await Member.findOne({ userId: userId });
    if (!member) {
      return 
    }

    await Participation.deleteMany({
      member: member._id,
      chatRoom: chatRoom._id,
    });
}