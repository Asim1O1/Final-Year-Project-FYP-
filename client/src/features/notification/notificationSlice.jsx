import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getNotificationsService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
  clearAllNotificationsService,
} from "../../services/notification/notification.service";
import createApiResponse from "../../utils/createApiResponse";

/**
 * Fetch user notifications
 */
export const handleGetNotifications = createAsyncThunk(
  "notification/getNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getNotificationsService();
      if (!response.isSuccess) {
        throw createApiResponse({
          isSuccess: false,
          message: response.message || "Failed to fetch notifications",
        });
      }
      // console.log("The response while getting notifications is", response);
      return response?.data;
    } catch (error) {
      console.error("Error while fetching notifications:", error);
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message: error.message || "Failed to fetch notifications.",
        })
      );
    }
  }
);

/**
 * Mark a single notification as read
 */
export const handleMarkNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    console.log("The notification ID here:", notificationId);
    try {
      const response = await markNotificationAsReadService(notificationId);
      if (!response.isSuccess) throw new Error(response.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Mark all notifications as read
 */
export const handleMarkAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await markAllNotificationsAsReadService();
      if (!response.isSuccess) throw new Error(response.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Clear all notifications
 */
export const handleClearAllNotifications = createAsyncThunk(
  "notifications/clearAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clearAllNotificationsService();
      if (!response.isSuccess) throw new Error(response.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    isLoading: false,
    error: null,
    successMessage: null,
  },

  reducers: {
    resetNotificationState: (state) => {
      state.notifications = [];
      state.isLoading = false;
      state.error = null;
      state.successMessage = null;
    },
    addNewNotification: (state, action) => {
      console.log("adding new notificaton", action?.payload)
      state.notifications.unshift(action.payload);
    },
  },

  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    };

    const handleFulfilled = (state) => {
      state.isLoading = false;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "An error occurred.";
      state.successMessage = null;
    };

    builder
      // Fetch Notifications
      .addCase(handleGetNotifications.pending, handlePending)
      .addCase(handleGetNotifications.fulfilled, (state, action) => {
        handleFulfilled(state);
        console.log("The action payload is", action.payload);
        state.notifications = action.payload;
      })
      .addCase(handleGetNotifications.rejected, handleRejected)

      // Mark Single Notification as Read
      .addCase(handleMarkNotificationAsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((notification) =>
          notification._id === action.payload._id
            ? { ...notification, read: true }
            : notification
        );
      })
      .addCase(handleMarkNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Mark All Notifications as Read
      .addCase(handleMarkAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((notification) => ({
          ...notification,
          read: true,
        }));
      })
      .addCase(handleMarkAllNotificationsAsRead.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Clear All Notifications
      .addCase(handleClearAllNotifications.fulfilled, (state) => {
        state.notifications = [];
      })
      .addCase(handleClearAllNotifications.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetNotificationState, addNewNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
