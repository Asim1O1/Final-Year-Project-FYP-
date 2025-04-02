import axiosInstance from "../../utils/axiosInstance";
import createApiResponse from "../../utils/createApiResponse";

const uploadMedicalReportService = async (report) => {
  try {
    const response = await axiosInstance.post("/api/report/", report, );
    
    console.log("Response while uploading medical report:", response);
    if (response?.data?.isSuccess === false) {
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "",
        data: response?.data?.error,
      });
    }
    return createApiResponse({
      isSuccess: true,
      message: "Medical report uploaded successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    console.error("Error uploading medical report:", error);
    return createApiResponse({
      isSuccess: false,
      message: "Error uploading medical report",
      data: error?.response?.data || error,
    });
  }
};

const fetchUserMedicalReportsService = async () => {
  try {
    const response = await axiosInstance.get("/api/report/userReport");
    if (response?.data?.isSuccess === false) {
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "",
        data: response?.data?.error,
      });
    }
    return createApiResponse({
      isSuccess: true,
      message: "User medical reports fetched successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    console.error("Error fetching user reports:", error);
    return createApiResponse({
      isSuccess: false,
      message: "Error fetching user reports",
      data: error?.response?.data || error,
    });
  }
};

const fetchHospitalMedicalReportsService = async () => {
  try {
    const response = await axiosInstance.get("/api/report/hospitalReport");
    if (response?.data?.isSuccess === false) {
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "",
        data: response?.data?.error,
      });
    }
    return createApiResponse({
      isSuccess: true,
      message: "Hospital medical reports fetched successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    console.error("Error fetching hospital reports:", error);
    return createApiResponse({
      isSuccess: false,
      message: "Error fetching hospital reports",
      data: error?.response?.data || error,
    });
  }
};

const downloadReportService = async (reportId) => {
  try {
    const response = await axiosInstance.get(
      `/api/report/download/${reportId}`,
      {
        responseType: "blob", // Ensure the response is treated as a file
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Medical_Report_${reportId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return createApiResponse({
      isSuccess: true,
      message: "Report downloaded successfully",
    });
  } catch (error) {
    console.error("Error downloading report:", error);
    return createApiResponse({
      isSuccess: false,
      message: "Error downloading report",
      data: error?.response?.data || error,
    });
  }
};
const fetchCompletedTestsByEmailService = async (email) => {
  try {
    const response = await axiosInstance.get("/api/report/completed-tests",{
      params: { email },
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
      message: "Completed tests fetched successfully",
      data: response?.data?.data,
    });
  } catch (error) {
    console.error("Error fetching completed tests:", error);
    return createApiResponse({
      isSuccess: false,
      message: "Error fetching completed tests",
      data: error?.response?.data || error,
    });
  }
};

const deleteReportService = async (reportId) => {
  try {
    const response = await axiosInstance.delete(`/api/report/${reportId}`);
    if (response?.data?.isSuccess === false) {
      return createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "",
        data: response?.data?.error,
      });
    }
    return createApiResponse({
      isSuccess: true,
      message: "Medical report deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    return createApiResponse({
      isSuccess: false,
      message: "Error deleting report",
      data: error?.response?.data || error,
    });
  }
};

const test_reportService = {
  uploadMedicalReportService,
  fetchUserMedicalReportsService,
  fetchHospitalMedicalReportsService,
  downloadReportService,
  deleteReportService,
  fetchCompletedTestsByEmailService,
};

export default test_reportService;
