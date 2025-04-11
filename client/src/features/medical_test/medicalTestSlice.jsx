import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import medicalTestService from "../../services/medical_test/medical_test.service";
import createApiResponse from "../../utils/createApiResponse";

export const createMedicalTest = createAsyncThunk(
  "medicalTest/createMedicalTest",
  async (testData, { rejectWithValue }) => {
    try {
      const response = await medicalTestService.createMedicalTestService(
        testData
      );
      if (!response.isSuccess) throw response;
      return response;
    } catch (error) {
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message:
            error?.message ||
            "Failed to create medical test. Please try again.",
          error: error?.error || null,
        })
      );
    }
  }
);

export const fetchAllMedicalTests = createAsyncThunk(
  "medicalTest/fetchAllMedicalTests",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await medicalTestService.getMedicalTestsService(params);
      if (!response.isSuccess) throw response?.data;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch medical tests")
      );
    }
  }
);

export const fetchSingleMedicalTest = createAsyncThunk(
  "medicalTest/fetchSingleMedicalTest",
  async (testId, { rejectWithValue }) => {
    try {
      const response = await medicalTestService.getMedicalTestByIdService(
        testId
      );
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch medical test details")
      );
    }
  }
);

export const updateMedicalTest = createAsyncThunk(
  "medicalTest/updateMedicalTest",
  async ({ testId, testData }, { rejectWithValue }) => {
    try {
      const response = await medicalTestService.updateMedicalTestService(
        testId,
        testData
      );
      if (!response.isSuccess) throw response;
      return response;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to update medical test")
      );
    }
  }
);

export const deleteMedicalTest = createAsyncThunk(
  "medicalTest/deleteMedicalTest",
  async (testId, { rejectWithValue }) => {
    try {
      const response = await medicalTestService.deleteMedicalTestService(
        testId
      );
      if (!response.isSuccess) throw response;
      return { testId, message: response.message };
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to delete medical test")
      );
    }
  }
);

export const bulkDeleteMedicalTests = createAsyncThunk(
  "medicalTest/bulkDeleteMedicalTests",
  async (testIds, { rejectWithValue }) => {
    try {
      const response = await medicalTestService.bulkDeleteMedicalTestsService(
        testIds
      );
      if (!response.isSuccess) throw response;
      return response;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to bulk delete medical tests")
      );
    }
  }
);

export const bookMedicalTest = createAsyncThunk(
  "testBooking/bookMedicalTest",
  async (bookingData, { rejectWithValue }) => {
    console.log("entered the book test slice thunk func");
    console.log("The booking data is", bookingData);
    try {
      const response = await medicalTestService.bookMedicalTestService(
        bookingData
      );
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      console.log("The error is", error);
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message:
            error?.message || "Failed to book medical test. Please try again.",
          error: error?.error || null,
        })
      );
    }
  }
);

export const fetchHospitalTestBookings = createAsyncThunk(
  "testBooking/fetchHospitalTestBookings",
  async ({ hospitalId, filters = {} }, { rejectWithValue }) => {
    console.log(
      "entered the fetch hospital test bookings slice thunk func",
      hospitalId,
      filters
    );
    try {
      const response = await medicalTestService.getHospitalTestBookingsService(
        hospitalId,
        filters
      );
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message: error?.message || "Failed to fetch hospital test bookings",
          error: error?.error || null,
        })
      );
    }
  }
);

// Update test booking status (admin action)
export const updateTestBookingStatus = createAsyncThunk(
  "testBooking/updateTestBookingStatus",
  async ({ bookingId, status }, { rejectWithValue }) => {
    console.log(
      "entered the update test booking status slice thunk func",
      bookingId,
      status
    );
    try {
      const response = await medicalTestService.updateTestBookingStatusService(
        bookingId,
        status
      );
      console.log("The response is", response);

      if (!response.isSuccess) throw response;
      return response;
    } catch (error) {
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message: error?.message || "Failed to update booking status",
          error: error?.error || null,
        })
      );
    }
  }
);

