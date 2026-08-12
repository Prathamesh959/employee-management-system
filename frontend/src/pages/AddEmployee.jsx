import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import EmployeeForm from "../components/employees/EmployeeForm";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await api.post("/employees", payload);
      
      if (response.data.success) {
        navigate("/employees");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setSubmitError(err.response.data.message);
      } else {
        setSubmitError("An error occurred while saving the employee.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/employees");
  };

  return (
    <EmployeeForm 
      initialData={null}
      onSubmit={handleSubmit}
      title="Add Employee"
      subtitle="Enter the employee's information to create a new record."
      submitButtonText="Save Employee"
      isSubmitting={isSubmitting}
      submitError={submitError}
      onCancel={handleCancel}
    />
  );
};

export default AddEmployee;
