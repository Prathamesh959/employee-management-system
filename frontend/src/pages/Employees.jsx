import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import EmployeeFilters from "../components/employees/EmployeeFilters";
import EmployeeTable from "../components/employees/EmployeeTable";
import Pagination from "../components/common/Pagination";
import ConfirmModal from "../components/common/ConfirmModal";
import "./Employees.css";

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch both employees and departments concurrently
        const [empRes, deptRes] = await Promise.all([
          api.get("/employees"),
          api.get("/departments")
        ]);

        if (empRes.data.success) {
          setEmployees(empRes.data.data);
        }
        
        if (deptRes.data.success) {
          setDepartments(deptRes.data.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load employees. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter employees based on search, department, and status
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Search matching (name, email, or employee_id)
      const matchesSearch = 
        emp.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employee_id?.toLowerCase().includes(searchQuery.toLowerCase());

      // Department matching
      const matchesDept = selectedDepartment === "" || emp.department === selectedDepartment;

      // Status matching
      const matchesStatus = selectedStatus === "" || emp.status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, searchQuery, selectedDepartment, selectedStatus]);

  // Reset to page 1 if filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDepartment, selectedStatus]);

  // Paginate filtered employees
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteError("");
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;
    
    setIsDeleting(true);
    setDeleteError("");
    
    try {
      const response = await api.delete(`/employees/${employeeToDelete.id}`);
      
      if (response.data.success) {
        // Remove from local state immediately
        setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
        handleCloseDeleteModal();
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setDeleteError("You do not have permission to delete employees.");
      } else if (err.response?.status === 404) {
        setDeleteError("Employee not found. They may have already been deleted.");
        // Still remove from UI since they're gone from the DB
        setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
      } else {
        setDeleteError("An error occurred while deleting the employee. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Manage and organize your company's employees</p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/employees/add")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add Employee
        </button>
      </div>

      <div className="card">
        <EmployeeFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          departments={departments}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
        
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading employees...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <EmployeeTable 
              employees={paginatedEmployees} 
              onDeleteClick={handleDeleteClick}
            />
            <Pagination
              totalItems={filteredEmployees.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Employee"
        message={
          deleteError 
            ? <span style={{ color: '#ef4444' }}>{deleteError}</span>
            : `Are you sure you want to delete ${employeeToDelete?.first_name} ${employeeToDelete?.last_name}? This action cannot be undone.`
        }
        onConfirm={handleDeleteConfirm}
        onCancel={handleCloseDeleteModal}
        isProcessing={isDeleting}
        confirmText="Delete Employee"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default Employees;
