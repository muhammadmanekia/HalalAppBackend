const Notification = require("../models/notification");

exports.createNotifications = async (req, res) => {
  const { message, recipients } = req.body;
  const notification = new Notification({ message, recipients });
  await notification.save();
  res.status(201).json(notification);
};
