const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// GET /api/health — basic server health check
router.get('/health', healthController.checkHealth);

// GET /api/health/db — database connection test
router.get('/health/db', healthController.checkDatabase);

module.exports = router;
