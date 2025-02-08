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
      console.log("The response in the get all hospital slice is", response);

      // Check if the service response is successful
      if (!response.isSuccess) {
        return rejectWithValue(
          createApiResponse({
            isSuccess: false,
            message: response.message || "Failed to fetch hospital admins",
          })
        );
      }

      // Return the data from the service response
      return response.data;
    } catch (error) {
      const errorMessage = error?.message || "Failed to fetch hospital admins.";
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message: errorMessage,
        })
      );
    }
  }
);

// Redux Slice
const hospitalAdminSlice = createSlice({
  name: "hospitalAdminSlice",
  initialState: {
    hospitalAdmin: null,
    hospitalAdmins: [],
    isLoading: false,
    error: null,
    pagination:null
  },

  reducers: {
    resetHospitalAdminState: (state) => {
      state.hospitalAdmin = null;
      state.hospitalAdmins = [];
      state.isLoading = false;
      state.error = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Create
      .addCase(handleHospitalAdminCreation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleHospitalAdminCreation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hospitalAdmin = action.payload;
        state.successMessage = "Hospital admin created successfully!";
      })
      .addCase(handleHospitalAdminCreation.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to create hospital admin.";
      })

      // Update
      .addCase(handleHospitalAdminUpdate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleHospitalAdminUpdate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hospitalAdmin = action.payload;
        state.successMessage = "Hospital admin updated successfully!";
      })
      .addCase(handleHospitalAdminUpdate.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to update hospital admin.";
      })

      // Delete
      .addCase(handleHospitalAdminDeletion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleHospitalAdminDeletion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hospitalAdmins = state.hospitalAdmins.filter(
          (admin) => admin.id !== action.payload
        );
        state.successMessage = "Hospital admin deleted successfully!";
      })
      .addCase(handleHospitalAdminDeletion.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to delete hospital admin.";
      })

      // Get by ID
      .addCase(handleGetHospitalAdminById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetHospitalAdminById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hospitalAdmin = action.payload;
      })
      .addCase(handleGetHospitalAdminById.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to retrieve hospital admin.";
      })

      // Get All
      .addCase(handleGetAllHospitalAdmins.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetAllHospitalAdmins.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(
          "The action payload in get all hospitals is",
          action.payload
        );
        state.hospitalAdmins = action.payload?.data;
        state.pagination = action.payload?.pagination;
      })
      .addCase(handleGetAllHospitalAdmins.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch hospital admins.";
      });
  },
});

export const { resetAdminState } = hospitalAdminSlice.actions;

export default hospitalAdminSlice.reducer;
