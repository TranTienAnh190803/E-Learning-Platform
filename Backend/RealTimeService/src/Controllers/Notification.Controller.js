import { getIO } from "../Config/socket.js";
import { Notification } from "../Models/Notification.Model.js";

export const getAllNotification = async (req, res) => {
  const userId = req.user.userId;

  try {
    const notification = await Notification.find({ userId: userId })
      .select("-userId -__v")
      .sort({ sendAt: -1 })
      .lean();
    if (notification.length > 0)
      return res.status(200).json({
        success: true,
        data: notification,
        statusCode: 200,
      });

    return res.status(200).json({
      success: true,
      message: "There is no notification",
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

export const pushNotification = async (req, res) => {
  const { type, title, content, contentId, receivers, courseId } = req.body;

  try {
    let notification = {
      userId: receivers,
      type: type,
      title: title,
      content: content,
      sendAt: new Date(),
      isRead: false,
      readAt: null,
    };
    const io = getIO();

    if (type === 0) {
      // New lesson (contentId = lessonId)
      notification = {
        ...notification,
        contentUrl: `/course/${courseId}/lesson/${contentId}`,
      };

      // Query DB
      await Notification.create(notification);
      // Push Notification Realtime
      io.to(`student-notification:${courseId}`).emit(
        "push-notification",
        notification,
      );
    } else if (type === 1) {
      // New student
      notification = {
        ...notification,
        contentUrl: `/course-detail/${courseId}`,
      };

      // Query DB
      await Notification.create(notification);
      // Push Notification Realtime
      io.to(`instructor-notification:${courseId}`).emit(
        "push-notification",
        notification,
      );
    } else if (type === 2) {
      // Delete course (contentId = null)
      notification = {
        ...notification,
        contentUrl: null,
      };

      // Query DB
      await Notification.create(notification);
      // Push Notification Realtime
      io.to(`student-notification:${courseId}`).emit(
        "push-notification",
        notification,
      );
    } else {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Incorrect type input",
      });
    }
    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Push notification successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};

export const readNotification = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (notification)
      return res.status(200).json({
        success: true,
        statusCode: 200,
      });

    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: "Notification not found.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: error.message,
    });
  }
};

export const readAllNotification = async (req, res) => {
  const userId = req.user.userId;

  try {
    await Notification.updateMany(
      { userId: userId },
      { $set: { isRead: true } },
    );

    return res.status(200).json({
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: error.message,
    });
  }
};
