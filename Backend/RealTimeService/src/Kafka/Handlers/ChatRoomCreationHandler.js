import { ChatRoom } from "../../Models/ChatRoom.Model.js";
import { Member } from "../../Models/MemberSchema.Model.js";
import { Participation } from "../../Models/Participation.Model.js";

export const chatRoomCreationHandler = async (message) => {
    const { courseId, title, email, fullname, userId } = message;

    // Kiểm tra phòng chat đã tồn tại chưa (nếu đã tồn tại rồi thì xóa đi, tạo lại từ đầu - fresh)
    const chatRoom = await ChatRoom.findOneAndDelete({courseId: courseId});
    
    // Member đã tồn tại chưa (đã tồn tại -> tạo phòng; chưa tồn tại -> tạo member + tạo phòng)
    const member = await Member.findOne({ userId: userId });
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
}