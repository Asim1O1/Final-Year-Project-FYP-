import axiosInstance from "../../utils/axiosInstance";
import createApiResponse from "../../utils/createApiResponse";

const getAdminDashboardStatsService = async (req, res) => {
  try {
    const response = await axiosInstance.get("/api/systemAdmin/dashboardStats");
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
      message: "Dashboard stats fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return createApiResponse({
      isSuccess: false,
      statusCode: error.response.status,
      message: error.response.data.message,
      data: null,
    });
  }
};

export const systemAdminService = {
  getAdminDashboardStatsService,
};
export default systemAdminService;
