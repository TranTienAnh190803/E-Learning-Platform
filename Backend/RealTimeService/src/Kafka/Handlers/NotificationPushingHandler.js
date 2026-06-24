import { getIO } from "../../Config/socket.js";
import { Notification } from "../../Models/Notification.Model.js";

export const notificationPushingHandler = async (message) => {
  const { type, title, content, contentId, receivers, courseId } = message;

  if (typeof type !== "number") {
    throw new Error("Notification message must include a valid type");
  }

  if (!receivers || !courseId) {
    throw new Error("Notification message must include receivers and courseId");
  }

  const baseNotification = {
    userId: receivers,
    type,
    title,
    content,
    sendAt: new Date(),
    isRead: false,
    readAt: null,
  };

  const io = getIO();
  let notification;
  let channel;

  switch (type) {
    case 0:
      // New lesson (contentId = lessonId)
      notification = {
        ...baseNotification,
        contentUrl: `/course/${courseId}/lesson/${contentId}`,
      };
      channel = `student-notification:${courseId}`;
      break;

    case 1:
      // New student
      notification = {
        ...baseNotification,
        contentUrl: `/course-detail/${courseId}`,
      };
      channel = `instructor-notification:${courseId}`;
      break;

    case 2:
      // Delete course (contentId = null)
      notification = {
        ...baseNotification,
        contentUrl: null,
      };
      channel = `student-notification:${courseId}`;
      break;

    default:
      throw new Error("Incorrect notification type");
  }

  await Notification.create(notification);
  io.to(channel).emit("push-notification", notification);
};