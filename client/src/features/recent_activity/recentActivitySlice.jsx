import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRecentActivitiesService } from "../../services/recent_activity/recent_activity.service";
import createApiResponse from "../../utils/createApiResponse";

export const handleGetRecentActivities = createAsyncThunk(
  "recentActivity/getRecentActivities",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await getRecentActivitiesService(page, limit);
      console.log("The response is", response);
      if (!response.isSuccess) {
        throw createApiResponse({
          isSuccess: false,
          message: response.message || "Failed to fetch recent activities",
        });
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message:
            error.message ||
            "Failed to fetch recent activities. Please try again.",
        })
      );
    }
  }
);

const initialState = {
  activities: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    resetActivities: (state) => {
      state.activities = [];
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleGetRecentActivities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetRecentActivities.fulfilled, (state, action) => {
        console.log("The action is", action.payload);
        state.activities = action.payload?.data;
        state.pagination = action.payload.pagination;
        state.isLoading = false;
      })
      .addCase(handleGetRecentActivities.rejected, (state, action) => {
        console.log("the erroris", action.payload);
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { resetActivities } = activitySlice.actions;
export default activitySlice.reducer;
