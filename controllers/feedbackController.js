const { AppFeedback, RestaurantFeedback } = require("../models/feedback");

exports.postAppFeedback = async (req, res) => {
  const { user, feedback } = req.body;

  try {
    const appFeedback = new AppFeedback({ user, feedback });
    await appFeedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postRestaurantFeedback = async (req, res) => {
  const { user, feedback, restaurantId, restaurantName, restaurantAddress } =
    req.body;

  try {
    const restaurantFeedback = new RestaurantFeedback({
      user,
      feedback,
      restaurantId,
      restaurantName,
      restaurantAddress,
    });
    await restaurantFeedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRestaurantFeedback = async (req, res) => {
  const { restaurantId } = req.params; // Assuming restaurantId is passed as a URL parameter

  try {
    const feedbacks = await RestaurantFeedback.find({ restaurantId });

    if (!feedbacks.length) {
      return res
        .status(404)
        .json({ message: "No feedback found for this restaurant" });
    }

    res.status(200).json(feedbacks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
