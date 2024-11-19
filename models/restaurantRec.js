const mongoose = require("mongoose");

const restaurantRecommendationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    address: { type: String, required: true },
    name: { type: String, required: true },
    owner: {
      type: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
      },
      required: false,
    },
    date: { type: Date, default: Date.now },
  },
  { strict: true }
);

module.exports = mongoose.model(
  "RestaurantRecommendation",
  restaurantRecommendationSchema,
  "RestaurantRecommendation"
);
