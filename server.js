const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

function comparePassword(password, hash) {
  const [salt, key] = hash.split(":");
  const hashBuffer = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512");
  return crypto.timingSafeEqual(Buffer.from(key, "hex"), hashBuffer);
}

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

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const categoryImageSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model("User", userSchema, "Users");

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

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  try {
    const hashedPassword = hashPassword(password);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = comparePassword(password, user.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password");

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "10h",
      }
    );

    res.json({ token, name: user.name, email: user.email });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send("Error logging in user");
  }
});

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
