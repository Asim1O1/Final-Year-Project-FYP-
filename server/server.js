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

    // Start the server
    const server = app.listen(port, () => {
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
