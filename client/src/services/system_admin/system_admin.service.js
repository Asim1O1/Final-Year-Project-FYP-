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
// Fetch all users with role "user"
const getUsersService = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `/api/systemAdmin/users?page=${page}&limit=${limit}`
    );

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
      message: "Users fetched successfully",
      data: response.data.data,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return createApiResponse({
      isSuccess: false,
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || "Internal Server Error",
      data: null,
    });
  }
};

// Fetch all doctors
const getDoctorsService = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `/api/systemAdmin/doctors?page=${page}&limit=${limit}`
    );

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
      message: "Doctors fetched successfully",
      data: response.data.data,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return createApiResponse({
      isSuccess: false,
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || "Internal Server Error",
      data: null,
    });
  }
};

// Deactivate an account (User, Doctor, Hospital Admin)
const accountStatusService = async (accountId, role) => {
  try {
    const response = await axiosInstance.patch(
      `/api/systemAdmin/accountStatus/${accountId}/${role}`
    );

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
      message: `${role} account deactivated successfully`,
      data: response.data,
    });
  } catch (error) {
    console.error(`Error deactivating ${role} account:`, error);
    return createApiResponse({
      isSuccess: false,
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || "Internal Server Error",
      data: null,
    });
  }
};

export const systemAdminService = {
  getAdminDashboardStatsService,
  getUsersService,
  getDoctorsService,
  accountStatusService,
};
export default systemAdminService;
