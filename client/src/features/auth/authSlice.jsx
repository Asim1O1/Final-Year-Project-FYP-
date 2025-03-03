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

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPasswordService(email);

      if (!response?.isSuccess) {
        return rejectWithValue({
          isSuccess: false,
          message: response?.message || "Failed to send reset email.",
          error: response?.error || "An unexpected server error occurred.",
        });
      }

      return {
        isSuccess: true,
        message: response?.message || "Password reset email sent successfully.",
      };
    } catch (error) {
      console.error("Forgot Password Error:", error);
      return rejectWithValue({
        isSuccess: false,
        message:
          error?.response?.data?.message ||
          "An error occurred while sending reset email.",
        error: error?.response?.data?.error || "Unknown server error.",
      });
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtpService(email, otp);

      if (!response?.isSuccess) {
        return rejectWithValue({
          isSuccess: false,
          message: response?.message || "Failed to verify OTP.",
          error: response?.error || "An unexpected server error occurred.",
        });
      }

      return {
        isSuccess: true,
        message: response?.message || "OTP verified successfully.",
      };
    } catch (error) {
      console.error("Verify OTP Error:", error);
      return rejectWithValue({
        isSuccess: false,
        message:
          error?.response?.data?.message ||
          "An error occurred while verifying OTP.",
        error: error?.response?.data?.error || "Unknown server error.",
      });
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPasswordService(
        email,
        otp,
        newPassword
      );

      if (!response?.isSuccess) {
        return rejectWithValue({
          isSuccess: false,
          message: response?.message || "Failed to reset password.",
          error: response?.error || "An unexpected server error occurred.",
        });
      }

      return {
        isSuccess: true,
        message: response?.message || "Password reset successfully.",
      };
    } catch (error) {
      console.error("Reset Password Error:", error);
      return rejectWithValue({
        isSuccess: false,
        message:
          error?.response?.data?.message ||
          "An error occurred while resetting password.",
        error: error?.response?.data?.error || "Unknown server error.",
      });
    }
  }
);

// Async thunk for user logout

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.logoutService();
      console.log("The response in the logoutUser was: ", response);

      // Handle failed responses where `isSuccess` is false
      if (!response?.isSuccess) {
        return rejectWithValue({
          isSuccess: false,
          message: response?.message || "Logout failed.",
          error: response?.error || "An unexpected server error occurred.",
        });
      }

      // Return the success response
      return response;
    } catch (error) {
      console.error("Logout Error:", error);

      // Handle unexpected errors with a fallback
      return rejectWithValue({
        isSuccess: false,
        message:
          error?.response?.data?.message ||
          "Failed to log out. Please try again.",
        error:
          error?.response?.data?.error ||
          "An unexpected server error occurred.",
      });
    }
  }
);

// async thunk for verifying user authentication
export const verifyUserAuth = createAsyncThunk(
  "auth/verifyAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.verifyUserAuthService();

      // Handle failed responses where `isSuccess` is false
      if (!response?.isSuccess) {
        return rejectWithValue({
          isSuccess: false,
          message:
            response?.message || "User authentication verification failed.",
          error: response?.error || "An unexpected server error occurred.",
        });
      }

      // Return the success data
      return {
        isSuccess: true,
        message: response?.message || "verfication  successful",
        data: response?.data,
      };
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
    // Reusable handlers for pending and rejected states
    const handlePending = (state) => {
      state.isLoading = true;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "An error occurred."; // Fallback error message
      state.user = null;
      state.isAuthenticated = false;
    };

    builder
      // Registration
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; // Store the registered user data
        state.isAuthenticated = false; // Do not authenticate the user after registration
        state.error = null;
      })
      .addCase(registerUser.rejected, handleRejected)

      // Login
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; // Store the logged-in user data
        state.isAuthenticated = true; // Authenticate the user after login
        state.error = null;
      })
      .addCase(loginUser.rejected, handleRejected)

      // Logout
      .addCase(logoutUser.pending, handlePending)
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false; // Unauthenticate the user after logout
        state.error = null;
      })
      .addCase(logoutUser.rejected, handleRejected)

      // Forgot Password
      .addCase(forgotPassword.pending, handlePending)
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, handleRejected)

      // Verify OTP
      .addCase(verifyOtp.pending, handlePending)
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, handleRejected)

      .addCase(resetPassword.pending, handlePending)
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, handleRejected)

      // Verify User Authentication
      .addCase(verifyUserAuth.pending, handlePending)
      .addCase(verifyUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; 
        state.isAuthenticated = !!action.payload; 
        state.error = null;
      })
      .addCase(verifyUserAuth.rejected, handleRejected);
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
