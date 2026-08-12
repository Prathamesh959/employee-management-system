import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard/stats');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
        setError("Unable to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-content">
      <h1 className="dashboard-title">Dashboard Overview</h1>
      <p className="dashboard-subtitle">Welcome back, {user?.name}. Here is the latest company data.</p>
      
      {loading ? (
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading statistics...</p>
        </div>
      ) : error ? (
        <div className="dashboard-error">
          <p>{error}</p>
        </div>
      ) : stats ? (
        <div className="dashboard-stats-grid">
          <div className="stat-card">
            <h3 className="stat-title">Total Employees</h3>
            <p className="stat-value text-indigo">{stats.totalEmployees}</p>
          </div>
          
          <div className="stat-card">
            <h3 className="stat-title">Active Employees</h3>
            <p className="stat-value text-emerald">{stats.activeEmployees}</p>
          </div>
          
          <div className="stat-card">
            <h3 className="stat-title">On Leave</h3>
            <p className="stat-value text-amber">{stats.onLeaveEmployees}</p>
          </div>
          
          <div className="stat-card">
            <h3 className="stat-title">Inactive Employees</h3>
            <p className="stat-value text-rose">{stats.inactiveEmployees}</p>
          </div>
          
          <div className="stat-card">
            <h3 className="stat-title">Total Departments</h3>
            <p className="stat-value text-slate">{stats.totalDepartments}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
