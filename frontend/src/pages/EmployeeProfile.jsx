import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./EmployeeProfile.css";

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/employees/${id}`);
        if (response.data.success) {
          setEmployee(response.data.data);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("Employee not found.");
        } else {
          setError("Failed to load employee details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

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

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="profile-container">
        <div className="page-header">
          <button className="btn-back" onClick={() => navigate("/employees")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Employees
          </button>
        </div>
        <div className="error-state">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Format date if exists
  const formattedDate = employee.joining_date 
    ? new Date(employee.joining_date).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      })
    : "—";

  return (
    <div className="profile-container">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate("/employees")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Employee Profile
        </button>
      </div>

      {/* Top Hero Card */}
      <div className="profile-hero-card">
        <div className="hero-left">
          <div className="hero-avatar">
            {getInitials(employee.first_name, employee.last_name)}
          </div>
          <div className="hero-details">
            <h1 className="hero-name">{employee.first_name} {employee.last_name}</h1>
            <p className="hero-meta">
              {employee.designation || "—"} &bull; {employee.department || "—"} Dept &bull; {employee.employee_id}
            </p>
          </div>
        </div>
        <div className="hero-right">
          <span className={`status-badge ${getStatusClass(employee.status)}`}>
            {employee.status === "Active" && <span className="status-dot"></span>}
            {employee.status || "Unknown"}
          </span>
          <button 
            className="btn-outline"
            onClick={() => navigate(`/employees/${employee.id}/edit`)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="profile-grid">
        
        {/* Personal Information */}
        <div className="profile-card">
          <h2 className="profile-card-title">Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email Address</span>
              <span className="info-value">{employee.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone Number</span>
              <span className="info-value">{employee.phone || "—"}</span>
            </div>
          </div>
        </div>

        {/* Employment Details */}
        <div className="profile-card">
          <h2 className="profile-card-title">Employment Details</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Employee ID</span>
              <span className="info-value">{employee.employee_id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Department</span>
              <span className="info-value">{employee.department || "—"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Designation</span>
              <span className="info-value">{employee.designation || "—"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date of Joining</span>
              <span className="info-value">{formattedDate}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Employment Status</span>
              <span className="info-value">{employee.status || "—"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Annual Salary</span>
              <span className="info-value">
                {employee.salary ? `$${Number(employee.salary).toLocaleString()}` : "Confidential"}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeProfile;
