import axiosInstance from "../../utils/axiosInstance";
import createApiResponse from "../../utils/createApiResponse";

export const createHospitalAdminService = async (admindata) => {
  try {
    const response = await axiosInstance.post(`/api/hospitalAdmin`, admindata);
    console.log("The response while creating hospital admin is", response);

    if (response?.data?.isSuccess === false) {
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "",
        data: response?.data?.error,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "Hospital admin created successfully",
      data: response?.data,
    });
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error?.[0]?.message ||
      error?.response?.data?.message ||
      "An error occurred during creating hospital admin.";

    return createApiResponse({
      isSuccess: false,
      message: errorMessage,
    });
  }
};

export const updateHospitalAdminService = async (adminId, updatedData) => {
  try {
    console.log("The admin id is", adminId);
    const response = await axiosInstance.put(
      `/api/hospitalAdmin/${adminId}`,
      updatedData
    );
    console.log("The response while updating hospital admin is", response);

    if (response?.data?.isSuccess === false) {
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "",
        data: response?.data?.error,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "Hospital admin updated successfully",
      data: response?.data,
    });
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error?.[0]?.message ||
      error?.response?.data?.message ||
      "An error occurred during updating hospital admin.";

    return createApiResponse({
      isSuccess: false,
      message: errorMessage,
    });
  }
};

// Delete Hospital Admin
export const deleteHospitalAdminService = async (adminId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/hospitalAdmin/${adminId}`
    );
    console.log("The response while deleting hospital admin is", response);

    if (response?.data?.isSuccess === false) {
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "",
        data: response?.data?.error,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "Hospital admin deleted successfully",
      data: response?.data,
    });
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error?.[0]?.message ||
      error?.response?.data?.message ||
      "An error occurred during deleting hospital admin.";

    return createApiResponse({
      isSuccess: false,
      message: errorMessage,
    });
  }
};

// Get Hospital Admin by ID
export const getHospitalAdminByIdService = async (adminId) => {
  try {
    const response = await axiosInstance.get(`/api/hospitalAdmin/${adminId}`);
    console.log(
      "The response while fetching hospital admin by ID is",
      response
    );

    if (response?.data?.isSuccess === false) {
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "",
        data: response?.data?.error,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message:
        response?.data?.message || "Hospital admin retrieved successfully",
      data: response?.data,
    });
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error?.[0]?.message ||
      error?.response?.data?.message ||
      "An error occurred during fetching hospital admin.";

    return createApiResponse({
      isSuccess: false,
      message: errorMessage,
    });
  }
};

export const getAllHospitalAdminsService = async (queryParams = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      search = "",
    } = queryParams;

    // Build query parameters
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    params.append("sort", sort);
    if (search) params.append("search", search);

    const response = await axiosInstance.get(
      `/api/hospitalAdmin?${params.toString()}`
    );

    console.log("📦 Hospital Admins Response:", response?.data);

    if (!response.data?.isSuccess) {
      return createApiResponse({
        isSuccess: false,
        statusCode: response.status,
        message: response.data?.message || "Failed to retrieve hospital admins",
        data: null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      statusCode: response.status,
      message:
        response.data?.message || "Hospital admins retrieved successfully",
      data: {
        hospitalAdmins:
          response.data?.data?.hospitalAdmins || response.data?.data || [],
        pagination: response.data?.data?.pagination || null,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching hospital admins:", error);

    // Extract error message from different possible locations
    const errorMessage =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred while fetching hospital admins";

    return createApiResponse({
      isSuccess: false,
      statusCode: error.response?.status || 500,
      message: errorMessage,
      data: null,
    });
  }
};
