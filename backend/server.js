// Load environment variables FIRST, before anything else uses them
require('dotenv').config();

const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Verify database connection before starting the server
    await testConnection();
    console.log('✅ Database connection successful');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`❤️  Health check:    http://localhost:${PORT}/api/health`);
      console.log(`🗄️  DB health check: http://localhost:${PORT}/api/health/db`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
