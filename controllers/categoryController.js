const CategoryImages = require("../models/category");

exports.getCategories = async (req, res) => {
  const { categories } = req.query;

  try {
    const categoryImages = await CategoryImages.findOne({});
    const relevantCategoryImages = Object.fromEntries(
      Object.entries(categoryImages).filter(([category]) =>
        categories.includes(category)
      )
    );

    res.json(relevantCategoryImages);
  } catch (error) {
    console.error("Error fetching category images:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};
