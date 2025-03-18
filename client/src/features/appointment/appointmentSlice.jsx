import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import appointmentService from "../../services/appointment/appointment.service";
import createApiResponse from "../../utils/createApiResponse";

// **Book Appointment**
export const bookAppointment = createAsyncThunk(
  "appointment/bookAppointment",
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await appointmentService.bookAppointmentService(
        appointmentData
      );
      if (!response.isSuccess) throw response;
      return response;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to book appointment")
      );
    }
  }
);

// **Fetch Available Time Slots**
export const fetchAvailableTimeSlots = createAsyncThunk(
  "appointment/fetchAvailableTimeSlots",
  async ({ doctorId, date }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAvailableTimeSlotsService(
        doctorId,
        date
      );
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch available time slots")
      );
    }
  }
);

// **Fetch User Appointments**
export const fetchUserAppointments = createAsyncThunk(
  "appointment/fetchUserAppointments",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getUserAppointmentsService(
        userId
      );
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch user appointments")
      );
    }
  }
);

// **Fetch Doctor Appointments**
export const fetchDoctorAppointments = createAsyncThunk(
  "appointment/fetchDoctorAppointments",
  async ({ doctorId, status = "all" }, { rejectWithValue }) => {
    console.log("The status is ", status);
    try {
      const response = await appointmentService.getDoctorAppointmentsService(
        doctorId,
        status
      );

      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch doctor appointments")
      );
    }
  }
);

// **Update Appointment Status**
export const updateAppointmentStatus = createAsyncThunk(
  "appointment/updateAppointmentStatus",
  async (
    { appointmentId, status, rejectionReason = "" },
    { rejectWithValue }
  ) => {
    try {
      const response = await appointmentService.updateAppointmentStatusService(
        appointmentId,
        status,
        rejectionReason
      );
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to update appointment status")
      );
    }
  }
);

// **Delete Appointments**
export const deleteAppointments = createAsyncThunk(
  "appointment/deleteAppointments",
  async (appointmentIds, { rejectWithValue }) => {
    try {
      const response = await appointmentService.deleteAppointmentsService(
        appointmentIds
      );

      console.log("Deleting appointments:", appointmentIds);
      console.log("Response from deleteAppointmentsService:", response);

      if (!response.isSuccess) throw response;

      return { appointmentIds, message: response.message };
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to delete appointments")
      );
    }
  }
);

// ** fetchAppointmentById **

export const fetchAppointmentById = createAsyncThunk(
  "appointment/fetchAppointmentById",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointmentById(
        appointmentId
      );
      if (!response.isSuccess) throw response;
      return response.data; // Assuming `data` contains the appointment details
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to fetch appointment")
      );
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointmentSlice",
  initialState: {
    appointment: null,
    appointments: [],
    availableSlots: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetAppointmentState: (state) => {
      state.appointment = null;
      state.appointments = [];
      state.availableSlots = [];
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
      .addCase(bookAppointment.pending, handlePending)
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointment = action.payload;
        state.error = null;
      })
      .addCase(bookAppointment.rejected, handleRejected);

    builder
      .addCase(fetchAvailableTimeSlots.pending, handlePending)
      .addCase(fetchAvailableTimeSlots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableSlots = action.payload;
        state.error = null;
      })
      .addCase(fetchAvailableTimeSlots.rejected, handleRejected);

    builder
      .addCase(fetchUserAppointments.pending, handlePending)
      .addCase(fetchUserAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload;
        state.error = null;
      })
      .addCase(fetchUserAppointments.rejected, handleRejected);

    builder
      .addCase(fetchDoctorAppointments.pending, handlePending)
      .addCase(fetchDoctorAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload;
        state.error = null;
      })
      .addCase(fetchDoctorAppointments.rejected, handleRejected);

    builder
      .addCase(updateAppointmentStatus.pending, handlePending)
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointment = action.payload;
        state.error = null;
      })
      .addCase(updateAppointmentStatus.rejected, handleRejected);

    builder
      .addCase(deleteAppointments.pending, handlePending)
      .addCase(deleteAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(state.appointments)) {
          state.appointments = state.appointments.filter(
            (appointment) =>
              !action.payload.appointmentIds.includes(appointment.id)
          );
        } else {
          state.appointments = [];
        }
        state.error = null;
      })
      .addCase(deleteAppointments.rejected, handleRejected);

    builder
      .addCase(fetchAppointmentById.pending, handlePending)
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointment = action.payload;
        state.error = null;
      })
      .addCase(fetchAppointmentById.rejected, handleRejected);
  },
});

export const { resetAppointmentState } = appointmentSlice.actions;
export default appointmentSlice.reducer;
