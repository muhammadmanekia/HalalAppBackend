const Restaurant = require("../models/restaurant");
const { decryptData, encryptData } = require("../utils/encryptionUtils");
const { calculateDistance } = require("../utils/calculateDistance");
const crypto = require("crypto");

exports.getRestaurants = async (req, res) => {
  const { encryptedQuery } = req.query;

  try {
    const decryptedQuery = decryptData(encryptedQuery, process.env.SECRET_KEY);
    const { latitude, longitude, radius = 20 } = decryptedQuery;

    const allRestaurants = await Restaurant.find();

    if (latitude && longitude) {
      const filteredRestaurants = allRestaurants.filter((restaurant) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          restaurant.coordinates.latitude,
          restaurant.coordinates.longitude
        );
        return distance <= radius;
      });

      const encryptedResponse = encryptData(
        filteredRestaurants,
        process.env.SECRET_KEY
      );

      res.json(encryptedResponse);
    } else {
      res.json(allRestaurants);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postReview = async (req, res) => {
  const { restaurantId } = req.params;
  const { rating, user, comment } = req.body;

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).send("Restaurant not found");

    const review = {
      user,
      rating,
      comment,
      date: new Date(),
    };

    restaurant.reviews.push(review);
    await restaurant.save();
    res.status(201).json(review);
  } catch (error) {
    console.error("Error posting review:", error);
    res.status(500).send("Error posting review");
  }
};

exports.getReview = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "reviews.user",
      "name"
    ); // Populate user field if you want to include user details
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found." });
    }
    res.json(restaurant.reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
