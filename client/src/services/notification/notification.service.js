import axiosInstance from "../../utils/axiosInstance";
import createApiResponse from "../../utils/createApiResponse";

export const getNotificationsService = async () => {
  try {
    const response = await axiosInstance.get("/api/notifications");
    console.log("The response while getting user notifications is", response);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to fetch notifications",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      data: response.data?.data,
    });
  } catch (error) {
    console.error("Error while fetching user notifications", error);
    return createApiResponse({
      isSuccess: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

export const markNotificationAsReadService = async (notificationId) => {
  try {
    console.log("The notification id here", notificationId);
    const response = await axiosInstance.put(
      `/api/notifications/${notificationId}/read`
    );
    console.log("The response while marking notification as read:", response);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message:
          response?.data?.message || "Failed to mark notification as read",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      data: response.data?.data,
    });
  } catch (error) {
    console.error("Error while marking notification as read:", error);
    return createApiResponse({
      isSuccess: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};
/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsReadService = async () => {
  try {
    const response = await axiosInstance.put(
      "/api/notifications/mark-all-read"
    );
    console.log("Response while marking all notifications as read:", response);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message:
          response?.data?.message || "Failed to mark all notifications as read",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      data: response.data?.data,
    });
  } catch (error) {
    console.error("Error while marking all notifications as read:", error);
    return createApiResponse({
      isSuccess: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

/**
 * Clear all notifications
 */
export const clearAllNotificationsService = async () => {
  try {
    const response = await axiosInstance.delete("/api/notifications/clear-all");
    console.log("Response while clearing all notifications:", response);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to clear all notifications",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      data: response.data?.data,
    });
  } catch (error) {
    console.error("Error while clearing all notifications:", error);
    return createApiResponse({
      isSuccess: false,
      message: "Failed to clear all notifications",
      error: error.message,
    });
  }
};
