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
  fcmToken: {
    type: String,
    default: null,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  city: String,
});

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema, "Users");
