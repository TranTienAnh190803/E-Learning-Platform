import { Notification } from "../Models/Notification.Model.js";

export const getAllNotification = async (req, res) => {
  const userId = req.user.userId;

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
  const { type, title, content, contentId, receivers } = req.body;

  try {
    let notification = {
      userId: receivers,
      type: type,
      title: title,
      content: content,
      isRead: false,
      readAt: null,
    };

    if (type === 0) {
      // New lesson (contentId = lessonId)
      notification = {
        ...notification,
        contentUrl: contentId,
      };

      await Notification.create(notification);
    } else if (type === 1) {
      // New student (contentId = 'course's student list')
      notification = {
        ...notification,
        contentUrl: contentId,
      };

      await Notification.create(notification);
    } else if (type === 2) {
      // Delete course (contentId = null)
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
    console.log(error.message);
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
