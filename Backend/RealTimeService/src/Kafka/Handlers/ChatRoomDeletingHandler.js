import { ChatRoom } from "../../Models/ChatRoom.Model.js";

export const chatRoomDeletingHandler = async (message) => {
    const courseId = message;
    
    const chatRoom = await ChatRoom.findOne({ courseId: courseId });
    if (chatRoom) {
      await ChatRoom.deleteOne(chatRoom);
    }
}