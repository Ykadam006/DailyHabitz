const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
require("dotenv").config();

const habitRoutes = require("./routes/habits");

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Health check - warms up cold-started instances (e.g. Render free tier)
app.get("/health", (_, res) => res.status(200).json({ status: "ok" }));

// Routes
app.use("/habits", habitRoutes);

// Start server only after DB connects
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("✅ Server running at: https://dailyhabitz.onrender.com");
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
