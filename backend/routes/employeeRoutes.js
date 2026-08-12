const express = require("express");
const { getEmployees, addEmployee, getEmployeeById, updateEmployee, removeEmployee } = require("../controllers/employeeController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Authenticated routes — Admin and HR
router.get("/", authMiddleware, authorizeRoles("Admin", "HR"), getEmployees);
router.get("/:id", authMiddleware, authorizeRoles("Admin", "HR"), getEmployeeById);
router.post("/", authMiddleware, authorizeRoles("Admin", "HR"), addEmployee);
router.put("/:id", authMiddleware, authorizeRoles("Admin", "HR"), updateEmployee);

// Admin only
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), removeEmployee);

module.exports = router;