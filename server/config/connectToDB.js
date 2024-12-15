import mongoose from "mongoose";
import appConfig from "./appConfig.js";

const initializeDbConnection = async () => {
  // Add event listeners only once (to avoid duplicate logs if `connectToDb` is called multiple times)
  mongoose.connection.once("connected", () => {
    console.log("Successfully connected to MongoDB");
  });

  mongoose.connection.once("disconnected", () => {
    console.log("MongoDB connection closed");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  try {
    // Connect to the database
    await mongoose.connect(appConfig.mongo_uri);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit process on failure
  }
};

export default initializeDbConnection;
