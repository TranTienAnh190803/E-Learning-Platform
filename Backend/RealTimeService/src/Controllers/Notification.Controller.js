import { Notification } from "../Models/Notification.Model.js";

export const getAllNotification = async (req, res) => {
  const userId = req.user.id;

  try {
    const notification = await Notification.find({ userId: userId }).lean();
    if (notification.length > 0)
      return res.status(200).json({
        success: true,
        data: notification,
        statusCode: 200,
      });

    return res.status(200).json({
      success: true,
      message: "There is no notification",
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
  const { userId, type, title, content, contentId } = req.body;

  try {
    const notification = {
      userId: userId,
      type: type,
      title: title,
      content: content,
      isRead: false,
      readAt: null,
    };

    if (type === 0) {
      // New lesson
      notification = {
        ...notification,
        contentUrl: contentId,
      };

      await Notification.create(notification);
    } else if (type === 1) {
      // New student
      notification = {
        ...notification,
        contentUrl: contentId,
      };

      await Notification.create(notification);
    } else if (type === 2) {
      // Delete course
      notification = {
        ...notification,
        contentUrl: contentId,
      };

      await Notification.create(notification);
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
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
