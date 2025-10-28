const Notification = require("../models/notification");
const admin = require("firebase-admin");
const User = require("../models/user");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      require("../halalapp-458dc-firebase-adminsdk-1gfyg-10c34b45e2.json")
    ),
  });
}

// Initialize once globally in your server.js or similar file
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
//   });
// }

const RADIUS_MILES = 25;
const EARTH_RADIUS_MILES = 3963.2;

exports.createNotifications = async (req, res) => {
  try {
    const { title, body, coordinates } = req.body;
    console.log(req.body);
    const notification = new Notification({
      title,
      body,
      location: coordinates,
    });
    await sendNotificationToRegion(title, body, coordinates);
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller
const sendNotificationToRegion = async (title, body, coordinates) => {
  try {
    const [latitude, longitude] = coordinates;

    const nearbyUsers = await User.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [longitude, latitude],
            RADIUS_MILES / EARTH_RADIUS_MILES, // convert miles to radians
          ],
        },
      },
    });

    console.log(nearbyUsers);

    // Send notifications (you can loop and use Firebase Admin or FCM)
    for (const user of nearbyUsers) {
      await sendNotificationToToken(user.fcmToken, title, body);
    }
  } catch (error) {
    console.error("FCM error:", error);
  }
};

const sendNotificationToToken = async (fcmToken, title, body) => {
  console.log(fcmToken, title, body);
  await admin.messaging().send({
    token: fcmToken,
    notification: {
      title: title,
      body: body,
    },
    android: {
      notification: {
        sound: "default",
      },
    },
  });
};
