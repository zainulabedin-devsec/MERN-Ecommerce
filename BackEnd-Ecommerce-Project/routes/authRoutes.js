const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  adminDashboard,
} = require("../controllers/authController");

const { protect , authorize } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.get("/admin", protect, authorize("admin"), adminDashboard);

module.exports = router;