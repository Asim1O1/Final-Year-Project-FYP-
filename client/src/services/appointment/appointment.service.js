import axiosInstance from "../../utils/axiosInstance";
import createApiResponse from "../../utils/createApiResponse";

const bookAppointmentService = async (appointmentData) => {
  try {
    const response = await axiosInstance.post(
      `/api/appointments/book`,
      appointmentData
    );

    console.log("The appointment data sent is:", appointmentData);
    console.log("The response in bookAppointmentService:", response);

    if (!response?.data?.isSuccess) {
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Appointment booking failed",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "Appointment booked successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    console.error("Error in bookAppointmentService:", error?.response);

    return createApiResponse({
      isSuccess: false,
      message:
        error?.response?.data?.message ||
        "An error occurred while booking the appointment",
      error: error?.response?.data?.error || error.message,
    });
  }
};

const getUserAppointmentsService = async (userId, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `/api/appointments/user-appointments/${userId}`,
      {
        params: { page, limit }, // pass pagination as query params
      }
    );

    console.log("Fetching appointments for user:", userId);
    console.log("Response from getUserAppointmentsService:", response);

    if (!response?.data?.isSuccess) {
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to fetch user appointments",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message:
        response?.data?.message || "User appointments fetched successfully",
      data: response?.data?.data, // Includes appointments and pagination
    });
  } catch (error) {
    console.error("Error in getUserAppointmentsService:", error?.response);

    return createApiResponse({
      isSuccess: false,
      message:
        error?.response?.data?.message ||
        "An error occurred while fetching user appointments",
      error: error?.response?.data?.error || error.message,
    });
  }
};

const getDoctorAppointmentsService = async (doctorId, status = "all") => {
  console.log("The doc id is", doctorId);
  console.log("The status is", status);
  try {
    const response = await axiosInstance.get(
      `/api/appointments/doctor-appointments/${doctorId}`,
      {
        params: { status },
      }
    );

    console.log("Fetching appointments for doctor:", doctorId);
    console.log("Response from getDoctorAppointmentsService:", response);

    if (!response?.data?.isSuccess) {
      return createApiResponse({
        isSuccess: false,
        message:
          response?.data?.message || "Failed to fetch doctor appointments",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message:
        response?.data?.message || "Doctor appointments fetched successfully",
      data: response?.data?.data, // Extract the appointments data
    });
  } catch (error) {
    console.error("Error in getDoctorAppointmentsService:", error?.response);

    return createApiResponse({
      isSuccess: false,
      message:
        error?.response?.data?.message ||
        "An error occurred while fetching doctor appointments",
      error: error?.response?.data?.error || error.message,
    });
  }
};

const updateAppointmentStatusService = async (
  appointmentId,
  status,
  rejectionReason = "",
  paymentStatus = null
) => {
  try {
    // Fix status mapping
    const statusMap = {
      approved: "confirmed",
      rejected: "canceled",
    };

    const payload = {
      status: statusMap[status] || status,
    };

    if (payload.status === "canceled") {
      payload.rejectionReason = rejectionReason || "No reason provided";
    }

    if (paymentStatus) {
      payload.paymentStatus = paymentStatus; // Only include if provided
    }

    const response = await axiosInstance.patch(
      `/api/appointments/${appointmentId}/status`,
      payload
    );

    if (!response?.data?.isSuccess) {
      return createApiResponse({
        isSuccess: false,
        message:
          response?.data?.message || "Failed to update appointment status",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || `Appointment ${status} successfully`,
      data: response?.data?.data,
    });
  } catch (error) {
    console.error("Error in updateAppointmentStatusService:", error?.response);

    return createApiResponse({
      isSuccess: false,
      message:
        error?.response?.data?.message ||
        "An error occurred while updating the appointment status",
      error: error?.response?.data?.error || error.message,
    });
  }
};

const getAvailableTimeSlotsService = async (doctorId, date) => {
  try {
    const response = await axiosInstance.get(
      `/api/appointments/available-slots/${doctorId}/${date}`
    );

    console.log(
      "Fetching available time slots for doctor:",
      doctorId,
      "on",
      date
    );
    console.log("Response from getAvailableTimeSlotsService:", response);

    if (!response?.data?.isSuccess) {
      return createApiResponse({
        isSuccess: false,
        message:
          response?.data?.message || "Failed to fetch available time slots",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message:
        response?.data?.message || "Available slots fetched successfully",
      data: response?.data?.data, // Array of available time slots
    });
  } catch (error) {
    console.error("Error in getAvailableTimeSlotsService:", error?.response);

    return createApiResponse({
      isSuccess: false,
      message:
        error?.response?.data?.message ||
        "An error occurred while fetching available time slots",
      error: error?.response?.data?.error || error.message,
    });
  }
};

const getAppointmentById = async (appointmentId) => {
  try {
    const response = await axiosInstance.get(
      `/api/appointments/${appointmentId}`
    );
    console.log("Fetching appointment:", appointmentId);
    console.log("Response from getAppointmentById:", response);
    if (!response?.data?.isSuccess) {
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to fetch appointment",
        error: response?.data?.error || null,
      });
    }
    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "Appointment fetched successfully",
      data: response?.data?.data, // Extract the appointment data
    });
  } catch (error) {
    console.error("Error in getAppointmentById:", error?.response);
    return createApiResponse({
      isSuccess: false,
      message:
        error?.response?.data?.message ||
        "An error occurred while fetching appointment",
      error: error?.response?.data?.error || error.message,
    });
  }
};

const deleteAppointmentsService = async (appointmentIds) => {
  try {
    const response = await axiosInstance.post(`/api/appointments/delete`, {
      appointmentIds,
    });

    console.log("Deleting appointments:", appointmentIds);
    console.log("Response from deleteAppointmentsService:", response);

    if (!response?.data?.isSuccess) {
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to delete appointments",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      message: response?.data?.message || "Appointments deleted successfully",
      data: response?.data?.data, // Any returned data
    });
  } catch (error) {
    console.error("Error in deleteAppointmentsService:", error?.response);

    return createApiResponse({
      isSuccess: false,
      message:
        error?.response?.data?.message ||
        "An error occurred while deleting appointments",
      error: error?.response?.data?.error || error.message,
    });
  }
};

const appointmentService = {
  bookAppointmentService,
  getUserAppointmentsService,
  getDoctorAppointmentsService,
  updateAppointmentStatusService,
  getAvailableTimeSlotsService,
  getAppointmentById,
  deleteAppointmentsService,
};

export default appointmentService;
