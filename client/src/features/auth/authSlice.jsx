import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth/auth.service";
import createApiResponse from "../../utils/createApiResponse";

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.registerService(userData);
      console.log("The response in the registerUser was: ", response);

      if (!response.isSuccess) {
        throw createApiResponse({
          isSuccess: false,
          message: response.message || "Registration failed",
          error: response.error || null,
        });
      }

      return response;
    } catch (error) {
      console.error("Registration Error:", error);

      // Return handled error response
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message: error?.message || "Failed to register. Please try again.",
          error: error?.error || null,
        })
      );
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.loginService(userCredentials);

      if (!response.isSuccess) {
        throw createApiResponse({
          isSuccess: false,
          message: response.message || "Login failed",
          error: response.error || null,
        });
      }

      return response;
    } catch (error) {
      console.error("Login Error:", error);

      // Return handled error response
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message:
            error?.message || "Login failed. Please check your credentials.",
          error: error?.error || null,
        })
      );
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logoutUser();
      return true; // No response payload required for logout
    } catch (error) {
      console.error("Logout Error:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to log out. Please try again."
      );
    }
  }
);

// Authentication Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    resetAuthState: (state) => {
      state.user = null;
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
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    };

    builder
      // Registration
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleFulfilled)
      .addCase(registerUser.rejected, handleRejected)

      // Login
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleFulfilled)
      .addCase(loginUser.rejected, handleRejected)

      // Logout
      .addCase(logoutUser.pending, handlePending)
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, handleRejected);
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
