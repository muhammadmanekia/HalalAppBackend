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
  const { user, feedback } = req.body;

  try {
    const restaurantFeedback = new RestaurantFeedback({ user, feedback });
    await restaurantFeedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
