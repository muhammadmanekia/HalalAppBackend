const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");

require("dotenv").config();

const connectDB = require("./config/db"); // Database connection
const authRoutes = require("./routes/authRoutes");
const groceryRoutes = require("./routes/groceryRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const adsRoutes = require("./routes/adsRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const rateLimiter = require("./middlewares/rateLimiter");
const menuRoutes = require("./routes/menuRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(compression());

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

connectDB();

// Rate limiter for all non-GET routes
app.use((req, res, next) => {
  if (req.method !== "GET") {
    rateLimiter(req, res, next);
  } else {
    next();
  }
});

<<<<<<< Updated upstream
// Routes
app.use("/auth", authRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/groceries", groceryRoutes);
app.use("/category-images", categoryRoutes);
app.use("/ads", adsRoutes);
app.use("/recommendation", recommendationRoutes);
app.use("/notification", notificationRoutes);
app.use("/menu", menuRoutes);
app.use("/create-payment-intent", paymentRoutes);
=======
app.post("/postAppFeedback", async (req, res) => {
  const { user, feedback } = req.body;
  console.log(req.body);
  try {
    const appFeedback = new AppFeedback({ user, feedback });
    await appFeedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error sending feedback:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.post("/postRestaurantFeedback", async (req, res) => {
  const { user, feedback } = req.body;
  console.log(req.body);
  try {
    const restaurantFeedback = new RestaurantFeedback({ user, feedback });
    await restaurantFeedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error sending feedback:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    const validPassword = comparePassword(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET
    );

    res.json({ token, id: user._id, name: user.name, email: user.email });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
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
    res.status(500).json({ error: error.message, stack: error.stack });
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
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Add authenticateToken to the reviews POST endpoint
app.post(
  "/restaurants/:restaurantId/reviews",
  authenticateToken,
  async (req, res) => {
    const { restaurantId } = req.params;
    const { rating, user, comment } = req.body;

    try {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) return res.status(404).send("Restaurant not found");

      const review = {
        user,
        rating,
        comment,
        date: new Date(),
      };

      restaurant.reviews.push(review);
      await restaurant.save();
      res.status(201).json(review);
    } catch (error) {
      console.error("Error posting review:", error);
      res.status(500).send("Error posting review");
    }
  }
);

// Get reviews for a restaurant
app.get("/restaurants/:id/reviews", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "reviews.user",
      "name"
    ); // Populate user field if you want to include user details
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found." });
    }
    res.json(restaurant.reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
>>>>>>> Stashed changes

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
