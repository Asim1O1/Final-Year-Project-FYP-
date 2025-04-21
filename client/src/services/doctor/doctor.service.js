import axios from "axios";
import createApiResponse from "../../utils/createApiResponse";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_BACKEND_URL } from "../../../constants";

const createDoctorService = async (doctorData) => {
  try {
    // Log the FormData to verify its contents
    for (let [key, value] of doctorData.entries()) {
      console.log(key, value);
    }

    // Send the FormData directly to the backend
    const response = await axiosInstance.post("/api/doctor/", doctorData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("The response while creating doctor is", response);

    // Check if the response is unsuccessful
    if (response?.data?.isSuccess === false) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Doctor registration failed",
        error: response?.data?.error || null,
      });
    }

    // Return success response
    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "Doctor registration successful",
      data: response?.data,
    });
  } catch (error) {
    console.error("Error creating doctor", error);
    console.error("Error in createDoctorService function:", error?.response);

    // Handle the error response
    const errorMessage =
      error?.response?.data?.error ||
      error?.response?.data?.error?.[0] ||
      error?.response?.data?.message ||
      "An error occurred during registration.";

    return createApiResponse({
      isSuccess: false,
      message: "An error occurred while creating the doctor",
      error: errorMessage,
    });
  }
};

// Update a doctor
const updateDoctorService = async (doctorId, doctorData) => {
  try {
    console.log(
      "The credentials in the update doctor service are",
      doctorId,
      doctorData
    );

    // Check if doctorData is an instance of FormData
    const headers = {};
    if (doctorData instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    }

    const response = await axiosInstance.put(
      `/api/doctor/${doctorId}`,
      doctorData,
      { headers }
    );

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to update doctor",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "Doctor updated successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    console.error("Error in updateDoctorService:", error);
    return createApiResponse({
      isSuccess: false,
      message: "An error occurred while updating the doctor",
      error:
        error?.response?.data?.error?.[0] ||
        error?.response?.data?.message ||
        "Something went wrong",
    });
  }
};

// Delete a doctor
const deleteDoctorService = async (doctorId) => {
  try {
    const response = await axiosInstance.delete(`/api/doctor/${doctorId}`);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to delete doctor",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "Doctor deleted successfully",
      data: response?.data?.result,
    });
  } catch (error) {
    return createApiResponse({
      isSuccess: false,
      message: "An error occurred while deleting the doctor",
      error:
        error?.response?.data?.error?.[0] ||
        error?.response?.data?.message ||
        "Something went wrong",
    });
  }
};

// Get a doctor by ID
const getDoctorByIdService = async (doctorId) => {
  try {
    const response = await axiosInstance.get(`/api/doctor/${doctorId}`);
    console.log("The response while fetching doctor by ID is", response);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Doctor not found",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: "Doctor retrieved successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    return createApiResponse({
      isSuccess: false,
      message: "An error occurred while fetching doctor details",
      error:
        error?.response?.data?.error?.[0] ||
        error?.response?.data?.message ||
        "Something went wrong",
    });
  }
};

// Get all doctors (with optional filters & pagination)
export const getAllDoctorsService = async (filters = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      hospital,
      search,
    } = filters;

    const queryParams = new URLSearchParams({
      page,
      limit,
      sort,
      ...(hospital && { hospital }),
      ...(search && { search }), // Add search if present
    }).toString();

    const response = await axios.get(
      `${BASE_BACKEND_URL}/api/doctor?${queryParams}`
    );

    console.log("The response while fetching all doctors is", response);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to retrieve doctors",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "Doctors retrieved successfully",
      data: {
        doctors: response?.data?.data,
        ...response?.data?.pagination,
      },
    });
  } catch (error) {
    return createApiResponse({
      isSuccess: false,
      message: "An error occurred while fetching doctors",
      error:
        error?.response?.data?.error?.[0] ||
        error?.response?.data?.message ||
        "Something went wrong",
    });
  }
};

const getDoctorsBySpecialization = async (specialization, filters = {}) => {
  try {
    console.log("Fetching doctors for specialization:", specialization);

    // Default parameters
    const {
      page = 1,
      limit = 10,
      search = "",
      experience = [],
      minFee = 0,
      maxFee = 500,
      sort = "recommended",
    } = filters;

    // Build query parameters
    const queryParams = new URLSearchParams({
      page,
      limit,
      search,
      minFee,
      maxFee,
      sort,
    });

    // Add experience filters if any
    if (experience.length > 0) {
      queryParams.append("experience", experience.join(","));
    }

    const response = await axios.get(
      `${BASE_BACKEND_URL}/api/doctor/specialization/${specialization}?${queryParams.toString()}`
    );

    console.log("Doctors API response:", response.data);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to retrieve doctors",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: "Doctors retrieved successfully",
      data: {
        doctors: response?.data?.data,
        pagination: {
          totalCount: response?.data?.pagination?.totalCount,
          currentPage: response?.data?.pagination?.currentPage,
          totalPages: response?.data?.pagination?.totalPages,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return createApiResponse({
      isSuccess: false,
      message: "An error occurred while fetching doctors",
      error:
        error?.response?.data?.error?.[0] ||
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong",
    });
  }
};

const getDoctorDashboardStatsService = async () => {
  try {
    const response = await axiosInstance.get("/api/doctor/dashboard/stats");

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to fetch dashboard stats",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message:
        response?.data?.message ||
        "Doctor dashboard stats fetched successfully",
      data: response?.data,
    });
  } catch (error) {
    console.error("Error in getDoctorDashboardStatsService:", error);
    return createApiResponse({
      isSuccess: false,
      message: "An error occurred while fetching dashboard stats",
      error:
        error?.response?.data?.error?.[0] ||
        error?.response?.data?.message ||
        "Something went wrong",
    });
  }
};

const getDoctorAppointmentsSummary = async () => {
  console.log("ENTERED");
  try {
    const response = await axiosInstance.get(
      "/api/doctor/appointments/summary"
    );
    console.log("The response is", response);
    return {
      isSuccess: true,
      data: response.data,
    };
  } catch (error) {
    console.log("The error is", error);
    return {
      isSuccess: false,
      message:
        error?.response?.data?.message || "Failed to fetch appointment summary",
      error: error?.response?.data || error,
    };
  }
};

const doctorService = {
  createDoctorService,
  updateDoctorService,
  deleteDoctorService,
  getDoctorByIdService,
  getAllDoctorsService,
  getDoctorsBySpecialization,
  getDoctorDashboardStatsService,
  getDoctorAppointmentsSummary,
};

export default doctorService;
