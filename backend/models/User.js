const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    name: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("email")) {
    this.email = (this.email || "").toLowerCase().trim();
  }
  if (this.isModified("name")) {
    this.name = (this.name || "").trim();
  }
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
