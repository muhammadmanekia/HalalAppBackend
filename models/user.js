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
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  city: String,
});

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema, "Users");
