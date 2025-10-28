const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: String,
  body: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "Notification",
  notificationSchema,
  "Notification"
);
