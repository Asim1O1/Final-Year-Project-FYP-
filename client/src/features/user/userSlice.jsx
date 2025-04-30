import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "../../services/user/user.service";
import createApiResponse from "../../utils/createApiResponse";

// **Fetch User by ID**
export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.getUserByIdService(userId);
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch user details")
      );
    }
  }
);

// **Fetch All Users**
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await userService.getAllUsersService(params);
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(createApiResponse(error, "Failed to fetch users"));
    }
  }
);

// **Update User**
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await userService.updateUserService(userId, userData);
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  "user/fetchUserStats",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.getUserStatsService(userId);
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch user stats")
      );
    }
  }
);

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    user: null,
    users: [],
    userStats: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    resetUserState: (state) => {
      state.user = null;
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
      .addCase(fetchUserById.pending, handlePending)
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, handleRejected);

    builder
      .addCase(fetchAllUsers.pending, handlePending)
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchAllUsers.rejected, handleRejected);

    builder
      .addCase(updateUser.pending, handlePending)
      .addCase(updateUser.fulfilled, (state, action) => {
        console.log("Update User Response:", action.payload); // Log the response
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, handleRejected);

    builder
      .addCase(fetchUserStats.pending, handlePending)
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userStats = action.payload; // Add userStats to the state
        state.error = null;
      })
      .addCase(fetchUserStats.rejected, handleRejected);
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
