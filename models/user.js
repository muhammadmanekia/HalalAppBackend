const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  googleSignIn: Boolean,
  googleID: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema, "Users");
