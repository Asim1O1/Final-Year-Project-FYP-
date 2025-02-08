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

// Get All Hospital Admins
export const getAllHospitalAdminsService = async (queryParams = {}) => {
  try {
    const { page = 1, limit = 10, sort = "createdAt" } = queryParams;
    const response = await axiosInstance.get(
      `/api/hospitalAdmin?page=${page}&limit=${limit}&sort=${sort}`
    );

    console.log("The response while fetching all hospital admins is", response);

    if (!response?.data?.isSuccess) {
      return createApiResponse({
        isSuccess: false,
        message: response.data.message || "Failed to retrieve hospital admins",
        data: response.data.error || null,
      });
    }



    return createApiResponse({
      isSuccess: true,
      message: response.data.message || "Hospital admins retrieved successfully",
    data: response.data
    });
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error?.[0]?.message ||
      error?.response?.data?.message ||
      "An error occurred during fetching hospital admins.";

    return createApiResponse({
      isSuccess: false,
      message: errorMessage,
    });
  }
};
