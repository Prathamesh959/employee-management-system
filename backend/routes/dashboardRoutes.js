const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/dashboard/stats
router.get('/stats', authMiddleware, dashboardController.getStats);
router.get('/employee-growth', authMiddleware, dashboardController.getEmployeeGrowth);
router.get('/department-distribution', authMiddleware, dashboardController.getDepartmentDistribution);
router.get('/recent-employees', authMiddleware, dashboardController.getRecentEmployees);

module.exports = router;
