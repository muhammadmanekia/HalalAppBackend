const express = require("express");
const router = express.Router();
const {
  postAppFeedback,
  postRestaurantFeedback,
  getRestaurantFeedback,
} = require("../controllers/feedbackController");
const authenticateToken = require("../middlewares/authMiddleware");

router.post("/app", authenticateToken, postAppFeedback);
router.post("/restaurant", authenticateToken, postRestaurantFeedback);
router.get("/restaurant/:restaurantId", getRestaurantFeedback);

module.exports = router;
