const express = require("express");
const router = express.Router();
const { getGroceries } = require("../controllers/groceryController");

router.get("/", getGroceries);

module.exports = router;
