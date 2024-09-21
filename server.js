const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");
const https = require("https");
const http = require("http");
const compression = require("compression");

require("dotenv").config();

const connectDB = require("./config/db"); // Database connection
const authRoutes = require("./routes/authRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const rateLimiter = require("./middlewares/rateLimiter");

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
app.use("/category-images", categoryRoutes);

// HTTPS server setup
const privateKey = fs.readFileSync("./ssl/privateKey.pem", "utf8");
const certificate = fs.readFileSync("./ssl/halal-cert.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

const PORT = process.env.PORT || 4000;

// Use HTTP for local development and HTTPS for production
if (process.env.NODE_ENV === "production") {
  https.createServer(credentials, app).listen(PORT, () => {
    console.log(`Secure server running on port ${PORT}`);
  });
} else {
  http.createServer(app).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
