const express = require("express");
const cors = require("cors");
const habitRoutes = require("./routes/habits");
const authRoutes = require("./routes/auth");
const { requestContext } = require("./middleware/requestContext");
const { getHealth } = require("./lib/health");

const app = express();

const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000,https://dailyhabitz-1.onrender.com")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(requestContext);
app.use(
  cors({
    origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
    credentials: true,
    exposedHeaders: ["Authorization", "x-request-id"],
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.redirect(301, "/health");
});

app.get("/health", async (_, res) => {
  try {
    const health = await getHealth();
    const statusCode = health.db === "healthy" ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (err) {
    res.status(503).json({
      status: "unhealthy",
      app: "error",
      db: "unknown",
      version: "unknown",
      error: err?.message || "Health check failed",
      timestamp: new Date().toISOString(),
    });
  }
});

app.use("/auth", authRoutes);
app.use("/habits", habitRoutes);

app.use((err, req, res, _next) => {
  const { logErrorWithReq } = require("./lib/logger");
  logErrorWithReq(err, req);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
