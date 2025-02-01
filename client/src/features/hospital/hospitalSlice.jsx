import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import hospitalService from "../../services/hospital/hospital.service";
import createApiResponse from "../../utils/createApiResponse";

export const handleHospitalRegistration = createAsyncThunk(
  "hospital/addHospital",
  async (hospitalData, { rejectWithValue }) => {
    try {
      const response = await hospitalService.addHospitalService(hospitalData);

      if (!response.isSuccess) {
        throw createApiResponse({
          isSuccess: false,
          message: response.message || "Hospital registration failed",
          error: response.error || null,
        });
      }

      return response;
    } catch (error) {
      console.error("Hospital Registration Error:", error);
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message:
            error?.message || "Failed to register hospital. Please try again.",
          error: error?.error || null,
        })
      );
    }
  }
);

// Update Hospital
export const handleHospitalUpdate = createAsyncThunk(
  "hospital/updateHospital",
  async ({ hospitalId, hospitalData }, { rejectWithValue }) => {
    try {
      console.log("ENTERED HOSPITAL UPDATE THUNK");
      console.log(
        "The hospital id we are sending to the backend is ",
        hospitalId
      );
      console.log("The data we are sending to teh backend is", hospitalData);
      const response = await hospitalService.updateHospitalService(
        hospitalId,
        hospitalData
      );
      if (!response.isSuccess) {
        throw createApiResponse({
          isSuccess: false,
          message: response.message || "Hospital update failed",
          error: response.error || null,
        });
      }
      return response;
    } catch (error) {
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message:
            error?.message || "Failed to update hospital. Please try again.",
          error: error?.error || null,
        })
      );
    }
  }
);

// Delete Hospital
export const handleHospitalDeletion = createAsyncThunk(
  "hospital/deleteHospital",
  async (hospitalId, { rejectWithValue }) => {
    try {
      const response = await hospitalService.deleteHospitalService(hospitalId);
      if (!response.isSuccess) {
        throw createApiResponse({
          isSuccess: false,
          message: response.message || "Hospital deletion failed",
          error: response.error || null,
        });
      }
      return { hospitalId, message: response.message };
    } catch (error) {
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message:
            error?.message || "Failed to delete hospital. Please try again.",
          error: error?.error || null,
        })
      );
    }
  }
);

export const fetchAllHospitals = createAsyncThunk(
  "hospital/fetchAllHospitals",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await hospitalService.fetchHospitalsService(page, limit);

      if (!response.isSuccess) {
        throw response;
      }
      console.log("The hospitals in the async thubk ", response);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSingleHospital = createAsyncThunk(
  "hospital/fetchSingleHospital",
  async (hospitalId, { rejectWithValue }) => {
    try {
      const response = await hospitalService.fetchSingleHospitalService(
        hospitalId
      );
      if (!response.isSuccess) {
        throw response;
      }
      return response.data; // Return the hospital data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const hospitalSlice = createSlice({
  name: "hospitalSlice",
  initialState: {
    hospital: null, // For a single hospital record
    hospitals: [], // For a list of hospitals
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },

  reducers: {
    resetHospitalState: (state) => {
      state.hospital = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.isLoading = true;
      state.error = null;
    };

    const handleFulfilled = (state, action) => {
      state.isLoading = false;
      state.hospital = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    };

    builder
      .addCase(handleHospitalRegistration.pending, handlePending)
      .addCase(handleHospitalRegistration.fulfilled, handleFulfilled)
      .addCase(handleHospitalRegistration.rejected, handleRejected);

    // Update Hospital
    builder
      .addCase(handleHospitalUpdate.pending, handlePending)
      .addCase(handleHospitalUpdate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hospital = action.payload;
        state.error = null;
      })
      .addCase(handleHospitalUpdate.rejected, handleRejected);

    builder
      .addCase(handleHospitalDeletion.pending, handlePending)
      .addCase(handleHospitalDeletion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hospitals = state.hospitals.filter(
          (hospital) => hospital.id !== action.payload.hospitalId
        );
        state.error = null;
      })

      .addCase(handleHospitalDeletion.rejected, handleRejected);

    builder
      .addCase(fetchAllHospitals.pending, handlePending)
      .addCase(fetchAllHospitals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hospitals = action.payload;
        state.error = null;
      })

      .addCase(fetchAllHospitals.rejected, handleRejected);
    builder
      .addCase(fetchSingleHospital.pending, handlePending)
      .addCase(fetchSingleHospital.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hospital = action.payload; // Store the fetched hospital
        state.error = null;
      })
      .addCase(fetchSingleHospital.rejected, handleRejected);
  },
});

export const { resetHospitalState } = hospitalSlice.actions;

export default hospitalSlice.reducer;
