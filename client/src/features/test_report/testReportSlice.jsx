import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import createApiResponse from "../../utils/createApiResponse";
import test_reportService from "../../services/test_report/test_report.service";

// **Upload Medical Report**
export const handleMedicalReportUpload = createAsyncThunk(
  "medicalTestReport/upload",
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await test_reportService.uploadMedicalReportService(
        reportData
      );
      if (!response.isSuccess) throw response;
      return response;
    } catch (error) {
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message: error?.message || "Failed to upload medical report",
          error: error?.error || null,
        })
      );
    }
  }
);

// **Fetch User Medical Reports**
export const fetchUserMedicalReports = createAsyncThunk(
  "medicalTestReport/fetchUserReports",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await test_reportService.fetchUserMedicalReportsService();
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch user medical reports")
      );
    }
  }
);

// **Fetch Hospital Medical Reports**
export const fetchHospitalMedicalReports = createAsyncThunk(
  "medicalTestReport/fetchHospitalReports",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await test_reportService.fetchHospitalMedicalReportsService();
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch hospital medical reports")
      );
    }
  }
);

// **Download Medical Report**
export const handleDownloadMedicalReport = createAsyncThunk(
  "medicalTestReport/download",
  async (reportId, { rejectWithValue }) => {
    try {
      await test_reportService.downloadReportService(reportId);
      return { reportId, message: "Report downloaded successfully" };
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to download medical report")
      );
    }
  }
);

// **Delete Medical Report**
export const handleMedicalReportDeletion = createAsyncThunk(
  "medicalTestReport/delete",
  async (reportId, { rejectWithValue }) => {
    try {
      const response = await test_reportService.deleteReportService(reportId);
      if (!response.isSuccess) throw response;
      return { reportId, message: response.message };
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to delete medical report")
      );
    }
  }
);

export const fetchUserCompletedTests = createAsyncThunk(
  "medicalTestReport/fetchUserCompletedTests",
  async (email, { rejectWithValue }) => {
    try {
      const response =
        await test_reportService.fetchCompletedTestsByEmailService(email);
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch user completed tests")
      );
    }
  }
);

const testReportSlice = createSlice({
  name: "medicalTestReport",
  initialState: {
    reports: [],
    completedTests: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetMedicalReportState: (state) => {
      state.reports = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.isLoading = true;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    };

    builder
      .addCase(handleMedicalReportUpload.pending, handlePending)
      .addCase(handleMedicalReportUpload.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports.push(action.payload);
        state.error = null;
      })
      .addCase(handleMedicalReportUpload.rejected, handleRejected);

    builder
      .addCase(fetchUserMedicalReports.pending, handlePending)
      .addCase(fetchUserMedicalReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload;
        state.error = null;
      })
      .addCase(fetchUserMedicalReports.rejected, handleRejected);

    builder
      .addCase(fetchHospitalMedicalReports.pending, handlePending)
      .addCase(fetchHospitalMedicalReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload;
        state.error = null;
      })
      .addCase(fetchHospitalMedicalReports.rejected, handleRejected);

    builder
      .addCase(handleDownloadMedicalReport.pending, handlePending)
      .addCase(handleDownloadMedicalReport.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(handleDownloadMedicalReport.rejected, handleRejected);

    builder
      .addCase(handleMedicalReportDeletion.pending, handlePending)
      .addCase(handleMedicalReportDeletion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = state.reports.filter(
          (report) => report.id !== action.payload.reportId
        );
        state.error = null;
      })
      .addCase(handleMedicalReportDeletion.rejected, handleRejected);

    builder
      .addCase(fetchUserCompletedTests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserCompletedTests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.completedTests = action.payload;
        state.error = null;
      })
      .addCase(fetchUserCompletedTests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetMedicalReportState } = testReportSlice.actions;
export default testReportSlice.reducer;
