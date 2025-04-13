import axios from "axios";

import createApiResponse from "../../utils/createApiResponse";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_BACKEND_URL } from "../../../constants";

const addHospitalService = async (hospitalData) => {
  try {
    const response = await axiosInstance.post(`/api/hospitals/`, hospitalData);
    console.log("The hospital data received is", hospitalData);
    console.log("The response in the addHospitalService was: ", response);

    if (response?.data?.isSuccess === false) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Hospital registration failed",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "Hospital registration successful",
      data: response?.data,
    });
  } catch (error) {
    console.error("Error in addHospitalService function:", error?.response);
    const errorMessage =
      error?.response?.data?.error?.[0] ||
      error?.response?.data?.message ||
      "An error occurred during registration.";

    return createApiResponse({
      isSuccess: false,

      error: errorMessage,
    });
  }
};

// Update Hospital
const updateHospitalService = async (hospitalId, hospitalData) => {
  try {
    console.log("ENTERED UPDATE HOSPITAL SERVICE");
    console.log("hospitalId: ", hospitalId);
    console.log("hospitalData: ", hospitalData);
    const response = await axiosInstance.put(
      `/api/hospitals/${hospitalId}`,
      hospitalData
    );
    if (response?.data?.isSuccess === false) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Hospital update failed",
        error: response?.data?.error || null,
      });
    }
    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "Hospital updated successfully",
      data: response?.data,
    });
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error?.[0] ||
      error?.response?.data?.message ||
      "An error occurred during the update.";
    return createApiResponse({
      isSuccess: false,
      error: errorMessage,
    });
  }
};

// Delete Hospital
const deleteHospitalService = async (hospitalId) => {
  try {
    const response = await axiosInstance.delete(`/api/hospitals/${hospitalId}`);
    if (response?.data?.isSuccess === false) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Hospital deletion failed",
        error: response?.data?.error || null,
      });
    }
    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "Hospital deleted successfully",
    });
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error?.[0] ||
      error?.response?.data?.message ||
      "An error occurred during deletion.";
    return createApiResponse({
      isSuccess: false,
      error: errorMessage,
    });
  }
};

const fetchHospitalsService = async ({
  page,
  limit,
  sort,
  search,
  speciality,
} = {}) => {
  try {
    const response = await axios.get(`${BASE_BACKEND_URL}/api/hospitals`, {
      params: {
        ...(page && { page }),
        ...(limit && { limit }),
        ...(sort && { sort }),
        ...(search && { search }),
        ...(speciality && { speciality }),
      },
    });

    // Check if the response is a failure case
    if (!response.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response.data?.message || "Failed to fetch hospitals",
        error: response.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: response.data?.message || "Hospitals fetched successfully",
      data: response.data?.data,
    });
  } catch (error) {
    console.error("❌ Error in fetchHospitalsService function:", error);
    const errorMessage =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "An error occurred while fetching hospitals.";

    return createApiResponse({
      isSuccess: false,
      message: errorMessage,
    });
  }
};

const fetchSingleHospitalService = async (hospitalId) => {
  try {
    // Validate input
    if (!hospitalId || typeof hospitalId !== "string") {
      throw new Error("Invalid hospital ID provided");
    }

    const response = await axios.get(
      `${BASE_BACKEND_URL}/api/hospitals/${hospitalId}`
    );

    // Check if the response was successful
    if (!response.data?.isSuccess) {
      throw new Error(
        response.data?.message || "Failed to fetch hospital details"
      );
    }

    // Return the data directly (no res.status.json() for service functions)
    return {
      isSuccess: true,
      message:
        response.data?.message || "Hospital details fetched successfully",
      data: response.data?.data,
    };
  } catch (error) {
    console.error("Error in fetchSingleHospitalService:", error);

    // Throw error to be handled by the caller
    throw {
      isSuccess: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching hospital details",
      error: error.response?.data?.error || null,
    };
  }
};

const hospitalService = {
  addHospitalService,
  updateHospitalService,
  deleteHospitalService,
  fetchHospitalsService,
  fetchSingleHospitalService,
};

export default hospitalService;
