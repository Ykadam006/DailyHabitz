const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
require("dotenv").config();

const habitRoutes = require("./routes/habits");

const app = express();
const PORT = process.env.PORT || 5050;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/habits", habitRoutes);

// Start server only after DB connects
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running at ${BASE_URL}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
