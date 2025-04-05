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

// Async Thunk to fetch users
export const handleGetUsers = createAsyncThunk(
  "systemAdmin/getUsers",
  async ({ page, limit, search = "" }, { rejectWithValue }) => {
    try {
      const response = await systemAdminService.getUsersService(
        page,
        limit,
        search
      );
      if (!response.isSuccess) {
        throw createApiResponse({
          isSuccess: false,
          message: response.message || "Failed to fetch users",
        });
      }
      console.log("The response is", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message: error.message || "Failed to fetch users. Please try again.",
        })
      );
    }
  }
);

// Async Thunk to fetch doctors
export const handleGetDoctors = createAsyncThunk(
  "systemAdmin/getDoctors",
  async ({ page, limit, search = "" }, { rejectWithValue }) => {
    try {
      const response = await systemAdminService.getDoctorsService(
        page,
        limit,
        search
      );
      if (!response.isSuccess) {
        throw createApiResponse({
          isSuccess: false,
          message: response.message || "Failed to fetch doctors",
        });
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message:
            error.message || "Failed to fetch doctors. Please try again.",
        })
      );
    }
  }
);

// Async Thunk to deactivate an account
export const handleAccountStatus = createAsyncThunk(
  "systemAdmin/handleAccountStatus",
  async ({ accountId, role }, { rejectWithValue }) => {
    try {
      const response = await systemAdminService.accountStatusService(
        accountId,
        role
      );
      if (!response.isSuccess) {
        throw createApiResponse({
          isSuccess: false,
          message: response.message || `Failed to deactivate ${role} account`,
        });
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message: error.message || `Failed to deactivate ${role} account.`,
        })
      );
    }
  }
);

export const handleGetRecentActivities = createAsyncThunk(
  "systemAdmin/getRecentActivities",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await systemAdminService.getRecentActivitiesService(
        page,
        limit
      );
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

// Reusable Handlers for Pending & Rejected
const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
  state.successMessage = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload?.message || "Something went wrong";
};

// Redux Slice
const systemAdminSlice = createSlice({
  name: "systemAdminSlice",
  initialState: {
    stats: null,
    users: [],
    doctors: [],
    isLoading: false,
    error: null,
    successMessage: null,
    activities: [],
    pagination: {
      users: { totalCount: 0, currentPage: 1, totalPages: 1 },
      doctors: { totalCount: 0, currentPage: 1, totalPages: 1 },
      activities: { totalCount: 0, currentPage: 1, totalPages: 1 }, // <- add this
    },
  },
  reducers: {
    resetDashboardState: (state) => {
      state.stats = null;
      state.users = [];
      state.doctors = [];
      state.isLoading = false;
      state.error = null;
      state.pagination = {
        users: { totalCount: 0, currentPage: 1, totalPages: 1 },
        doctors: { totalCount: 0, currentPage: 1, totalPages: 1 },
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(handleGetDashboardStats.pending, handlePending)
      .addCase(handleGetDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.stats = action.payload;
      })
      .addCase(handleGetDashboardStats.rejected, handleRejected)

      // Fetch Users (with pagination)
      .addCase(handleGetUsers.pending, handlePending)
      .addCase(handleGetUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        // Store users data separately
        if (Array.isArray(action.payload.data)) {
          state.users = action.payload.data;
        } else {
          console.error("Invalid data structure for users");
        }

        // Store only pagination metadata
        state.pagination.users = {
          totalCount: action.payload.totalCount,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(handleGetUsers.rejected, handleRejected)

      // Fetch Doctors (with pagination)
      .addCase(handleGetDoctors.pending, handlePending)
      .addCase(handleGetDoctors.fulfilled, (state, action) => {
        console.log("The action payload is", action.payload);
        state.isLoading = false;
        state.error = null;

        // Store doctors data separately
        if (Array.isArray(action.payload.data)) {
          state.doctors = action.payload.data;
          console.log("The state.dcotros", state.doctors);
        } else {
          console.error("Invalid data structure for doctors");
        }

        // Store only pagination metadata
        state.pagination.doctors = {
          totalCount: action.payload.totalCount,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(handleGetDoctors.rejected, handleRejected)

      // Deactivate Account (unchanged)
      .addCase(handleAccountStatus.pending, handlePending)
      .addCase(handleAccountStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (Array.isArray(state.users)) {
          if (action.payload.role === "user") {
            state.users = state.users.filter(
              (user) => user._id !== action.payload.accountId
            );
            // Update totalCount when a user is removed
            state.pagination.users.totalCount = Math.max(
              0,
              state.pagination.users.totalCount - 1
            );
          } else if (action.payload.role === "doctor") {
            state.doctors = state.doctors.filter(
              (doctor) => doctor._id !== action.payload.accountId
            );
            // Update totalCount when a doctor is removed
            state.pagination.doctors.totalCount = Math.max(
              0,
              state.pagination.doctors.totalCount - 1
            );
          }
        }
      })
      .addCase(handleAccountStatus.rejected, handleRejected)
      // Fetch Recent Activities
      .addCase(handleGetRecentActivities.pending, handlePending)
      .addCase(handleGetRecentActivities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        if (Array.isArray(action.payload.data)) {
          state.activities = action.payload.data;
        } else {
          console.error("Invalid data structure for activities");
        }

        state.pagination.activities = {
          totalCount: action.payload.totalCount,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(handleGetRecentActivities.rejected, handleRejected);
  },
});
// Export actions and reducer
export const { resetDashboardState } = systemAdminSlice.actions;
export default systemAdminSlice.reducer;
