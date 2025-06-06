import { createSelector } from "@reduxjs/toolkit";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  addNewMessageToState,
  setTypingUsers,
  updateUnreadCount,
} from "../features/messages/messageSlice";
import { addNewNotification } from "../features/notification/notificationSlice";

const getTypingUsers = createSelector(
  [(state) => state.messageSlice.typingUsers],
  (typingUsers) => typingUsers || {}
);
export const useSocket = () => {
  const socketRef = useRef(null);
  const messageTracker = useRef(new Set());
  const typingTimeouts = useRef({});
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user?.data);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const userId = user?._id || user?.data?._id;
  const userRole = user?.role || user?.data?.role || "user";

  const initializeSocket = useCallback(() => {
    console.log("Initializing socket for user:", userId);

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
      console.log("✅ Socket connected, joining room:", userId);
      setIsConnected(true);
      reconnectAttempts.current = 0;
      console.log("🏠 Joining room with:", { id: userId, role: userRole });
      socketRef.current.emit("join-room", {
        id: userId,
        role: userRole,
      });
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
      setTimeout(() => socketRef.current?.connect(), 5000);
    });

    socketRef.current.on("update-online-users", (users) => {
      setOnlineUsers(users);
    });

    socketRef.current.on("message", (message) => {
      if (!messageTracker.current.has(message._id)) {
        messageTracker.current.add(message._id);

        dispatch((dispatch, getState) => {
          const state = getState();
          const currentChat = state.messageSlice.currentChat;

          // Always add the message to state
          dispatch(addNewMessageToState(message));

          // IMPORTANT: Check if we are the receiver of this message
          if (message.receiverId === userId) {
            // Check if we're actively chatting with the sender
            const isActiveChatWithSender =
              currentChat && currentChat._id === message.senderId;

            if (isActiveChatWithSender) {
              console.log(
                "✅ Message received in active chat - marking as read immediately"
              );

              // Mark message as read immediately in both UI and backend
              if (socketRef.current) {
                socketRef.current.emit("messages-read", {
                  senderId: message.senderId,
                  receiverId: userId,
                });
              }

              // No need to update unread count for active chat
            } else if (!message.read) {
              // Only update unread count if we're not in that chat and it's not already read
              console.log(
                "📬 Increasing unread count for chat:",
                message.senderId
              );
              dispatch(
                updateUnreadCount({ chatId: message.senderId, count: 1 })
              );
            }
          }
        });
      }
    });

    socketRef.current.on("chatCountUpdate", (data) => {
      dispatch(updateUnreadCount({ chatId: data.chatId, count: data.count }));
    });

    return socketRef.current;
  }, [userId, userRole, dispatch]);

  // Setup typing event listeners
  useEffect(() => {
    if (!isConnected || !socketRef.current) return;

    const socket = socketRef.current;

    const handleTyping = (data) => {
      const senderId = typeof data === "string" ? data : data.senderId;
      console.log("👂 Received typing from:", senderId);

      // Update typing users in Redux instead of local state
      dispatch(
        setTypingUsers({
          userId: senderId,
          isTyping: true,
        })
      );
    };

    const handleStopTyping = (data) => {
      const senderId = typeof data === "string" ? data : data.senderId;
      console.log("👂 Received stop typing from:", senderId);

      // Update typing users in Redux instead of local state
      dispatch(
        setTypingUsers({
          userId: senderId,
          isTyping: false,
        })
      );
    };

    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, [isConnected, dispatch]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !isConnected) return;

    const notificationTypes = [
      "appointment",
      "payment",
      "campaign",
      "test_booking",
      "doctor",
      "medical_report",
    ];

    const listeners = notificationTypes.map((type) => {
      const handler = (data) => {
        if (!data || !data.id) {
          dispatch(addNewNotification({ ...data, type }));
          return;
        }

        dispatch(addNewNotification({ ...data, type }));
      };
      socket.on(type, handler);
      return { type, handler };
    });

    socket.onAny((event, ...args) => {
      console.log("📡 Socket event received:", event, args);
    });

    return () => {
      listeners.forEach(({ type, handler }) => {
        socket.off(type, handler);
      });
      socket.offAny();
    };
  }, [dispatch, isConnected, userId]);

  useEffect(() => {
    if (!userId) return;
    const socket = initializeSocket();

    if (socket) {
      console.log("✅ Socket initialized:", socket.id);
    }

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
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

  const sendTypingStatus = useCallback(
    (receiverId) => {
      if (!socketRef.current || !userId || !receiverId) return;

      // Clear any existing timeout
      if (typingTimeouts.current[receiverId]) {
        clearTimeout(typingTimeouts.current[receiverId]);
      }

      // Log a debugging message
      console.log("🔵 Sending typing status to:", receiverId, "from:", userId);

      // Emit typing event
      socketRef.current.emit("typing", {
        senderId: userId,
        receiverId,
        timestamp: Date.now(),
      });

      // Set timeout to automatically send stop-typing after 3 seconds of inactivity
      typingTimeouts.current[receiverId] = setTimeout(() => {
        console.log("🔴 Auto-sending stop typing to:", receiverId);
        socketRef.current.emit("stop-typing", {
          senderId: userId,
          receiverId,
        });
        delete typingTimeouts.current[receiverId];
      }, 3000); // 3 seconds is more standard
    },
    [userId]
  );

  const sendStopTypingStatus = useCallback(
    (receiverId) => {
      if (!socketRef.current || !userId || !receiverId) return;

      // Clear timeout if it exists
      if (typingTimeouts.current[receiverId]) {
        clearTimeout(typingTimeouts.current[receiverId]);
        delete typingTimeouts.current[receiverId];
      }

      // Log a debugging message
      console.log(
        "🛑 Explicitly sending stop typing to:",
        receiverId,
        "from:",
        userId
      );

      // Immediately send stop-typing
      socketRef.current.emit("stop-typing", {
        senderId: userId,
        receiverId,
      });
    },
    [userId]
  );

  const typingUsers = useSelector(getTypingUsers);

  return {
    isConnected,
    disconnect,
    getSocket: () => socketRef.current,
    typingUsers,
    onlineUsers,
    sendTypingStatus,
    sendStopTypingStatus,
  };
};
