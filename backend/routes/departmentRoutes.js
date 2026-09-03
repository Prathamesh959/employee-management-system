const express = require("express");
const { 
    getDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment 
} = require("../controllers/departmentController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Authenticated — Admin and HR
router.get("/", authMiddleware, authorizeRoles("Admin", "HR"), getDepartments);
router.get("/:id", authMiddleware, authorizeRoles("Admin", "HR"), getDepartmentById);

// Admin Only Mutations
router.post("/", authMiddleware, authorizeRoles("Admin"), createDepartment);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), updateDepartment);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), deleteDepartment);

module.exports = router;
