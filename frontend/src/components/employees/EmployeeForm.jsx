import { useState, useEffect } from "react";
import api from "../../services/api";
import "./EmployeeForm.css";

const EmployeeForm = ({ 
  initialData, 
  onSubmit, 
  title, 
  subtitle, 
  submitButtonText, 
  isSubmitting, 
  submitError, 
  onCancel 
}) => {
  const [departments, setDepartments] = useState([]);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    employee_id: "",
    department_id: "",
    designation: "",
    joining_date: "",
    status: "Active",
    salary: ""
  });

  const [errors, setErrors] = useState({});

  // Populate form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get("/departments");
        if (response.data.success) {
          setDepartments(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch departments", err);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.employee_id.trim()) newErrors.employee_id = "Employee ID is required";
    if (!formData.department_id) newErrors.department_id = "Department is required";
    if (!formData.designation.trim()) newErrors.designation = "Designation is required";
    if (!formData.joining_date) newErrors.joining_date = "Joining date is required";
    
    if (!formData.salary && formData.salary !== 0) {
      newErrors.salary = "Salary is required";
    } else if (isNaN(formData.salary) || Number(formData.salary) < 0) {
      newErrors.salary = "Salary must be a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Convert necessary fields
    const payload = {
      ...formData,
      salary: Number(formData.salary),
      department_id: Number(formData.department_id)
    };
    
    onSubmit(payload);
  };

  return (
    <div className="page-container add-employee-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
      </div>

      {submitError && (
        <div className="submit-error-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="16" r="1" fill="currentColor"/>
          </svg>
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-employee-form">
        
        {/* Personal Information Card */}
        <div className="form-card">
          <h2 className="form-card-title">Personal Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name</label>
              <input 
                type="text" 
                name="first_name" 
                placeholder="e.g. Jane"
                value={formData.first_name} 
                onChange={handleChange} 
                className={errors.first_name ? "input-error" : ""}
              />
              {errors.first_name && <span className="error-text">{errors.first_name}</span>}
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input 
                type="text" 
                name="last_name" 
                placeholder="e.g. Doe"
                value={formData.last_name} 
                onChange={handleChange} 
                className={errors.last_name ? "input-error" : ""}
              />
              {errors.last_name && <span className="error-text">{errors.last_name}</span>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                placeholder="jane.doe@example.com"
                value={formData.email} 
                onChange={handleChange} 
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input 
                type="text" 
                name="phone" 
                placeholder="(555) 123-4567"
                value={formData.phone || ""} 
                onChange={handleChange} 
              />
            </div>
          </div>
        </div>

        {/* Employment Information Card */}
        <div className="form-card">
          <h2 className="form-card-title">Employment Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Employee ID</label>
              <input 
                type="text" 
                name="employee_id" 
                placeholder="e.g. EMP-1001"
                value={formData.employee_id} 
                onChange={handleChange} 
                className={errors.employee_id ? "input-error" : ""}
              />
              {errors.employee_id && <span className="error-text">{errors.employee_id}</span>}
            </div>

            <div className="form-group">
              <label>Department</label>
              <select 
                name="department_id" 
                value={formData.department_id} 
                onChange={handleChange}
                className={`form-select ${errors.department_id ? "input-error" : ""}`}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              {errors.department_id && <span className="error-text">{errors.department_id}</span>}
            </div>

            <div className="form-group">
              <label>Designation</label>
              <input 
                type="text" 
                name="designation" 
                placeholder="e.g. Senior Software Engineer"
                value={formData.designation} 
                onChange={handleChange} 
                className={errors.designation ? "input-error" : ""}
              />
              {errors.designation && <span className="error-text">{errors.designation}</span>}
            </div>

            <div className="form-group">
              <label>Joining Date</label>
              <input 
                type="date" 
                name="joining_date" 
                value={formData.joining_date} 
                onChange={handleChange} 
                className={errors.joining_date ? "input-error" : ""}
              />
              {errors.joining_date && <span className="error-text">{errors.joining_date}</span>}
            </div>

            <div className="form-group">
              <label>Employment Status</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                className="form-select"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="form-group">
              <label>Salary</label>
              <div className="input-with-icon">
                <span className="input-icon">$</span>
                <input 
                  type="number" 
                  name="salary" 
                  placeholder="0.00"
                  value={formData.salary} 
                  onChange={handleChange} 
                  className={errors.salary ? "input-error" : ""}
                />
              </div>
              {errors.salary && <span className="error-text">{errors.salary}</span>}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-save"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : submitButtonText}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EmployeeForm;
