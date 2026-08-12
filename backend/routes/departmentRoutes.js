const express = require("express");
const { getDepartments } = require("../controllers/departmentController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Authenticated — Admin and HR
router.get("/", authMiddleware, authorizeRoles("Admin", "HR"), getDepartments);

module.exports = router;
