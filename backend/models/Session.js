const mongoose = require("mongoose");
const crypto = require("crypto");

// Short-lived access token: 60 min default (configurable). Env: SESSION_MAX_AGE_MINUTES
const SESSION_MAX_AGE_MINUTES = parseInt(
  process.env.SESSION_MAX_AGE_MINUTES || "60",
  10
) || 60;

const sessionSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expiresAt: { type: Date, required: true },
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL - auto-delete expired

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function getExpiresAt() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + SESSION_MAX_AGE_MINUTES);
  return d;
}

sessionSchema.statics.createForUser = async function (userId) {
  const token = generateToken();
  await this.create({
    token,
    userId,
    expiresAt: getExpiresAt(),
  });
  return token;
};

sessionSchema.statics.findByToken = async function (token) {
  return this.findOne({ token, expiresAt: { $gt: new Date() } })
    .populate("userId", "email name")
    .lean();
};

sessionSchema.statics.deleteByToken = async function (token) {
  await this.deleteOne({ token });
};

sessionSchema.statics.refreshToken = async function (oldToken) {
  const session = await this.findOne({ token: oldToken, expiresAt: { $gt: new Date() } })
    .populate("userId", "email name");
  if (!session?.userId) return null;
  const newToken = generateToken();
  await this.updateOne(
    { _id: session._id },
    { token: newToken, expiresAt: getExpiresAt() }
  );
  const user = session.userId;
  return {
    token: newToken,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
  };
};

module.exports = mongoose.model("Session", sessionSchema);
