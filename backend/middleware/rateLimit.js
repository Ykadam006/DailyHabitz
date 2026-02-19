const rateLimit = require("express-rate-limit");

/** Rate limit for auth endpoints - protects login from brute force. Disabled in test. */
const authRateLimiter =
  process.env.NODE_ENV === "test"
    ? (req, res, next) => next()
    : rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 10,
        message: { error: "Too many attempts. Try again in 15 minutes." },
        standardHeaders: true,
        legacyHeaders: false,
      });

module.exports = { authRateLimiter };
