const User = require("../models/user");
const { hashPassword, comparePassword } = require("../utils/passwordUtils");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = hashPassword(password);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET
    );

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user);

    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    const validPassword = comparePassword(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "invalid email or password" });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateRandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric code
};

exports.forgotPassword = async (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate reset token and expiration
    const resetCode = generateRandomCode();

    // Save reset token and expiration in the user's record (optional)
    user.resetPasswordToken = resetCode;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    const msg = {
      to: user.email,
      from: process.env.SENDGRID_VERIFIED_EMAIL, // Your verified email from SendGrid
      subject: "Discover Halal | Password Reset Code",
      text: `Your Discover Halal password reset code is: ${resetCode}. This code is valid for 1 hour.`,
    };

    await sgMail.send(msg);

    console.log(sgMail);
    res
      .status(200)
      .json({ message: "Password reset code sent to your email." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyResetCode = async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

  try {
    // Find the user by email and check if the reset code matches and hasn't expired
    const user = await User.findOne({
      email: email.toLowerCase(), // Ensure email is lowercase
      resetPasswordToken: resetCode.toString(), // Ensure resetCode is treated as string
      resetPasswordExpires: { $gt: Date.now() }, // Ensure the code hasn't expired
    });

    console.log("Email:", email.toLowerCase());
    console.log("Reset Code:", resetCode.toString());
    console.log("User:", user);

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset code" });
    }

    // Hash the new password and update the user
    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined; // Clear the reset code
    user.resetPasswordExpires = undefined; // Clear the expiration
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user)
      return res.status(400).json({ error: "Invalid or expired token" });

    // Update password
    user.password = await hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
