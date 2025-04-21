import axiosInstance from "../../utils/axiosInstance";
import createApiResponse from "../../utils/createApiResponse";

const getUserByIdService = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/user/${userId}`);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to fetch user details",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: "User retrieved successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    console.error("Error in getUserByIdService:", error);
    return createApiResponse({
      isSuccess: false,
      message: "Failed to fetch user details",
      error:
        error?.response?.data?.error?.[0] ||
        error?.response?.data?.message ||
        "Something went wrong",
    });
  }
};

const getAllUsersService = async (filters = { page: 1, limit: 10 }) => {
  try {
    const { page, limit } = filters;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    }).toString();

    const response = await axiosInstance.get(`/api/user?${queryParams}`);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to retrieve users",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: "Users retrieved successfully",
      data: {
        users: response?.data?.data,
        totalCount: response?.data?.data?.totalCount,
        currentPage: response?.data?.data?.currentPage,
        totalPages: response?.data?.data?.totalPages,
      },
    });
  } catch (error) {
    console.error("Error in getAllUsersService:", error);
    return createApiResponse({
      isSuccess: false,
      message: "An error occurred while fetching users",
      error:
        error?.response?.data?.error?.[0] ||
        error?.response?.data?.message ||
        "Something went wrong",
    });
  }
};

const updateUserService = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`/api/user/${userId}`, userData);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to update user",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "User updated successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    console.error("Error in updateUserService:", error);
    return createApiResponse({
      isSuccess: false,
      message: "An error occurred while updating the user",
      error:
        error?.response?.data?.error?.[0] ||
        error?.response?.data?.message ||
        "Something went wrong",
    });
  }
};

const getUserStatsService = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/user/stats/${userId}`);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to fetch user stats",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "User stats fetched successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    console.error("Error in getUserStatsService:", error);
    return createApiResponse({
      isSuccess: false,
      message: "An error occurred while fetching user stats",
      error:
        error?.response?.data?.error?.[0] ||
        error?.response?.data?.message ||
        "Something went wrong",
    });
  }
};

const uerService = {
  getUserByIdService,
  getAllUsersService,
  updateUserService,
  getUserStatsService,
};

export default uerService;
