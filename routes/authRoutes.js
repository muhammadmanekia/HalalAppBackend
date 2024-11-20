const express = require("express");
const router = express.Router();
const {
  register,
  login,
  deleteAccount,
  forgotPassword,
  verifyResetCode,
  checkEmail,
  googleLogin,
} = require("../controllers/authController");

router.post("/register", register);
router.get("/check-email", checkEmail);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyResetCode);
router.delete("/delete/:userId", deleteAccount);
module.exports = router;
