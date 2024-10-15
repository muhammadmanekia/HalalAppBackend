const express = require("express");
const router = express.Router();
const {
  register,
  login,
  deleteAccount,
  forgotPassword,
  verifyResetCode,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyResetCode);
router.delete("/delete/:userId", deleteAccount);
module.exports = router;
