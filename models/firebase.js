const mongoose = require("mongoose");

const firebaseSchema = new mongoose.Schema({
  fcmToken: String,
  location: String,
});

module.exports = mongoose.model("Firebase", firebaseSchema, "Firebase");
