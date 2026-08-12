import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./EmployeeTable.css";

const EmployeeTable = ({ employees, onDeleteClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "badge-active";
      case "on leave":
        return "badge-on-leave";
      case "inactive":
        return "badge-inactive";
      default:
        return "badge-default";
    }
  };

  if (!employees || employees.length === 0) {
    return (
      <div className="empty-state">
        <p>No employees found matching the criteria.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="employee-table">
        <thead>
          <tr>
            <th className="checkbox-col">
              <input type="checkbox" className="custom-checkbox" />
            </th>
            <th>Employee</th>
            <th>Employee ID</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Status</th>
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="checkbox-col">
                <input type="checkbox" className="custom-checkbox" />
              </td>
              <td>
                <div className="employee-profile-cell">
                  <div className="employee-avatar">
                    {getInitials(employee.first_name, employee.last_name)}
                  </div>
                  <div className="employee-details">
                    <span className="employee-name">{employee.first_name} {employee.last_name}</span>
                    <span className="employee-email">{employee.email}</span>
                  </div>
                </div>
              </td>
              <td className="text-muted">{employee.employee_id}</td>
              <td className="text-muted">{employee.department || "—"}</td>
              <td className="text-muted">{employee.designation || "—"}</td>
              <td>
                <span className={`status-badge ${getStatusClass(employee.status)}`}>
                  {employee.status || "Unknown"}
                </span>
              </td>
              <td className="actions-col">
                <div className="action-buttons">
                  <button 
                    className="btn-action btn-view" 
                    onClick={() => navigate(`/employees/${employee.id}`)}
                    title="View Profile"
                  >
                    View
                  </button>
                  <button 
                    className="btn-action btn-edit" 
                    onClick={() => navigate(`/employees/${employee.id}/edit`)}
                    title="Edit Employee"
                  >
                    Edit
                  </button>
                  {/* Hide delete button for HR users */}
                  {user?.role === 'Admin' && (
                    <button 
                      className="btn-action btn-delete" 
                      onClick={() => onDeleteClick(employee)}
                      title="Delete Employee"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
