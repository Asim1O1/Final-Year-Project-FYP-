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
      return response?.data?.messages;
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
    onlineUsers: [],
    unreadCount: [],
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
    // Add a reducer to handle typing status
    setTypingUsers: (state, action) => {
      const { userId, isTyping } = action.payload;

      // If user is typing, add them to the typing users
      if (isTyping) {
        state.typingUsers = {
          ...state.typingUsers,
          [userId]: true,
        };
      } else {
        // If user stopped typing, remove them
        const newTypingUsers = { ...state.typingUsers };
        delete newTypingUsers[userId];
        state.typingUsers = newTypingUsers;
      }

      // Log the updated typing state for debugging
      console.log(
        `🔄 Redux typing state updated for ${userId}: ${
          isTyping ? "typing" : "stopped typing"
        }`
      );
      console.log("🔄 Current typing users:", state.typingUsers);
    },
    // New actions for online user management
    addOnlineUser: (state, action) => {
      const userId = action.payload;
      if (!state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId);
      }
      console.log("User came online:", userId, state.onlineUsers);
    },

    removeOnlineUser: (state, action) => {
      const userId = action.payload;
      state.onlineUsers = state.onlineUsers.filter((id) => id !== userId);
      console.log("User went offline:", userId, state.onlineUsers);
    },
    setCurrentChat: (state, action) => {
      console.log(
        "The action payload while setting current chat is",
        action?.payload
      );
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

    addNewMessageToState: (state, action) => {
      console.log("ADD NEW MESSAGE STATE :::::::", action?.payload);
      if (!state.messages.some((msg) => msg._id === action.payload._id)) {
        if (!Array.isArray(state.messages)) {
          state.messages = [];
        }

        state.messages.push(action.payload);
      }
    },

    updateContactWithLatestMessage: (state, action) => {
      const { message, doctorId } = action.payload;

      // Determine the other party ID (not the doctor)
      const otherPartyId =
        message.senderId === doctorId
          ? message.receiverId
          : message.senderId._id || message.senderId;

      // Update the contact with the latest message
      let contactUpdated = false;

      state.contacts = state.contacts.map((contact) => {
        if (contact._id === otherPartyId) {
          contactUpdated = true;
          return {
            ...contact,
            lastMessage: message.text || "Image sent",
            lastMessageTime: message.createdAt,
            // Increment unread count if message is from the other party
            unreadCount:
              message.senderId === doctorId
                ? contact.unreadCount || 0
                : (contact.unreadCount || 0) + 1,
          };
        }
        return contact;
      });

      // Log if contact wasn't found
      if (!contactUpdated) {
        console.warn("Contact not found for message:", message);
      }
    },

    // New action to reorder contacts after new message
    reorderContactsAfterNewMessage: (state, action) => {
      const contactId = action.payload;

      // Find the contact
      const contactIndex = state.contacts.findIndex((c) => c._id === contactId);

      if (contactIndex > 0) {
        // Only reorder if not already at the top
        // Pull the contact out
        const [contact] = state.contacts.splice(contactIndex, 1);
        // Push it to the front
        state.contacts.unshift(contact);

        console.log("Reordered contacts, moved to top:", contactId);
      }
    },

    // New action to add a new contact when receiving a message from someone not in contacts
    fetchAndAddNewContact: (state, action) => {
      // This is a placeholder that will trigger a thunk action
      // The actual contact addition will happen in the fulfilled case of the thunk
      console.log("Will fetch contact info for:", action.payload);
    },

    // Action to add a new contact to the list
    addNewContact: (state, action) => {
      const newContact = action.payload;

      // Only add if not already in the list
      if (!state.contacts.some((c) => c._id === newContact._id)) {
        // Add to the beginning of the array
        state.contacts.unshift(newContact);
        console.log("Added new contact to list:", newContact._id);
      }
    },

    updateOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    updateUnreadCount: (state, action) => {
      console.log("The update unread count", action.payload);

      // Ensure unreadCount is an array
      if (!Array.isArray(state.unreadCount)) {
        state.unreadCount = [];
      }

      // Handle both single object and array formats
      const updates = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      updates.forEach((update) => {
        const { chatId, count } = update;

        const existingIndex = state.unreadCount.findIndex(
          (entry) => entry.chatId === chatId
        );

        if (existingIndex !== -1) {
          // OPTION 1: Replace the count (if socket sends total count)
          state.unreadCount[existingIndex].count = count;

          // OPTION 2: Add to the count (if socket sends incremental updates)
          // state.unreadCount[existingIndex].count += count;
        } else {
          // If the chatId doesn't exist, add it
          state.unreadCount.push({ chatId, count });
        }
      });

      console.log("Updated unread counts:", state.unreadCount);
    },

    clearUnreadCountForChat: (state, action) => {
      console.log("Clearing unread count for chat:", action.payload);
      const chatId = action.payload;

      if (Array.isArray(state.unreadCount)) {
        state.unreadCount = state.unreadCount.filter(
          (item) => item.chatId !== chatId
        );
      }
    },

    // In your messageSlice.js
    addOptimisticMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    replaceOptimisticMessage: (state, action) => {
      state.messages = state.messages.map((msg) =>
        msg._id === action.payload.tempId ? action.payload.realMessage : msg
      );
    },
    removeOptimisticMessage: (state, action) => {
      state.messages = state.messages.filter(
        (msg) => msg._id !== action.payload
      );
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
  addNewMessageToState,
  updateContactWithLatestMessage,
  updateUnreadCount,
  clearUnreadCountForChat,
  setTypingUsers,
  addOnlineUser,
  removeOnlineUser,
  updateOnlineUsers,
  reorderContactsAfterNewMessage,
  fetchAndAddNewContact,
  addNewContact,
  addOptimisticMessage,
  replaceOptimisticMessage,
  removeOptimisticMessage,
} = messageSlice.actions;
export default messageSlice.reducer;
