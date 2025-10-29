const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurants",
    required: true,
  },
  menu: { type: Array },
});

module.exports = mongoose.model(
  "RestaurantMenu",
  menuSchema,
  "RestaurantMenus"
);
