const Session = require("../models/Session");
const { logErrorWithReq } = require("../lib/logger");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const session = await Session.findByToken(token);
    if (!session?.userId) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }
    const user = session.userId;
    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
    next();
  } catch (err) {
    logErrorWithReq(err, req);
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}

module.exports = { authMiddleware };
