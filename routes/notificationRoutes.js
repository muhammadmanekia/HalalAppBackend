const express = require("express");
const router = express.Router();
const {
  createNotifications,
} = require("../controllers/notificationsController");

router.post("/", createNotifications);

module.exports = router;
