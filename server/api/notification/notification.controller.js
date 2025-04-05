import createResponse from "../../utils/responseBuilder.js";
import Notification from "../../models/notification.model.js";

// Get user notifications
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Unauthorized",
        })
      );
    }

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({ path: "campaign", select: "title" })
      .populate({ path: "appointment", select: "date doctor" });

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        message: "Notifications fetched successfully",
        data: notifications,
      })
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    next(error);
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res, next) => {
  try {
    console.log("notification is", req.params);
    const { id } = req.params;

    const userId = req.user?._id;
    console.log("userId", userId);

    if (!userId) {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message: "Unauthorized",
        })
      );
    }

    // Update notification's read status
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Notification not found",
        })
      );
    }

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        message: "Notification marked as read",
        data: notification,
      })
    );
  } catch (error) {
    console.error("Error marking notification as read:", error);
    next(error);
  }
};

// controllers/notification.controller.js
export const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message: "Unauthorized",
        })
      );
    }

    // Mark all notifications as read
    const result = await Notification.updateMany(
      { user: userId, read: false }, // Filter unread notifications
      { $set: { read: true } } // Update read status
    );

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        message: "All notifications marked as read",
        data: result,
      })
    );
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    next(error);
  }
};

export const clearAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message: "Unauthorized",
        })
      );
    }

    // Delete all notifications for the user
    const result = await Notification.deleteMany({ user: userId });

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        message: "All notifications cleared",
        data: result,
      })
    );
  } catch (error) {
    console.error("Error clearing all notifications:", error);
    next(error);
  }
};
