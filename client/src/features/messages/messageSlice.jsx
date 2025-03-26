import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import messageServices from "../../services/mesages/message.service";
import createApiResponse from "../../utils/createApiResponse";

/**
 * Fetch messages between users
 */
export const handleGetMessages = createAsyncThunk(
  "message/getMessages",
  async (otherUserId, { rejectWithValue }) => {
    try {
      const response = await messageServices.getMessagesService(otherUserId);
      if (!response.isSuccess) {
        throw createApiResponse({
          isSuccess: false,
          message: response.message || "Failed to fetch messages",
        });
      }
      console.log("The response while getting messages is", response);
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message: error.message || "Failed to fetch messages.",
        })
      );
    }
  }
);

/**
 * Send a new message
 */

export const handleSendMessage = createAsyncThunk(
  "message/sendMessage",
  async ({ receiverId, text, image }, { rejectWithValue }) => {
    try {
      const response = await messageServices.sendMessageService(
        receiverId,
        text,
        image
      );
      if (!response.isSuccess) {
        throw createApiResponse({
          isSuccess: false,
          message: response.message || "Failed to send message",
        });
      }
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Mark messages as read
 */
export const handleMarkMessagesAsRead = createAsyncThunk(
  "message/markMessagesAsRead",
  async ({ senderId, receiverId }, { rejectWithValue }) => {
    try {
      const response = await messageServices.markMessagesAsReadService(
        senderId,
        receiverId
      );
      if (!response.isSuccess) throw new Error(response.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const handleGetContactsForSideBar = createAsyncThunk(
  "message/getContactsForSidebar",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const response = await messageServices.getContactsForSidebar(
        page,
        limit,
        search
      );

      if (!response.isSuccess) {
        throw createApiResponse({
          isSuccess: false,
          message: response.message || "Failed to fetch contacts for sidebar",
        });
      }

      console.log(
        "The response while getting contacts for sidebar is",
        response
      );
      return response?.data; // Return the data for the sidebar contacts
    } catch (error) {
      return rejectWithValue(
        createApiResponse({
          isSuccess: false,
          message: error.message || "Failed to fetch contacts for sidebar.",
        })
      );
    }
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    contacts: [],
    currentChat: null,
    newMessage: "",
    image: null,
    imagePreview: null,
    isLoading: false,
    error: null,
    successMessage: null,
  },

  reducers: {
    resetMessageState: (state) => {
      state.messages = [];
      state.currentChat = null;
      state.newMessage = "";
      state.image = null;
      state.imagePreview = null;
      state.isLoading = false;
      state.error = null;
      state.successMessage = null;
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    setNewMessage: (state, action) => {
      state.newMessage = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    setImagePreview: (state, action) => {
      state.imagePreview = action.payload;
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
      // Fetch Messages
      .addCase(handleGetMessages.pending, handlePending)
      .addCase(handleGetMessages.fulfilled, (state, action) => {
        handleFulfilled(state);
        console.log("Fetched messages:", action.payload);
        state.messages = action.payload;
      })
      .addCase(handleGetMessages.rejected, handleRejected)

      // Send Message
      .addCase(handleSendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload); // Add the new message to the state
        state.newMessage = "";
        state.image = null;
        state.imagePreview = null;
      })
      .addCase(handleSendMessage.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Mark Messages as Read
      .addCase(handleMarkMessagesAsRead.fulfilled, (state, action) => {
        state.messages = state.messages.map((message) =>
          message.senderId === action.payload.senderId &&
          message.receiverId === action.payload.receiverId
            ? { ...message, read: true }
            : message
        );
      })
      .addCase(handleMarkMessagesAsRead.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch Contacts for Sidebar
      .addCase(handleGetContactsForSideBar.pending, handlePending)
      .addCase(handleGetContactsForSideBar.fulfilled, (state, action) => {
        handleFulfilled(state);
        console.log("Fetched contacts for sidebar:", action.payload);
        state.contacts = action.payload;
      })
      .addCase(handleGetContactsForSideBar.rejected, handleRejected);
  },
});

export const {
  resetMessageState,
  setCurrentChat,
  setNewMessage,
  setImage,
  setImagePreview,
} = messageSlice.actions;
export default messageSlice.reducer;
