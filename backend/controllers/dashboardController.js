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

  async getEmployeeGrowth(req, res) {
    try {
      const data = await dashboardService.getEmployeeGrowth();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Error fetching employee growth:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async getDepartmentDistribution(req, res) {
    try {
      const data = await dashboardService.getDepartmentDistribution();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Error fetching department distribution:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async getRecentEmployees(req, res) {
    try {
      const data = await dashboardService.getRecentEmployees();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Error fetching recent employees:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

module.exports = new DashboardController();
