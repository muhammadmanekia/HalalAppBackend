const mongoose = require("mongoose");

const categoryImageSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model(
  "CategoryImages",
  categoryImageSchema,
  "CategoryImages"
);
