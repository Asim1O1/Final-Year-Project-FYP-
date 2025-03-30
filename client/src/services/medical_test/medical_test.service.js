import createApiResponse from "../../utils/createApiResponse";
import axiosInstance from "../../utils/axiosInstance";

const createMedicalTestService = async (testData) => {
  try {
    const response = await axiosInstance.post("/api/medicalTest/", testData);
    console.log("The response while creating medical test is", response);
    if (response?.data?.isSuccess === false) {
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "",
        data: response?.data?.error,
      });
    }
    return createApiResponse({
      isSuccess: true,
      message: "Medical test created successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error?.[0]?.message ||
      error?.response?.data?.message ||
      "An error occurred during creating medical test.";
    return createApiResponse({
      isSuccess: false,
      message: errorMessage,
    });
  }
};

const getMedicalTestByIdService = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/medicalTest/${id}`);
    if (response?.data?.isSuccess === false) {
        return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "",
        data: response?.data?.error,
      });
    }
    return createApiResponse({
      isSuccess: true,
      message: "Medical test fetched successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    return createApiResponse({
      isSuccess: false,
      message:
        error?.response?.data?.message ||
        "An error occurred while fetching the medical test.",
    });
  }
};

// Get multiple medical tests with pagination and filters
const getMedicalTestsService = async (params) => {
  try {
    const response = await axiosInstance.get("/api/medicalTest", { params });
    if (response?.data?.isSuccess === false) {
        return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "",
        data: response?.data?.error,
      });
    }
    return createApiResponse({
      isSuccess: true,
      message: "Medical tests fetched successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    return createApiResponse({
      isSuccess: false,
      message:
        error?.response?.data?.message ||
        "An error occurred while fetching medical tests.",
    });
  }
};

// Update a medical test by ID
const updateMedicalTestService = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(
      `/api/medicalTest/${id}`,
      updateData
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
      message: "Medical test updated successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    return createApiResponse({
      isSuccess: false,
      message:
        error?.response?.data?.message ||
        "An error occurred while updating the medical test.",
    });
  }
};

// Delete a single medical test by ID
const deleteMedicalTestService = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/medicalTest/${id}`);
    if (response?.data?.isSuccess === false) {
        return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "",
        data: response?.data?.error,
      });
    }
    return createApiResponse({
      isSuccess: true,
      message: "Medical test deleted successfully",
    });

 
  } catch (error) {
    return createApiResponse({
      isSuccess: false,
      message:
        error?.response?.data?.message ||
        "An error occurred while deleting the medical test.",
    });
  }
};

// Bulk delete multiple medical tests
const bulkDeleteMedicalTestsService = async (testIds) => {
  try {
    const response = await axiosInstance.delete("/api/medicalTest", {
      data: { testIds },
    });
    if (response?.data?.isSuccess === false) {
        return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "",
        data: response?.data?.error,
      });
    }
    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "Medical tests deleted successfully",
    });
  } catch (error) {
    return createApiResponse({
      isSuccess: false,
      message:
        error?.response?.data?.message ||
        "An error occurred while deleting medical tests.",
    });
  }
};

const medicalTestService = {
  createMedicalTestService,
  getMedicalTestByIdService,
  getMedicalTestsService,
  updateMedicalTestService,
  deleteMedicalTestService,
  bulkDeleteMedicalTestsService,
};

export default medicalTestService;
