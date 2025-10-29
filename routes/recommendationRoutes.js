const express = require("express");
const router = express.Router();
const {
  createRecommendation,
} = require("../controllers/recommendationController");

router.post("/", createRecommendation);

module.exports = router;
