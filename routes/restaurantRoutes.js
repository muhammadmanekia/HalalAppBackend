const express = require("express");
const router = express.Router();
const {
  getRestaurants,
  postReview,
  getReview,
} = require("../controllers/restaurantController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/", getRestaurants);
router.post("/:restaurantId/reviews", authenticateToken, postReview);
router.get("/:id/reviews", getReview);

module.exports = router;
