const RestaurantRecommendation = require("../models/restaurantRec");

exports.createRecommendation = async (req, res) => {
  const { name, address, owner, userId, userName, userEmail } = req.body;
  console.log(req.body);

  try {
    const newRecommendation = new RestaurantRecommendation({
      userId,
      address,
      name,
      owner,
    });

    const savedRecommendation = await newRecommendation.save();
    res.status(201).json({
      message: "Restaurant recommendation created successfully",
      recommendation: savedRecommendation,
    });
  } catch (error) {
    console.error("Error creating restaurant recommendation:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};
