import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import doctorService from "../../services/doctor/doctor.service";
import createApiResponse from "../../utils/createApiResponse";

export const handleDoctorRegistration = createAsyncThunk(
  "doctor/addDoctor",
  async (doctorData, { rejectWithValue }) => {
    console.log("Entered the handle doctor registration", doctorData);
    try {
      const response = await doctorService.createDoctorService(doctorData);
      console.log("The response is", response);
      if (!response.isSuccess) throw response;
      return response;
    } catch (error) {
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message:
            error?.message || "Failed to register doctor. Please try again.",
          error: error?.error || null,
        })
      );
    }
  }
);

// **Update Doctor**
export const handleDoctorUpdate = createAsyncThunk(
  "doctor/updateDoctor",
  async ({ doctorId, doctorData }, { rejectWithValue }) => {
    try {
      const response = await doctorService.updateDoctorService(
        doctorId,
        doctorData
      );
      console.log(
        "The response in the handle doctor update slice is ",
        response
      );
      if (!response.isSuccess) throw response?.data;
      return response;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to update doctor")
      );
    }
  }
);

// **Delete Doctor**
export const handleDoctorDeletion = createAsyncThunk(
  "doctor/deleteDoctor",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await doctorService.deleteDoctorService(doctorId);
      if (!response.isSuccess) throw response;
      return { doctorId, message: response.message };
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to delete doctor")
      );
    }
  }
);

// **Fetch All Doctors**
export const fetchAllDoctors = createAsyncThunk(
  "doctor/fetchAllDoctors",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await doctorService.getAllDoctorsService(params);

      if (!response.isSuccess) throw response?.data;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch doctors")
      );
    }
  }
);

// **Fetch Doctors by Specialization**
export const fetchDoctorsBySpecialization = createAsyncThunk(
  "doctor/fetchDoctorsBySpecialization",
  async ({ specialization, filters = {} }, { rejectWithValue }) => {
    try {
      console.log(
        "Fetching doctors for:",
        specialization,
        "with filters:",
        filters
      );

      // Normalize filters to match API expectations
      const apiParams = {
        page: filters.page || 1,
        limit: filters.limit || 10,
        search: filters.searchQuery || "",
        minFee: filters.feeRange?.[0] || 0,
        maxFee: filters.feeRange?.[1] || 500,
        sort: filters.sortOption || "recommended",
        experience: [],
      };

      // Convert experience filter to API format
      if (filters.experienceFilter) {
        const { novice, intermediate, expert } = filters.experienceFilter;
        if (novice) apiParams.experience.push("novice");
        if (intermediate) apiParams.experience.push("intermediate");
        if (expert) apiParams.experience.push("expert");
      }

      const response = await doctorService.getDoctorsBySpecialization(
        specialization,
        apiParams
      );

      if (!response.isSuccess) {
        console.error("API Error:", response);
        throw response;
      }

      return {
        doctors: response.data.doctors,
        pagination: response.data.pagination,
        filters, // Return current filters to store them in state
      };
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      return rejectWithValue({
        message: error.message || "Failed to fetch doctors by specialization",
        error: error.error || error,
        status: error.statusCode,
      });
    }
  }
);

// **Fetch Single Doctor**
export const fetchSingleDoctor = createAsyncThunk(
  "doctor/fetchSingleDoctor",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorByIdService(doctorId);
      console.log("The response while fetching doctor details:", response);
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch doctor details")
      );
    }
  }
);

export const fetchDoctorDashboardStats = createAsyncThunk(
  "doctor/fetchDoctorDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorDashboardStatsService();

      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch doctor dashboard statistics")
      );
    }
  }
);

export const fetchDoctorAppointmentsSummary = createAsyncThunk(
  "doctor/fetchDoctorAppointmentsSummary",
  async (_, { rejectWithValue }) => {
    console.log("ENTERED  ");
    try {
      const response = await doctorService.getDoctorAppointmentsSummary();
      console.log("The response is", response);
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      console.log("The error is", error);
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch appointment summary")
      );
    }
  }
);

const doctorSlice = createSlice({
  name: "doctorSlice",
  initialState: {
    doctor: null,
    doctors: [],
    doctorStats: null,
    appointmentsSummary: {
      todayCount: 0,
      upcomingCount: 0,
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    resetDoctorState: (state) => {
      state.doctor = null;
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
      .addCase(handleDoctorRegistration.pending, handlePending)
      .addCase(handleDoctorRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctor = action.payload;
        state.error = null;
      })
      .addCase(handleDoctorRegistration.rejected, handleRejected);

    builder
      .addCase(handleDoctorUpdate.pending, handlePending)
      .addCase(handleDoctorUpdate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctor = action.payload;
        state.error = null;
      })
      .addCase(handleDoctorUpdate.rejected, handleRejected);

    builder
      .addCase(handleDoctorDeletion.pending, handlePending)
      .addCase(handleDoctorDeletion.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(state.doctors)) {
          state.doctors = state.doctors.filter(
            (doctor) => doctor.id !== action.payload.doctorId
          );
        } else {
          state.doctors = [];
        }
        state.error = null;
      })
      .addCase(handleDoctorDeletion.rejected, handleRejected);

    builder
      .addCase(fetchAllDoctors.pending, handlePending)
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctors = action.payload;
        state.error = null;
      })
      .addCase(fetchAllDoctors.rejected, handleRejected);

    builder
      .addCase(fetchSingleDoctor.pending, handlePending)
      .addCase(fetchSingleDoctor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctor = action.payload;
        state.error = null;
      })
      .addCase(fetchSingleDoctor.rejected, handleRejected);
    builder
      .addCase(fetchDoctorsBySpecialization.pending, handlePending)
      .addCase(fetchDoctorsBySpecialization.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctors = action.payload;
        state.error = null;
      })
      .addCase(fetchDoctorsBySpecialization.rejected, handleRejected);

    builder
      .addCase(fetchDoctorDashboardStats.pending, handlePending)
      .addCase(fetchDoctorDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctorStats = action.payload;
        state.error = null;
      })
      .addCase(fetchDoctorDashboardStats.rejected, handleRejected);

    builder
      .addCase(fetchDoctorAppointmentsSummary.pending, handlePending)

      .addCase(fetchDoctorAppointmentsSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointmentsSummary = action.payload;
        state.error = null;
      })
      .addCase(fetchDoctorAppointmentsSummary.rejected, handleRejected);
  },
});

export const { resetDoctorState } = doctorSlice.actions;
export default doctorSlice.reducer;
