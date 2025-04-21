import { useCallback, useEffect, useState, useRef } from "react";
import { addNewNotification } from "../features/notification/notificationSlice";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  addNewMessageToState,
  updateUnreadCount,
} from "../features/messages/messageSlice";

export const useSocket = () => {
  const socketRef = useRef(null);
  const messageTracker = useRef(new Set());
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user?.data);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const userId = user?._id || user?.data?._id;
  const userRole = user?.role || user?.data?.role || "user";

  const initializeSocket = useCallback(() => {
    if (!userId || socketRef.current) return socketRef.current;

    socketRef.current = io("http://localhost:4001", {
      withCredentials: true,
      autoConnect: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      transports: ["websocket"],
    });

    messageTracker.current.clear();

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
      socketRef.current.emit("join-room", { id: userId, role: userRole });
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
      setTimeout(() => socketRef.current?.connect(), 5000);
    });

    socketRef.current.on("message", (message) => {
      console.log("message in the use socket is", message);
      if (!messageTracker.current.has(message._id)) {
        messageTracker.current.add(message._id);

        dispatch((dispatch, getState) => {
          // Use Redux Thunk's getState
          const state = getState();
          const currentChat = state.messageSlice.currentChat;

          dispatch(addNewMessageToState(message));

          if (
            message.receiverId === userId &&
            (!currentChat || currentChat._id !== message.senderId) &&
            message.read === false
          ) {
            console.log("entered the conditin to update message count");

            dispatch(updateUnreadCount({ chatId: message.senderId, count: 1 }));
          }
        });
      }
    });

    socketRef.current.on("chatCountUpdate", (data) => {
      console.log("INSIDE THE SOCKET REF CHAT COUNT UPDATE", data);
      dispatch(updateUnreadCount({ chatId: data.chatId, count: data.count }));
    });

    return socketRef.current;
  }, [userId, userRole, dispatch]);

  // Typing indicators
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleTyping = (senderId) => {
      console.log("Typing from:", senderId);
    };

    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleTyping);
    };
  }, []);

  useEffect(() => {
    console.log("entered inside the notification listener");
    const socket = socketRef.current;
    if (!socket || !isConnected) {
      console.log(
        "Socket not ready or not connected, skipping notification setup"
      );
      return;
    }
    console.log("🔄 Setting up notification listeners for user:", userId);

    const notificationTypes = [
      "appointment",
      "payment",
      "campaign",
      "test_booking",
      "doctor",
      "medical_report",
    ];

    // Either use your new handler function...
    const listeners = notificationTypes.map((type) => {
      console.log(`🔊 Setting up listener for ${type} notifications`);
      const handler = (data) => {
        console.log(`📥 Received ${type} notification:`, data);

        // Check if data exists and has necessary properties
        if (!data || !data.id) {
          console.warn(
            `⚠️ Received malformed ${type} notification data:`,
            data
          );
          // Still dispatch with whatever data we have
          dispatch(addNewNotification({ ...data, type }));
          return;
        }

        dispatch(addNewNotification({ ...data, type }));
      };
      socket.on(type, handler);
      return { type, handler };
    });

    // Add debug catch-all to see all events
    socket.onAny((event, ...args) => {
      console.log("📡 Socket event received:", event, args);
    });

    return () => {
      listeners.forEach(({ type, handler }) => {
        socket.off(type, handler);
        console.log(`❌ Unsubscribed from ${type} notifications`);
      });
      socket.offAny();
    };
  }, [dispatch, isConnected, userId]); // Add isConnected and userId

  // Initialize socket on mount or when userId is ready
  useEffect(() => {
    if (!userId) {
      console.log("No userId available, skipping socket initialization");
      return;
    }

    console.log("🔄 Initializing socket for user:", userId);
    const socket = initializeSocket();

    // Log socket state immediately after initialization
    if (socket) {
      console.log("✅ Socket initialized:", socket.id);
    } else {
      console.warn("⚠️ Socket initialization failed");
    }

    return () => {
      if (socket) {
        console.log("🧹 Cleaning up socket connection");
        socket.off("connect");
        socket.off("disconnect");
        // Don't disconnect here - let the disconnect function handle this
      }
    };
  }, [userId, initializeSocket]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
  }, []);

  return {
    isConnected,
    disconnect,
    getSocket: () => socketRef.current,
  };
};
