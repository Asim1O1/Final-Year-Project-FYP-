// server.js
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import appConfig from "./config/appConfig.js";
import initializeDbConnection, {
  closeDbConnection,
} from "./config/connectToDB.js";

const port = appConfig.port;

const initializeServer = async () => {
  try {
    // Connect to the database
    await initializeDbConnection();

    // Create an HTTP server
    const server = http.createServer(app);

    // Initialize WebSocket server
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:5173", // Allow your frontend origin
        methods: ["GET", "POST"], // Allowed HTTP methods
        credentials: true, // Allow credentials (cookies, authorization headers)
      },
    });

    // Attach WebSocket instance to the app for use in controllers
    app.set("socketio", io);

    // WebSocket connection handler
    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      // Join a room for the user (e.g., user ID)
      socket.on("join-room", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
      });
    });

    // Start the server
    server.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}...`);
    });

    // Handle graceful shutdown
    const shutdown = async () => {
      console.log("\n🛑 Shutting down server...");
      await closeDbConnection(); // Close DB connection if applicable
      server.close(() => {
        console.log("✅ Server shut down successfully.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown); // Ctrl+C
    process.on("SIGTERM", shutdown); // Termination signal
  } catch (error) {
    console.error("❌ Error while starting the server:", error);
    process.exit(1);
  }
};

// Global error handlers
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

initializeServer();
