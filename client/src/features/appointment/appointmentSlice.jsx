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
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getDoctorAppointmentsService(
        doctorId
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

// **Delete Appointment**
export const deleteAppointment = createAsyncThunk(
  "appointment/deleteAppointment",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await appointmentService.deleteAppointmentService(
        appointmentId
      );
      if (!response.isSuccess) throw response;
      return { appointmentId, message: response.message };
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to delete appointment")
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
      .addCase(deleteAppointment.pending, handlePending)
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(state.appointments)) {
          state.appointments = state.appointments.filter(
            (appointment) => appointment.id !== action.payload.appointmentId
          );
        } else {
          state.appointments = [];
        }
        state.error = null;
      })
      .addCase(deleteAppointment.rejected, handleRejected);
  },
});

export const { resetAppointmentState } = appointmentSlice.actions;
export default appointmentSlice.reducer;