// Fetch user test bookings
export const fetchUserTestBookings = createAsyncThunk(
  "testBooking/fetchUserTestBookings",
  async ({ userId, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await medicalTestService.getUserTestBookingsService(
        userId,
        filters
      );
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message: error?.message || "Failed to fetch user test bookings",
          error: error?.error || null,
        })
      );
    }
  }
);

const medicalTestSlice = createSlice({
  name: "medicalTestSlice",
  initialState: {
    medicalTest: null,
    booking: null,
    userBookings: [],
    hospitalBookings: [],
    medicalTests: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetMedicalTestState: (state) => {
      state.medicalTest = null;
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
      .addCase(createMedicalTest.pending, handlePending)
      .addCase(createMedicalTest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medicalTest = action.payload;
        state.error = null;
      })
      .addCase(createMedicalTest.rejected, handleRejected);

    builder
      .addCase(bookMedicalTest.pending, handlePending)
      .addCase(bookMedicalTest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.booking = action.payload;
        state.error = null;
      })
      .addCase(bookMedicalTest.rejected, handleRejected);

    builder
      .addCase(fetchAllMedicalTests.pending, handlePending)
      .addCase(fetchAllMedicalTests.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("The action.payload is", action.payload);
        state.medicalTests = Array.isArray(action?.payload?.data)
          ? action?.payload
          : [];
        state.error = null;
      })
      .addCase(fetchAllMedicalTests.rejected, handleRejected);

    builder
      .addCase(fetchSingleMedicalTest.pending, handlePending)
      .addCase(fetchSingleMedicalTest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medicalTest = action.payload;
        state.error = null;
      })
      .addCase(fetchSingleMedicalTest.rejected, handleRejected);

    builder
      .addCase(updateMedicalTest.pending, handlePending)
      .addCase(updateMedicalTest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medicalTest = action.payload;
        state.error = null;
      })
      .addCase(updateMedicalTest.rejected, handleRejected);

    builder
      .addCase(deleteMedicalTest.pending, handlePending)
      .addCase(deleteMedicalTest.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("state.medicalTests before update:", state?.medicalTests);
        console.log("The action.payload while deleting is", action.payload);

        // Ensure medicalTests is an array before calling filter
        if (!Array.isArray(state.medicalTests)) {
          state.medicalTests = [];
        }

        state.medicalTests = state.medicalTests.filter(
          (test) => test.id !== action?.payload?.testId
        );

        state.error = null;
      })

      .addCase(deleteMedicalTest.rejected, handleRejected);

    builder
      .addCase(bulkDeleteMedicalTests.pending, handlePending)
      .addCase(bulkDeleteMedicalTests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(bulkDeleteMedicalTests.rejected, handleRejected);

    // Hospital bookings
    builder
      .addCase(fetchHospitalTestBookings.pending, handlePending)
      .addCase(fetchHospitalTestBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hospitalBookings =
          action.payload.bookings || action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchHospitalTestBookings.rejected, handleRejected);

    // Update booking status
    builder
      .addCase(updateTestBookingStatus.pending, handlePending)
      .addCase(updateTestBookingStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("The action.payload is", action.payload);
        if (Array.isArray(state.hospitalBookings)) {
          state.hospitalBookings = state.hospitalBookings.map((booking) =>
            booking._id === action.payload._id ? action.payload : booking
          );
        } else {
          state.hospitalBookings = [action.payload]; // Initialize as array if it wasn't
        }

        // Safely handle userBookings
        if (Array.isArray(state.userBookings)) {
          state.userBookings = state.userBookings.map((booking) =>
            booking._id === action.payload._id ? action.payload : booking
          );
        }
        state.error = null;
      })
      .addCase(updateTestBookingStatus.rejected, handleRejected);

    // User bookings
    builder
      .addCase(fetchUserTestBookings.pending, handlePending)
      .addCase(fetchUserTestBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userBookings = action.payload || [];
        state.error = null;
      })
      .addCase(fetchUserTestBookings.rejected, handleRejected);
  },
});

export const { resetMedicalTestState } = medicalTestSlice.actions;
export default medicalTestSlice.reducer;
