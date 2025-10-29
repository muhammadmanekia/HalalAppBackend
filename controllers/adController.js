const Ads = require("../models/ad");

exports.getAds = async (req, res) => {
  try {
    const ads = await Ads.find();
    console.log(ads);
    res.json(ads);
  } catch (error) {
    console.error("Error fetching ads:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};
