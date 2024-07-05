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
  try {
    const categoryImages = await CategoryImage.findOne({});
    res.json(categoryImages);
  } catch (error) {
    console.error("Error fetching category images:", error);
    res.status(500).send("Error fetching category images");
  }
});

app.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
