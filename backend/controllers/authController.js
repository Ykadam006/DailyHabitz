const User = require("../models/User");
const Session = require("../models/Session");
const { logErrorWithReq } = require("../lib/logger");

exports.register = async (req, res) => {
  const { email, password, name } = req.body;
  const emailNorm = (email || "").toLowerCase().trim();
  try {
    const existing = await User.findOne({ email: emailNorm });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }
    const user = new User({ email: emailNorm, password, name: (name || "").trim() });
    await user.save();
    const token = await Session.createForUser(user._id);
    res.status(201).json({
      token,
      user: { id: user._id.toString(), email: user.email, name: user.name },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already registered" });
    }
    logErrorWithReq(err, req);
    res.status(500).json({ error: "Failed to register" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: (email || "").toLowerCase().trim() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = await Session.createForUser(user._id);
    res.status(200).json({
      token,
      user: { id: user._id.toString(), email: user.email, name: user.name },
    });
  } catch (err) {
    logErrorWithReq(err, req);
    res.status(500).json({ error: "Failed to login" });
  }
};

exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (token) {
      await Session.deleteByToken(token);
    }
    res.status(204).end();
  } catch (err) {
    logErrorWithReq(err, req);
    res.status(500).json({ error: "Failed to logout" });
  }
};

exports.refresh = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Token required" });
  }
  try {
    const result = await Session.refreshToken(token);
    if (!result) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    res.status(200).json(result);
  } catch (err) {
    logErrorWithReq(err, req);
    res.status(500).json({ error: "Failed to refresh" });
  }
};
