const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  type: String,
  screen: String,
  discount: String,
  code: String,
  banner: String,
  city: String,
  endDate: Date,
  startDate: Date,
  restaurant_id: mongoose.Schema.Types.ObjectId,
  task: String,
});

module.exports = mongoose.model("Ads", adSchema, "Ads");
