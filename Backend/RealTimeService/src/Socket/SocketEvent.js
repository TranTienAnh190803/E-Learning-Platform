import { getAllCourseId } from "../API/CoreService.js";

export const socketEventHandler = (io) => {
  io.on("connection", async (socket) => {
    try {
      const { userId } = socket.user;
      const token = socket.token;

      // Join all connection with same user
      socket.join(`user:${userId}`);

      // Join all connection of 'course' with same user (Call API getAllCourse from CoreService)
      const response = await getAllCourseId(token);
      if (response.success) {
        response.data.forEach((courseId) => {
          socket.join(`notification:${courseId}`);
        });
      }

      console.log(`✅ Socket Connected`);
    } catch (error) {
      console.error("Connection error:", err);
      socket.disconnect();
    }
  });
};
