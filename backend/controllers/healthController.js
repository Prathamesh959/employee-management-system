const { testConnection } = require('../config/db');

/**
 * GET /api/health
 * Basic health check — confirms the Express server is running.
 */
const checkHealth = (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
};

/**
 * GET /api/health/db
 * Database health check — confirms Node.js can connect to MySQL.
 */
const checkDatabase = async (req, res) => {
  try {
    await testConnection();
    res.status(200).json({
      status: 'OK',
      message: 'Database connection successful',
      database: process.env.DB_NAME,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

module.exports = { checkHealth, checkDatabase };
