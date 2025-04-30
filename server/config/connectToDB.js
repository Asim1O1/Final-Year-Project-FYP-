import mongoose from "mongoose";
import appConfig from "./appConfig.js";

const mongoURI = appConfig.mongo_uri;

const initializeDbConnection = async (retries = 5, delay = 5000) => {
  try {
    mongoose.connection.once("connected", () => {
      console.log("✅ Successfully connected to MongoDB");
    });

    mongoose.connection.once("disconnected", () => {
      console.log("⚠️ MongoDB connection closed");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    // Connect to MongoDB
    await mongoose.connect(mongoURI);
  } catch (error) {
    console.error(`❌ Failed to connect to MongoDB: ${error.message}`);

    if (retries > 0) {
      console.log(
        `🔄 Retrying connection in ${
          delay / 1000
        } seconds... (${retries} attempts left)`
      );
      setTimeout(() => initializeDbConnection(retries - 1, delay), delay);
    } else {
      console.error("⛔ No more retry attempts left. Exiting process.");
      process.exit(1); // Exit process if all retries fail
    }
  }
};

// Gracefully close MongoDB connection
export const closeDbConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed successfully.");
  } catch (error) {
    console.error("❌ Error while closing MongoDB connection:", error);
  }
};

export default initializeDbConnection;
