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

      // Handle failed responses where `isSuccess` is false
      if (!response?.isSuccess) {
        return rejectWithValue({
          isSuccess: false,
          message: response?.message || "Registration failed.",
          error: response?.error || "An unexpected server error occurred.",
        });
      }

      // Return the success response
      return {
        isSuccess: true,
        message: response?.message || "Registration successful.",
        data: response?.data,
      };
    } catch (error) {
      console.error("Registration Error:", error);

      // Handle unexpected errors with a fallback message
      return rejectWithValue({
        isSuccess: false,
        message:
          error?.response?.data?.message ||
          "Failed to register. Please try again.",
        error:
          error?.response?.data?.error || "An unknown server error occurred.",
      });
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.loginService(userCredentials);
      console.log("The response in the loginUser was: ", response);

      // Handle failed responses where `isSuccess` is false
      if (!response?.isSuccess) {
        return rejectWithValue({
          isSuccess: false,
          message: response?.error || "Login failed.",
          error: response?.error || "An unexpected server error occurred.",
        });
      }

      // Return the success data
      return {
        isSuccess: true,
        message: response?.message || "Login successful",
        data: response?.data,
      };
    } catch (error) {
      console.error("Login Error:", error);

      // Handle unexpected errors with a fallback
      return rejectWithValue({
        isSuccess: false,
        message:
          error?.response?.data?.message || "Login failed. Please try again.",
        error:
          error?.response?.data?.error || "An unexpected server error occured.",
      });
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.logoutUser();
      return response;
    } catch (error) {
      console.error("Logout Error:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to log out. Please try again."
      );
    }
  }
);

// async thunk for verifying user authentication
export const verifyUserAuth = createAsyncThunk(
  "auth/verifyAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.verifyUserAuthService();

      if (!response.isSuccess) {
        return createApiResponse({
          isSuccess: false,
          message:
            response.message || "User authentication verification failed",
          error: response.error || null,
        });
      }

      return response.data;
    } catch (error) {
      console.error("Verification Error:", error);

      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message:
            error?.message ||
            "Authentication verification failed. Please try again.",
          error: error?.error || null,
        })
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

      .addCase(logoutUser.rejected, handleRejected)
      .addCase(verifyUserAuth.pending, handlePending)
      .addCase(verifyUserAuth.fulfilled, handleFulfilled)
      .addCase(verifyUserAuth.rejected, handleRejected);
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
