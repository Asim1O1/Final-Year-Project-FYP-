import axiosInstance from "../../utils/axiosInstance";
import createApiResponse from "../../utils/createApiResponse";




export const getRecentActivitiesService = async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get(
        `/api/systemAdmin/activities?page=${page}&limit=${limit}`
      );
      console.log("Response while fetching recent activities:", response);
  
      if (!response.data.isSuccess) {
        return createApiResponse({
          isSuccess: false,
          statusCode: response.status,
          message: response.data.message,
          data: null,
        });
      }
  
      return createApiResponse({
        isSuccess: true,
        statusCode: response.status,
        message: "Recent activities fetched successfully",
        data: response.data.data,
      });
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      return createApiResponse({
        isSuccess: false,
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || "Internal Server Error",
        data: null,
      });
    }
  };