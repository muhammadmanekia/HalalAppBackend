const RestaurantMenu = require("../models/menu");

exports.getMenu = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const menu = await RestaurantMenu.find({ restaurant: restaurantId });
    console.log(menu);
    res.json(menu);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};
