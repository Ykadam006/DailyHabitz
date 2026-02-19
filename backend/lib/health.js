const mongoose = require("mongoose");
const { readFileSync } = require("fs");
const { join } = require("path");

let version = "unknown";
try {
  const pkg = JSON.parse(
    readFileSync(join(__dirname, "..", "package.json"), "utf8")
  );
  version = pkg.version || "unknown";
} catch {
  // ignore
}

async function checkDb() {
  const state = mongoose.connection.readyState;
  if (state === 1) {
    try {
      await mongoose.connection.db.admin().ping();
      return "healthy";
    } catch (err) {
      return "unhealthy";
    }
  }
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  return states[state] ?? "unknown";
}

async function getHealth() {
  const dbStatus = await checkDb();
  const appStatus = dbStatus === "healthy" ? "healthy" : "degraded";
  return {
    status: appStatus,
    app: "running",
    db: dbStatus,
    version,
    timestamp: new Date().toISOString(),
  };
}

module.exports = { getHealth };
