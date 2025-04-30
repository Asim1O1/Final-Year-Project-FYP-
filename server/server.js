import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import appConfig from "./config/appConfig.js";
import initializeDbConnection, {
  closeDbConnection,
} from "./config/connectToDB.js";

const port = appConfig.port;

export const onlineUsers = new Map();

const initializeServer = async () => {
  try {
    await initializeDbConnection();
    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    app.set("socketio", io);

    io.on("connection", (socket) => {
      console.log("🔗 A user connected:", socket.id);

      // User joins the chat

      // Handle user authentication and room joining
      socket.on("join-room", ({ id, role }) => {
        if (!id || !role) {
          console.error("NO ID AND ROLE PROVIDED");
          return;
        }
        try {
          const userId = id.toString();
          onlineUsers.set(userId, socket.id);
          socket.join(userId);
          console.log(`🏠 ${role} ${userId} connected (Socket: ${socket.id})`);
          io.emit("update-online-users", Array.from(onlineUsers.keys()));
        } catch (error) {
          console.error("Error in join-room:", error);
        }
      });

      // Handle typing event - Add detailed logging
      socket.on("typing", ({ senderId, receiverId }) => {
        console.log(`✍️ Typing Event: ${senderId} → ${receiverId}`);

        // Verify both users exist
        if (!onlineUsers.has(senderId)) {
          console.warn(`Sender ${senderId} not in online users!`);
        }
        if (!onlineUsers.has(receiverId)) {
          console.warn(`Receiver ${receiverId} not online!`);
        }

        // Debug room existence
        const rooms = io.sockets.adapter.rooms;
        console.log(`Available rooms: ${Array.from(rooms.keys())}`);

        io.to(receiverId).emit("typing", senderId);
      });

      // Handle stop typing event - Add logging
      socket.on("stop-typing", ({ senderId, receiverId }) => {
        console.log(`🛑 Stop Typing: ${senderId} → ${receiverId}`);
        io.to(receiverId).emit("stop-typing", senderId);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        const disconnectedUser = [...onlineUsers.entries()].find(
          ([_, id]) => id === socket.id
        );
        if (disconnectedUser) {
          onlineUsers.delete(disconnectedUser[0]);
          io.emit("update-online-users", Array.from(onlineUsers.keys()));
        }
        console.log("❌ A user disconnected:", socket.id);
      });
    });

    server.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });

    // Handle graceful shutdown
    const shutdown = async () => {
      console.log("\n🛑 Shutting down server...");
      await closeDbConnection();
      server.close(() => {
        console.log("✅ Server shut down successfully.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("❌ Error while starting the server:", error);
    process.exit(1);
  }
};

initializeServer();
