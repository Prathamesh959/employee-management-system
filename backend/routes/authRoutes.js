const express = require("express");
const { login, getProfile, updateProfile, changePassword } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);

// Authenticated user endpoints
router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;
