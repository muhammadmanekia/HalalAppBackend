const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: String,
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});

module.exports = mongoose.model(
  "Notification",
  notificationSchema,
  "Notification"
);
