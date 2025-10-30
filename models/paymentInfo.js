const mongoose = require("mongoose");

const paymentInfoSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  clientSecret: {
    type: String,
    required: true,
  },
  cart: {
    type: Object, // You can define a more specific schema if needed
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PaymentInfo", paymentInfoSchema);
