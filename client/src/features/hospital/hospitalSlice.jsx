import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import hospitalService from "../../services/hospital/hospital.service";
import createApiResponse from "../../utils/createApiResponse";


export const handleHospitalRegistration = createAsyncThunk(
  "hospital/addHospital",
  async (hospitalData, { rejectWithValue }) => {
    try {
      const response = await hospitalService.addHospitalService(hospitalData);
      console.log(
        "The response in the handleHospitalRegistration was: ",
        response
      );
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

export const hospitalSlice = createSlice({
  name: "hospital",
  initialState: {
    hospital: null,
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
  },
});


