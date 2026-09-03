import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [recentEmployees, setRecentEmployees] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, growthRes, deptRes, recentRes] = await Promise.allSettled([
          api.get('/dashboard/stats'),
          api.get('/dashboard/employee-growth'),
          api.get('/dashboard/department-distribution'),
          api.get('/dashboard/recent-employees')
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
          setStats(statsRes.value.data.data);
        } else {
          throw new Error("Failed to load core stats");
        }

        if (growthRes.status === 'fulfilled' && growthRes.value.data.success) {
          setGrowthData(growthRes.value.data.data);
        }

        if (deptRes.status === 'fulfilled' && deptRes.value.data.success) {
          setDepartmentData(deptRes.value.data.data);
        }

        if (recentRes.status === 'fulfilled' && recentRes.value.data.success) {
          setRecentEmployees(recentRes.value.data.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Unable to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return "badge-active";
      case "on leave": return "badge-on-leave";
      case "inactive": return "badge-inactive";
      default: return "badge-default";
    }
  };

  // Helper for Bar Chart
  const maxGrowthCount = growthData.length > 0 ? Math.max(...growthData.map(d => d.count), 1) : 1;

  // Helper for Donut Chart — pre-compute offsets to avoid mutation during render
  const totalDeptCount = departmentData.reduce((sum, d) => sum + parseInt(d.count), 0) || 1;
  const donutColors = ['#4f46e5', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#64748b'];
  const donutSegments = (() => {
    let offset = 25; // start from top (SVG rotated -90deg, +25 shifts start point)
    return departmentData.map((d, i) => {
      const pct = (parseInt(d.count) / totalDeptCount) * 100;
      const seg = { pct, offset, color: donutColors[i % donutColors.length] };
      offset += pct;
      return seg;
    });
  })();

  return (
    <div className="dashboard-content">
      <div className="dashboard-header-flex">
        <div>
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">Welcome back, {user?.name}. Here is the latest company data.</p>
        </div>
        {stats && (
          <div className="dept-pill">
            <span className="dept-pill-value">{stats.totalDepartments}</span>
            <span className="dept-pill-label">Departments</span>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      ) : error ? (
        <div className="dashboard-error">
          <p>{error}</p>
        </div>
      ) : stats ? (
        <>
          {/* KPI Cards */}
          <div className="dashboard-stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper text-indigo bg-indigo-light">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="stat-info">
                <h3 className="stat-title">Total Employees</h3>
                <p className="stat-value">{stats.totalEmployees}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon-wrapper text-emerald bg-emerald-light">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="stat-info">
                <h3 className="stat-title">Active</h3>
                <p className="stat-value">{stats.activeEmployees}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon-wrapper text-amber bg-amber-light">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="stat-info">
                <h3 className="stat-title">On Leave</h3>
                <p className="stat-value">{stats.onLeaveEmployees}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon-wrapper text-rose bg-rose-light">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <div className="stat-info">
                <h3 className="stat-title">Inactive</h3>
                <p className="stat-value">{stats.inactiveEmployees}</p>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="dashboard-charts-row">
            {/* Growth Chart */}
            <div className="chart-card">
              <h3 className="chart-title">Employee Growth (Last 6 Months)</h3>
              <div className="bar-chart-container">
                {growthData.length === 0 ? (
                  <div className="chart-empty">No data available</div>
                ) : (
                  <div className="bar-chart">
                    {growthData.map((d, i) => {
                      const heightPercent = (d.count / maxGrowthCount) * 100;
                      return (
                        <div key={i} className="bar-group">
                          <div className="bar-value">{d.count}</div>
                          <div className="bar-track">
                            <div className="bar-fill" style={{ height: `${Math.max(heightPercent, 2)}%` }}></div>
                          </div>
                          <div className="bar-label">{d.month}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Distribution Chart */}
            <div className="chart-card">
              <h3 className="chart-title">Department Distribution</h3>
              <div className="donut-chart-container">
                {departmentData.length === 0 ? (
                  <div className="chart-empty">No data available</div>
                ) : (
                  <div className="donut-layout">
                    <div className="donut-svg-wrapper">
                      <svg viewBox="0 0 36 36" className="donut-svg">
                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                        {donutSegments.map((seg, i) => (
                          seg.pct > 0 ? (
                            <circle
                              key={i}
                              cx="18"
                              cy="18"
                              r="15.915"
                              fill="transparent"
                              stroke={seg.color}
                              strokeWidth="4"
                              strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                              strokeDashoffset={100 - seg.offset + 25}
                              className="donut-segment"
                            />
                          ) : null
                        ))}
                      </svg>
                      <div className="donut-center-text">
                        <span>{stats.totalEmployees}</span>
                        <small>Total</small>
                      </div>
                    </div>
                    <div className="donut-legend">
                      {donutSegments.map((seg, i) => (
                        <div key={i} className="legend-item">
                          <span className="legend-color" style={{ backgroundColor: seg.color }}></span>
                          <span className="legend-label">{departmentData[i]?.department || "Unassigned"}</span>
                          <span className="legend-value">{departmentData[i]?.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Employees Table */}
          <div className="dashboard-table-card">
            <div className="table-header-row">
              <h3 className="chart-title">Recent Employees</h3>
              <div className="table-actions">
                <button className="btn-secondary-sm" onClick={() => navigate('/employees')}>View All</button>
                <button className="btn-primary-sm" onClick={() => navigate('/employees/add')}>+ Add Employee</button>
              </div>
            </div>
            
            <div className="table-responsive">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Employee ID</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">No recent employees found.</td>
                    </tr>
                  ) : (
                    recentEmployees.map((emp) => (
                      <tr key={emp.id} className="cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/employees/${emp.id}`)}>
                        <td>
                          <div className="employee-profile-cell">
                            <div className="employee-avatar">
                              {getInitials(emp.first_name, emp.last_name)}
                            </div>
                            <div className="employee-details">
                              <span className="employee-name">{emp.first_name} {emp.last_name}</span>
                              <span className="employee-email">{emp.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="text-muted">{emp.employee_id}</td>
                        <td className="text-muted">{emp.department || "—"}</td>
                        <td className="text-muted">{emp.designation || "—"}</td>
                        <td>
                          <span className={`status-badge ${getStatusClass(emp.status)}`}>
                            {emp.status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Dashboard;
