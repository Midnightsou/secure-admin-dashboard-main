const express = require("express");
const router = express.Router();
const {
  sendOtp,
  verifyOtp,
  register,
} = require("../controllers/authController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", register);

module.exports = router;
