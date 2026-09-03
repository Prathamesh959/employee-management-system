import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import ConfirmModal from "../components/common/ConfirmModal";
import "./Departments.css";

const Departments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptNameInput, setDeptNameInput] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const isAdmin = user?.role === "Admin";

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/departments");
      if (res.data.success) {
        setDepartments(res.data.data);
      }
    } catch (err) {
      setError("Failed to load departments.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setFormError("");
    setDeptNameInput("");
    setEditingDept(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (dept) => {
    setFormError("");
    setDeptNameInput(dept.name);
    setEditingDept(dept);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!deptNameInput.trim()) {
      setFormError("Department name is required.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      if (editingDept) {
        await api.put(`/departments/${editingDept.id}`, { name: deptNameInput });
        setSuccessMsg("Department updated successfully!");
      } else {
        await api.post("/departments", { name: deptNameInput });
        setSuccessMsg("Department added successfully!");
      }
      setIsFormModalOpen(false);
      fetchDepartments();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      if (err.response && err.response.data.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (dept) => {
    setDeleteError("");
    setDeptToDelete(dept);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/departments/${deptToDelete.id}`);
      setSuccessMsg("Department deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchDepartments();
      
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setDeleteError("This department cannot be deleted because employees are still assigned to it.");
      } else if (err.response && err.response.data.message) {
        setDeleteError(err.response.data.message);
      } else {
        setDeleteError("Failed to delete department.");
      }
    }
  };

  return (
    <div className="departments-container">
      <div className="departments-header">
        <div>
          <h1 className="departments-title">Departments</h1>
          <p className="departments-subtitle">Manage organizational structure and functional groups.</p>
        </div>
        <div className="departments-actions">
          <input
            type="text"
            className="search-input"
            placeholder="Search departments..."
            value={searchQuery}
            onChange={handleSearch}
          />
          {isAdmin && (
            <button className="btn-primary" onClick={openAddModal}>
              + Add Department
            </button>
          )}
        </div>
      </div>

      {successMsg && <div className="alert-success">{successMsg}</div>}
      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Loading departments...</div>
      ) : filteredDepartments.length === 0 ? (
        <div className="empty-state">No departments found.</div>
      ) : (
        <div className="departments-grid">
          {filteredDepartments.map((dept) => (
            <div key={dept.id} className="department-card">
              <div className="dept-card-header">
                <div className="dept-name">{dept.name}</div>
                {isAdmin && (
                  <div className="dept-actions">
                    <button className="btn-icon" onClick={() => openEditModal(dept)} title="Edit">
                      ✎
                    </button>
                    <button className="btn-icon delete" onClick={() => openDeleteModal(dept)} title="Delete">
                      🗑
                    </button>
                  </div>
                )}
              </div>
              <div className="dept-stats">
                <div className="stat-group">
                  <span className="stat-label">Total Staff</span>
                  <span className="stat-value">{dept.totalEmployees}</span>
                </div>
                <div className="stat-group">
                  <span className="stat-label">Active</span>
                  <span className="stat-value">{dept.activeEmployees}</span>
                </div>
              </div>
              <button 
                className="btn-secondary"
                onClick={() => navigate(`/employees?departmentName=${encodeURIComponent(dept.name)}`)}
              >
                View Employees
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isFormModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">{editingDept ? "Edit Department" : "Add Department"}</h2>
            {formError && <div className="alert-error">{formError}</div>}
            
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Department Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={deptNameInput}
                  onChange={(e) => setDeptNameInput(e.target.value)}
                  placeholder="e.g. Engineering"
                  autoFocus
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsFormModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : (editingDept ? "Save Changes" : "Add Department")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Department"
        message={`Are you sure you want to delete ${deptToDelete?.name}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
        error={deleteError}
      />
    </div>
  );
};

export default Departments;
