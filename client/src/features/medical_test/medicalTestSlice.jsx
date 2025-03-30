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

const medicalTestSlice = createSlice({
  name: "medicalTestSlice",
  initialState: {
    medicalTest: null,
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
      .addCase(fetchAllMedicalTests.pending, handlePending)
      .addCase(fetchAllMedicalTests.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("The action.payload is", action.payload);
        state.medicalTests = Array.isArray(action?.payload?.data) ? action?.payload : [];
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
  },
});

export const { resetMedicalTestState } = medicalTestSlice.actions;
export default medicalTestSlice.reducer;
