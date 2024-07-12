const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

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
});

const categoryImageSchema = new mongoose.Schema({}, { strict: false });

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in miles
  return distance;
}

const Restaurant = mongoose.model(
  "Restaurant",
  restaurantSchema,
  "Restaurants"
);
const CategoryImage = mongoose.model(
  "CategoryImages",
  categoryImageSchema,
  "CategoryImages"
);

app.get("/category-images", async (req, res) => {
  const { categories } = req.query;

  try {
    const categoryImages = await CategoryImage.findOne({});
    const relevantCategoryImages = Object.fromEntries(
      Object.entries(categoryImages).filter(([category]) =>
        categories.includes(category)
      )
    );

    res.json(relevantCategoryImages);
  } catch (error) {
    console.error("Error fetching category images:", error);
    res.status(500).send("Error fetching category images");
  }
});

app.get("/restaurants", async (req, res) => {
  const { latitude, longitude, radius = 20 } = req.query;

  try {
    const allRestaurants = await Restaurant.find();

    if (latitude && longitude) {
      const filteredRestaurants = allRestaurants
        .map((restaurant) => {
          const distance = calculateDistance(
            parseFloat(latitude),
            parseFloat(longitude),
            restaurant.coordinates.latitude,
            restaurant.coordinates.longitude
          );
          return { ...restaurant.toObject(), distance };
        })
        .filter((restaurant) => restaurant.distance <= radius)
        .sort((a, b) => a.distance - b.distance);

      res.json(filteredRestaurants);
    } else {
      res.json(allRestaurants);
    }
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).send("Error fetching restaurants");
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
