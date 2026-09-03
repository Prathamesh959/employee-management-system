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

  async getEmployeeGrowth() {
    try {
      const query = `
        SELECT * FROM (
          SELECT 
            DATE_FORMAT(joining_date, '%b') as month,
            YEAR(joining_date) as year,
            MONTH(joining_date) as monthNum,
            COUNT(*) as count
          FROM employees
          WHERE joining_date IS NOT NULL
          GROUP BY year, monthNum, month
          ORDER BY year DESC, monthNum DESC
          LIMIT 6
        ) sub
        ORDER BY year ASC, monthNum ASC
      `;
      const [results] = await db.pool.query(query);
      return results.map(row => ({
        month: row.month,
        count: row.count
      }));
    } catch (error) {
      throw error;
    }
  }

  async getDepartmentDistribution() {
    try {
      const query = `
        SELECT 
          d.name as department, 
          COUNT(e.id) as count 
        FROM departments d
        LEFT JOIN employees e ON d.id = e.department_id
        GROUP BY d.id, d.name
        ORDER BY count DESC
      `;
      const [results] = await db.pool.query(query);
      return results;
    } catch (error) {
      throw error;
    }
  }

  async getRecentEmployees() {
    try {
      const query = `
        SELECT
            e.id,
            e.employee_id,
            e.first_name,
            e.last_name,
            e.email,
            e.designation,
            e.joining_date,
            e.status,
            d.name AS department
        FROM employees e
        LEFT JOIN departments d
            ON e.department_id = d.id
        ORDER BY e.id DESC
        LIMIT 5
      `;
      const [results] = await db.pool.query(query);
      return results;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DashboardService();
