const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  image_url: String,
  rating: String,
  price: String,
  categories: Array,
  coordinates: Object,
  quickFacts: Array,
  time: String,
  website: String,
  phone_number: String,
  reviews: Array,
});

module.exports = mongoose.model("Restaurant", restaurantSchema, "Restaurants");
