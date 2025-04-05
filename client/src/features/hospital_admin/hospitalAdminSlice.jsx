import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import createApiResponse from "../../utils/createApiResponse";
import {
  createHospitalAdminService,
  deleteHospitalAdminService,
  getAllHospitalAdminsService,
  getHospitalAdminByIdService,
  updateHospitalAdminService,
} from "../../services/hospital_admin/hospital_admin.service";

export const handleHospitalAdminCreation = createAsyncThunk(
  "hospitalAdmin/createHospitalAdmin",
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await createHospitalAdminService(adminData);
      console.log(
        "The response in the async thunk for creating hospital admin",
        response
      );

      if (!response.isSuccess) {
        throw createApiResponse({
          isSuccess: false,
          message: response.message || "Failed to create hospital admin",
          error: response.error,
        });
      }

      return response?.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message:
            error.message ||
            "Failed to create hospital admin. Please try again.",
          error: error.error,
        })
      );
    }
  }
);

export const handleHospitalAdminUpdate = createAsyncThunk(
  "hospitalAdmin/updateHospitalAdmin",
  async ({ adminId, updatedData }, { rejectWithValue }) => {
    try {
      console.log("The admin id is", adminId);
      const response = await updateHospitalAdminService(adminId, updatedData);
      if (!response.isSuccess) {
        throw createApiResponse({
          isSuccess: false,
          message: response.message || "Failed to update hospital admin",
        });
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message: error.message || "Failed to update hospital admin.",
        })
      );
    }
  }
);

export const handleHospitalAdminDeletion = createAsyncThunk(
  "hospitalAdmin/deleteHospitalAdmin",
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await deleteHospitalAdminService(adminId);
      if (!response.isSuccess) {
        throw createApiResponse({
          isSuccess: false,
          message: response.message || "Failed to delete hospital admin",
        });
      }
      return adminId;
    } catch (error) {
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message: error.message || "Failed to delete hospital admin.",
        })
      );
    }
  }
);

export const handleGetHospitalAdminById = createAsyncThunk(
  "hospitalAdmin/getHospitalAdminById",
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await getHospitalAdminByIdService(adminId);
      if (!response.isSuccess) {
        throw createApiResponse({
          isSuccess: false,
          message: response.message || "Failed to retrieve hospital admin",
        });
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message: error.message || "Failed to retrieve hospital admin.",
        })
      );
    }
  }
);

export const handleGetAllHospitalAdmins = createAsyncThunk(
  "hospitalAdmin/getAllHospitalAdmins",
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await getAllHospitalAdminsService(queryParams);
      console.log("📦 Redux Thunk - Hospital Admins Response:", response);

      // Check if the service response is successful
      if (!response.isSuccess) {
        return rejectWithValue(
          createApiResponse({
            isSuccess: false,
            message: response.message || "Failed to fetch hospital admins",
            data: response.data || null,
          })
        );
      }

      // Return only necessary parts for Redux state
      return {
        hospitalAdmins: response.data.hospitalAdmins,
        pagination: response.data.pagination,
      };
    } catch (error) {
      const errorMessage = error?.message || "Failed to fetch hospital admins.";
      console.error("❌ Redux Thunk Error:", errorMessage);

      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message: errorMessage,
          data: null,
        })
      );
    }
  }
);

const hospitalAdminSlice = createSlice({
  name: "hospitalAdminSlice",
  initialState: {
    hospitalAdmin: null,
    hospitalAdmins: [],
    isLoading: false,
    error: null,
    successMessage: null,
    pagination: null,
  },

  reducers: {
    resetHospitalAdminState: (state) => {
      state.hospitalAdmin = null;
      state.hospitalAdmins = [];
      state.isLoading = false;
      state.error = null;
      state.successMessage = null;
      state.pagination = null;
    },
  },

  extraReducers: (builder) => {
    // Reusable handlers
    const handlePending = (state) => {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null; // Clear success message on pending
    };

    const handleFulfilled = (state, action) => {
      state.isLoading = false;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "An error occurred.";
      state.successMessage = null; // Clear success message on error
    };

    builder
      // Create
      .addCase(handleHospitalAdminCreation.pending, handlePending)
      .addCase(handleHospitalAdminCreation.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.hospitalAdmin = action.payload;
        state.successMessage = "Hospital admin created successfully!";
      })
      .addCase(handleHospitalAdminCreation.rejected, handleRejected)

      // Update
      .addCase(handleHospitalAdminUpdate.pending, handlePending)
      .addCase(handleHospitalAdminUpdate.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.hospitalAdmin = action.payload;
        state.successMessage = "Hospital admin updated successfully!";
      })
      .addCase(handleHospitalAdminUpdate.rejected, handleRejected)

      // Delete
      .addCase(handleHospitalAdminDeletion.pending, handlePending)
      .addCase(handleHospitalAdminDeletion.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.hospitalAdmins = state.hospitalAdmins.filter(
          (admin) => admin._id !== action.payload
        );
        state.successMessage = "Hospital admin deleted successfully!";
      })
      .addCase(handleHospitalAdminDeletion.rejected, handleRejected)

      // Get by ID
      .addCase(handleGetHospitalAdminById.pending, handlePending)
      .addCase(handleGetHospitalAdminById.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.hospitalAdmin = action.payload;
      })
      .addCase(handleGetHospitalAdminById.rejected, handleRejected)

      // Get All
      .addCase(handleGetAllHospitalAdmins.pending, handlePending)
      .addCase(handleGetAllHospitalAdmins.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.hospitalAdmins = action.payload?.hospitalAdmins || [];
        state.pagination = action.payload?.pagination || null;
      })
      .addCase(handleGetAllHospitalAdmins.rejected, handleRejected);
  },
});

export const { resetAdminState } = hospitalAdminSlice.actions;

export default hospitalAdminSlice.reducer;
