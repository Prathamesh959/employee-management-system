import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import EmployeeForm from "../components/employees/EmployeeForm";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/employees/${id}`);
        
        if (response.data.success) {
          const emp = response.data.data;
          
          // Format date for the date input (YYYY-MM-DD)
          let formattedDate = "";
          if (emp.joining_date) {
            const d = new Date(emp.joining_date);
            formattedDate = d.toISOString().split('T')[0];
          }

          setInitialData({
            first_name: emp.first_name || "",
            last_name: emp.last_name || "",
            email: emp.email || "",
            phone: emp.phone || "",
            employee_id: emp.employee_id || "",
            department_id: emp.department_id || "",
            designation: emp.designation || "",
            joining_date: formattedDate,
            status: emp.status || "Active",
            salary: emp.salary || ""
          });
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setFetchError("Employee not found.");
        } else {
          setFetchError("Failed to load employee details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await api.put(`/employees/${id}`, payload);
      
      if (response.data.success) {
        navigate(`/employees/${id}`);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setSubmitError(err.response.data.message);
      } else {
        setSubmitError("An error occurred while updating the employee.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/employees/${id}`);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
          Loading employee details...
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="page-container">
        <div style={{ padding: '4rem', textAlign: 'center', color: '#ef4444' }}>
          {fetchError}
        </div>
        <div style={{ textAlign: 'center' }}>
          <button 
            style={{ padding: '0.5rem 1rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => navigate("/employees")}
          >
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  return (
    <EmployeeForm 
      initialData={initialData}
      onSubmit={handleSubmit}
      title="Edit Employee"
      subtitle="Update the employee's information and employment details."
      submitButtonText="Save Changes"
      isSubmitting={isSubmitting}
      submitError={submitError}
      onCancel={handleCancel}
    />
  );
};

export default EditEmployee;
