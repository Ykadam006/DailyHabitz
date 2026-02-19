const mongoose = require("mongoose");
require("dotenv").config();

/**
 * Global connection cache - avoids opening new connections per request.
 * Critical for Atlas free tier (500 connection limit).
 * Reuses existing connection if already connected.
 */
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) return cachedConnection;
  if (mongoose.connection.readyState === 1) {
    cachedConnection = mongoose.connection;
    return cachedConnection;
  }

  try {
    console.log("🧪 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });
    cachedConnection = mongoose.connection;
    console.log("✅ MongoDB connected!");
    return cachedConnection;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
};

module.exports = connectDB;
