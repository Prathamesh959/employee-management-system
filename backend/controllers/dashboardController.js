const dashboardService = require('../services/dashboardService');

class DashboardController {
  async getStats(req, res) {
    try {
      const stats = await dashboardService.getStatistics();
      
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while fetching dashboard statistics.'
      });
    }
  }
}

module.exports = new DashboardController();
