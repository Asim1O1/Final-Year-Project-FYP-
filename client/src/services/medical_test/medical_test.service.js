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

const getMedicalTestsService = async (filters = {}, isAdmin = false) => {
  try {
    // Extract parameters with defaults only for pagination/sort
    const {
      page = 1,
      limit = 10,
      sort = "createdAt_desc",
      hospital,
      search,
      testType,
      minPrice,
      maxPrice,
    } = filters;

    // Determine the endpoint based on whether this is an admin request
    const endpoint = isAdmin ? "/api/medicalTest/hospitalAdmin-tests" : "/api/medicalTest/";

    // Build base query parameters (always include pagination and sort)
    const queryParams = new URLSearchParams({
      page,
      limit,
      sort,
    });

    // Add optional filters only if they are provided
    if (!isAdmin && hospital) queryParams.append("hospital", hospital);
    if (search) queryParams.append("search", search);
    if (testType) queryParams.append("testType", testType);

    // Only add price range if both values are provided
    if (minPrice !== undefined && maxPrice !== undefined) {
      queryParams.append("minPrice", minPrice);
      queryParams.append("maxPrice", maxPrice);
    }

    const queryString = queryParams.toString();
    console.log(
      `Medical Test API Request (${isAdmin ? "Admin" : "Public"}):`,
      queryString
    );

    // Using the correct endpoint based on isAdmin flag
    const response = await axiosInstance.get(`${endpoint}?${queryString}`);

    if (response?.data?.isSuccess === false) {
      console.error("Medical Test API Error:", response.data);
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to fetch medical tests",
        error: response?.data?.error || null,
      });
    }

    console.log("Medical Test API Success:", {
      count: response?.data?.data?.tests?.length,
      total: response?.data?.data?.pagination?.totalCount,
    });

    return createApiResponse({
      isSuccess: true,
      message: "Medical tests fetched successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    console.error("Medical Test Service Error:", {
      message: error.message,
      response: error.response?.data,
    });

    return createApiResponse({
      isSuccess: false,
      message:
        error?.response?.data?.message ||
        "An error occurred while fetching medical tests",
      error: error?.response?.data?.error || error.message,
      status: error?.response?.status,
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

const bookMedicalTestService = async (bookingData) => {
  console.log("entered the book test service func");
  console.log("The booking data is", bookingData);
  try {
    const response = await axiosInstance.post(
      "/api/medicalTest/:testId/bookings",
      bookingData
    );

    if (response?.data?.isSuccess === false) {
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to book medical test",
        data: response?.data?.error,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: "Medical test booked successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    console.error("Error in bookMedicalTestService function:", error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "An error occurred while booking the medical test";
    return createApiResponse({
      isSuccess: false,
      message: errorMessage,
      data: error?.response?.data?.error || null,
    });
  }
};

const getHospitalTestBookingsService = async (hospitalId, filters = {}) => {
  try {
    const response = await axiosInstance.get(
      `/api/medicalTest/hospital-bookings/${hospitalId}`,
      {
        params: {
          ...filters,
          page: filters.page || 1,
          limit: filters.limit || 10,
        },
      }
    );

    if (response?.data?.isSuccess === false) {
      return createApiResponse({
        isSuccess: false,
        message:
          response?.data?.message || "Failed to fetch hospital test bookings",
        data: response?.data?.error,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: "Hospital test bookings fetched successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    console.error("Error in getHospitalTestBookingsService:", error);
    return createApiResponse({
      isSuccess: false,
      message:
        error?.response?.data?.message ||
        "Failed to fetch hospital test bookings",
      data: error?.response?.data?.error,
    });
  }
};

// Update test booking status (admin action)
const updateTestBookingStatusService = async (bookingId, status) => {
  console.log(
    "Entered the update test booking status service",
    bookingId,
    status
  );
  try {
    const response = await axiosInstance.put(
      `/api/medicalTest/${bookingId}/status`,
      { status: status }
    );

    if (response?.data?.isSuccess === false) {
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to update booking status",
        data: response?.data?.error,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: "Test booking status updated successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    console.error("Error in updateTestBookingStatusService:", error);
    return createApiResponse({
      isSuccess: false,
      message:
        error?.response?.data?.message || "Failed to update booking status",
      data: error?.response?.data?.error,
    });
  }
};

// Get all test bookings for a specific user
const getUserTestBookingsService = async (userId, filters = {}) => {
  try {
    const response = await axiosInstance.get(`/api/medicalTest/user-bookings`, {
      params: filters,
    });

    if (response?.data?.isSuccess === false) {
      return createApiResponse({
        isSuccess: false,
        message:
          response?.data?.message || "Failed to fetch user test bookings",
        data: response?.data?.error,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: "User test bookings fetched successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    console.error("Error in getUserTestBookingsService:", error);
    return createApiResponse({
      isSuccess: false,
      message:
        error?.response?.data?.message || "Failed to fetch user test bookings",
      data: error?.response?.data?.error,
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
  bookMedicalTestService,
  getHospitalTestBookingsService,
  updateTestBookingStatusService,
  getUserTestBookingsService,
};

export default medicalTestService;
