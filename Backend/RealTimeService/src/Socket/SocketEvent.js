import {
  getAllEnrolledCourseId,
  getAllOwnedCourseId,
} from "../API/CoreService.js";

export const socketEventHandler = (io) => {
  io.on("connection", async (socket) => {
    try {
      const { userId, role } = socket.user;
      const token = socket.token;

      // Join all connection with same user
      socket.join(`user:${userId}`);

      // Join all connection of 'course' with same user (Call API getAllCourse from CoreService)
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

      console.log(`✅ Socket Connected`);
    } catch (error) {
      console.error("Connection error:", err);
      socket.disconnect();
    }
  });
};
