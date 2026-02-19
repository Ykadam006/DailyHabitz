/**
 * Structured error logging - includes route, userId, requestId.
 * Never logs passwords, tokens, or other secrets.
 */
const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "authorization",
  "cookie",
  "secret",
  "apiKey",
  "api_key",
  "accessToken",
  "refreshToken",
]);

function redact(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(redact);
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const keyLower = k.toLowerCase();
    if (SENSITIVE_KEYS.has(keyLower) || keyLower.includes("password") || keyLower.includes("token")) {
      out[k] = "[REDACTED]";
    } else {
      out[k] = typeof v === "object" && v !== null ? redact(v) : v;
    }
  }
  return out;
}

function logError(err, context = {}) {
  const { route, userId, requestId } = context;
  const meta = {
    route: route || "unknown",
    requestId: requestId || "-",
    userId: userId || null,
    message: err?.message || String(err),
    name: err?.name,
  };
  if (err?.stack && process.env.NODE_ENV !== "production") {
    meta.stack = err.stack;
  }
  console.error(JSON.stringify({ level: "error", ...meta }));
}

function logErrorWithReq(err, req) {
  logError(err, {
    route: req?.method && req?.path ? `${req.method} ${req.path}` : req?.url,
    userId: req?.user?.id,
    requestId: req?.requestId,
  });
}

module.exports = { logError, logErrorWithReq, redact };
