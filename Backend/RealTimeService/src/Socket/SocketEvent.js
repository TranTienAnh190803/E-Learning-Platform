import {
  getAllEnrolledCourseId,
  getAllOwnedCourseId,
} from "../API/CoreService.js";
import { Member } from "../Models/MemberSchema.Model.js";
import { Participation } from "../Models/Participation.Model.js";

export const socketEventHandler = (io) => {
  io.on("connection", async (socket) => {
    try {
      const { userId, role } = socket.user;
      const token = socket.token;

      // Join all connection with same user
      socket.join(`user:${userId}`);

      // Join all connection of 'course' with same user (Call API getAllCourse from CoreService) - for notification
      if (role === "INSTRUCTOR") {
        const response = await getAllOwnedCourseId(token);
        if (response.success) {
          response.data.forEach((courseId) => {
            socket.join(`instructor-notification:${courseId}`);
          });
        }
      } else if (role === "STUDENT") {
        const response = await getAllEnrolledCourseId(token);
        if (response.success) {
          response.data.forEach((courseId) => {
            socket.join(`student-notification:${courseId}`);
          });
        }
      }

      // Join all connection for chat room
      // const member = await Member.findOne({ userId: userId });
      // if (member) {
      //   const participatedChatRoom = await Participation.find({
      //     member: member._id,
      //   });
      //   const chatRoom = participatedChatRoom.map((x) => x.chatRoom.toString());
      //   chatRoom.forEach((value) => {
      //     socket.join(`chat:${value}`);
      //   });
      // }

      socket.on("join-room", (room) => {
        socket.join(room);
      });

      console.log(`✅ Socket Connected`);
    } catch (error) {
      console.error("Connection error:", error);
      socket.disconnect();
    }
  });
};
