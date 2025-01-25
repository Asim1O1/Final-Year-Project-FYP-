import axios from "axios";

import createApiResponse from "../../utils/createApiResponse";
import axiosInstance from "../../utils/axiosInstance";

const addHospitalService = async (hospitalData) => {
  try {
    const response = await axiosInstance.post(
      `/api/hospitals/addHospital`,
      hospitalData
    );
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

const hospitalService = {
  addHospitalService,
};

export default hospitalService;
