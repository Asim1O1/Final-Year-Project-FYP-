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
      console.log("The response in the handle doctor update slice is ", response);
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
      console.log("The response while dinf fetcgAll doctors in thun", response)
      
      if (!response.isSuccess) throw response?.data;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch doctors")
      );
    }
  }
);

// **Fetch Single Doctor**
export const fetchSingleDoctor = createAsyncThunk(
  "doctor/fetchSingleDoctor",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await doctorService.fetchSingleDoctorService(doctorId);
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch doctor details")
      );
    }
  }
);

const doctorSlice = createSlice({
  name: "doctorSlice",
  initialState: {
    doctor: null,
    doctors: [],
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
  },
});

export const { resetDoctorState } = doctorSlice.actions;
export default doctorSlice.reducer;
