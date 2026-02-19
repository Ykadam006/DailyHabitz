const connectDB = require("./db");
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 5050;

// Start server only after DB connects
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT} (http://localhost:${PORT})`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
