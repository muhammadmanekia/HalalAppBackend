const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  feedback: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = {
  AppFeedback: mongoose.model("AppFeedback", feedbackSchema),
  RestaurantFeedback: mongoose.model("RestaurantFeedback", feedbackSchema),
};
