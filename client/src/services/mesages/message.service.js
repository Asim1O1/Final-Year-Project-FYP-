import axiosInstance from "../../utils/axiosInstance";
import createApiResponse from "../../utils/createApiResponse";

const getContactsForSidebar = async (page = 1, limit = 10, search = "") => {
  try {
    const response = await axiosInstance.get("/api/messages/contacts/", {
      params: { page, limit, search },
    });

    console.log("Response while fetching contacts for sidebar:", response);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message:
          response?.data?.message || "Failed to fetch contacts for sidebar",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      data: response.data?.data,
    });
  } catch (error) {
    console.error("Error while fetching contacts for sidebar:", error);

    return createApiResponse({
      isSuccess: false,
      message: "Failed to fetch contacts for sidebar",
      error: error.message,
    });
  }
};

const sendMessageService = async (receiverId, text, image) => {
  try {
    // Create a FormData object to append message content and image
    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image); // Only append if an image is selected

    const response = await axiosInstance.post(
      `/api/messages/send/${receiverId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("Response while sending message:", response);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to send message",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      data: response.data?.data,
    });
  } catch (error) {
    console.error("Error while sending message:", error);
    return createApiResponse({
      isSuccess: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

const getMessagesService = async (otherUserId) => {
  try {
    const response = await axiosInstance.get(
      `/api/messages/messages/${otherUserId}`
    );
    console.log("Response while fetching messages:", response);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to fetch messages",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      data: response.data?.data,
    });
  } catch (error) {
    console.error("Error while fetching messages:", error);
    return createApiResponse({
      isSuccess: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};
const markMessagesAsReadService = async (senderId, receiverId) => {
  try {
    const response = await axiosInstance.post("/api/messages/mark-read", {
      senderId,
      receiverId,
    });
    console.log("Response while marking messages as read:", response);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to mark messages as read",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      data: response.data?.data,
    });
  } catch (error) {
    console.error("Error while marking messages as read:", error);
    return createApiResponse({
      isSuccess: false,
      message: "Failed to mark messages as read",
      error: error.message,
    });
  }
};

const messageServices = {
  getContactsForSidebar,
  sendMessageService,
  getMessagesService,
  markMessagesAsReadService,
};

export default messageServices;
