const Restaurant = require("../models/restaurant");
const { decryptData, encryptData } = require("../utils/encryptionUtils");
const { calculateDistance } = require("../utils/calculateDistance");
const mongoose = require("mongoose");
const Reviews = require("../models/reviews");
const crypto = require("crypto");

exports.getGroceries = async (req, res) => {
  const { encryptedQuery } = req.query;

  try {
    const decryptedQuery = decryptData(encryptedQuery, process.env.SECRET_KEY);
    const { latitude, longitude, radius = 20 } = decryptedQuery;

    const allRestaurants = await Restaurant.find();

    if (latitude && longitude) {
      const filteredGroceries = allRestaurants
        .map((groceries) => {
          var groceriesObj = groceries.toObject();
          // Calculate the distance
          const distance = calculateDistance(
            latitude,
            longitude,
            groceries.coordinates.latitude,
            groceries.coordinates.longitude
          );

          // Add the distance to the restaurant object
          groceriesObj.distance = distance.toFixed(2); // Store distance as a new key

          return groceriesObj;
        })

        .filter((grocery) => {
          // Filter restaurants based on categories that include either "Halal Meat" or "Groceries"
          return (
            (grocery.categories.includes("HALAL MEAT") ||
              grocery.categories.includes("GROCERIES")) &&
            grocery.distance <= radius
          );
        })
        .sort((a, b) => a.distance - b.distance);

      console.log(filteredGroceries);

      const encryptedResponse = encryptData(
        filteredGroceries,
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
  const { restaurantId } = req.params; // Assuming restaurantId is passed as a URL parameter
  const {
    rating,
    author_name,
    text,
    profile_photo_url,
    relative_time_description,
  } = req.body;

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).send("Restaurant not found");
    }

    const review = new Reviews({
      restaurant_id: restaurant._id,
      author_name,
      rating,
      text,
      time: new Date(), // Store the current date/time
      profile_photo_url,
      relative_time_description,
    });

    await review.save(); // Save the review to the 'Reviews' collection
    res.status(201).json(review); // Send the saved review as the response
  } catch (error) {
    console.error("Error posting review:", error);
    res.status(500).send("Error posting review");
  }
};

exports.getReview = async (req, res) => {
  const { restaurantId } = req.params; // Assuming restaurantId is passed as a URL parameter
  try {
    const reviews = await Reviews.find({
      restaurant_id: new mongoose.Types.ObjectId(`${restaurantId}`),
    });

    if (!reviews || reviews.length === 0) {
      return res
        .status(404)
        .json({ error: "No reviews found for this restaurant." });
    }

    res.json(reviews); // Return the list of reviews for the restaurant
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: error.message });
  }
};