const db = require('../config/db');

class DashboardService {
  async getStatistics() {
    try {
      // Use a single query with conditional aggregation for employee stats
      const employeeQuery = `
        SELECT 
          COUNT(*) as totalEmployees,
          SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as activeEmployees,
          SUM(CASE WHEN status = 'On Leave' THEN 1 ELSE 0 END) as onLeaveEmployees,
          SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) as inactiveEmployees
        FROM employees
      `;

      const departmentQuery = `
        SELECT COUNT(*) as totalDepartments 
        FROM departments
      `;

      // Run both queries concurrently
      const [employeeResults, departmentResults] = await Promise.all([
        db.pool.query(employeeQuery),
        db.pool.query(departmentQuery)
      ]);

      const empStats = employeeResults[0][0];
      const deptStats = departmentResults[0][0];

      return {
        totalEmployees: parseInt(empStats.totalEmployees || 0),
        activeEmployees: parseInt(empStats.activeEmployees || 0),
        onLeaveEmployees: parseInt(empStats.onLeaveEmployees || 0),
        inactiveEmployees: parseInt(empStats.inactiveEmployees || 0),
        totalDepartments: parseInt(deptStats.totalDepartments || 0)
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DashboardService();
