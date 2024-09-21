const User = require("../models/user");
const { hashPassword, comparePassword } = require("../utils/passwordUtils");
const jwt = require("jsonwebtoken");

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
