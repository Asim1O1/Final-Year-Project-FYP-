import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  addNewMessageToState,
  updateUnreadCount,
} from "../features/messages/messageSlice";
import { addNewNotification } from "../features/notification/notificationSlice";

export const useSocket = () => {
  const socketRef = useRef(null);
  const messageTracker = useRef(new Set());
  const typingTimeouts = useRef({});
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user?.data);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const userId = user?._id || user?.data?._id;
  const userRole = user?.role || user?.data?.role || "user";

  const initializeSocket = useCallback(() => {
    console.log("Initializing socket for user:", userId); // Add this

    if (!userId || socketRef.current) return socketRef.current;

    socketRef.current = io("http://localhost:4001", {
      withCredentials: true,
      autoConnect: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      transports: ["websocket"],
    });

    messageTracker.current.clear();

    // In your initializeSocket function
    socketRef.current.on("connect", () => {
      console.log("✅ Socket connected, joining room:", userId); // Add this
      setIsConnected(true);
      reconnectAttempts.current = 0;
      console.log("🏠 Joining room with:", { id: userId, role: userRole }); // Add this
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

          dispatch(addNewMessageToState(message));

          if (
            message.receiverId === userId &&
            (!currentChat || currentChat._id !== message.senderId) &&
            message.read === false
          ) {
            dispatch(updateUnreadCount({ chatId: message.senderId, count: 1 }));
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

    const handleTyping = (senderId) => {
      console.log("👂 Received typing from:", senderId);
      console.log("Previous typing users:", JSON.stringify(typingUsers));

      // Force a state update with a new object
      setTypingUsers((prev) => {
        const newState = { ...prev };
        newState[senderId] = true;
        console.log("New typing users state:", JSON.stringify(newState));
        return newState;
      });
    };

    const handleStopTyping = (senderId) => {
      console.log("👂 Received stop typing from:", senderId);
      console.log("Previous typing users:", JSON.stringify(typingUsers));

      setTypingUsers((prev) => {
        const newState = { ...prev };
        delete newState[senderId];
        console.log("New typing users state:", JSON.stringify(newState));
        return newState;
      });
    };

    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, [isConnected]);

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
  // In your socket setup (frontend)
  const sendTypingStatus = useCallback(
    (receiverId) => {
      if (!socketRef.current || !userId || !receiverId) return;

      // Clear any existing timeout to avoid duplicate "stop-typing" events
      if (typingTimeouts.current[receiverId]) {
        clearTimeout(typingTimeouts.current[receiverId]);
      }

      // Emit typing event
      socketRef.current.emit("typing", {
        senderId: userId,
        receiverId,
        timestamp: Date.now(), // Optional: helps with ordering
      });

      // Set timeout to automatically send stop-typing after 3 seconds of inactivity
      typingTimeouts.current[receiverId] = setTimeout(() => {
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

      // Immediately send stop-typing
      socketRef.current.emit("stop-typing", {
        senderId: userId,
        receiverId,
      });
    },
    [userId]
  );

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
