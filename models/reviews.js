const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  }, // Reference to the restaurant
  author_name: { type: String, required: true }, // Author's name
  rating: { type: Number, required: true }, // Rating given by the user
  text: { type: String, required: true }, // Review text
  time: { type: Date, required: true }, // Date of the review
  profile_photo_url: { type: String }, // URL to the author's profile photo
  relative_time_description: { type: String }, // Relative time description like "9 months ago"
});

module.exports = mongoose.model("Reviews", reviewSchema, "Reviews");
