const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");

require("dotenv").config();

const connectDB = require("./config/db"); // Database connection
const authRoutes = require("./routes/authRoutes");
const groceryRoutes = require("./routes/groceryRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
// const notificationRoutes = require("./routes/notificationRoutes");
// const recommendationRoutes = require("./routes/recommendationRoutes");
const adsRoutes = require("./routes/adsRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const rateLimiter = require("./middlewares/rateLimiter");
// const menuRoutes = require("./routes/menuRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");

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

// Routes
app.use("/auth", authRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/groceries", groceryRoutes);
app.use("/category-images", categoryRoutes);
app.use("/ads", adsRoutes);
// app.use("/recommendation", recommendationRoutes);
// app.use("/notification", notificationRoutes);
// app.use("/menu", menuRoutes);
// app.use("/create-payment-intent", paymentRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
