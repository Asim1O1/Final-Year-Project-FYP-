import systemAdminService from "../../services/system_admin/system_admin.service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import createApiResponse from "../../utils/createApiResponse";

// Async Thunk to fetch dashboard stats
export const handleGetDashboardStats = createAsyncThunk(
  "systemAdmin/getDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await systemAdminService.getAdminDashboardStatsService();
      if (!response.isSuccess) {
        throw createApiResponse({
          isSuccess: false,
          message: response.message || "Failed to fetch dashboard stats",
        });
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message:
            error.message ||
            "Failed to fetch dashboard stats. Please try again.",
        })
      );
    }
  }
);

// Reusable Handlers for Pending & Rejected
const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
  state.successMessage = null; // Clear success message on pending
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload?.message || "Something went wrong";
};

// Redux Slice
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    resetDashboardState: (state) => {
      state.stats = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleGetDashboardStats.pending, handlePending)
      .addCase(handleGetDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.stats = action.payload; // Update state with fetched data
      })
      .addCase(handleGetDashboardStats.rejected, handleRejected);
  },
});

// Export actions and reducer
export const { resetDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
