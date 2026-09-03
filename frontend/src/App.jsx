import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import DashboardLayout from "./components/layout/DashboardLayout";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EmployeeProfile from "./pages/EmployeeProfile";
import EditEmployee from "./pages/EditEmployee";
import Departments from "./pages/Departments";
import Settings from "./pages/Settings";

// Redirect authenticated users away from login
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

// Redirect unauthenticated users to login
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees/add" element={<AddEmployee />} />
            <Route path="/employees/:id/edit" element={<EditEmployee />} />
            <Route path="/employees/:id" element={<EmployeeProfile />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/departments" element={<Departments />} />
            {/* <Route path="/reports" element={<div>Reports Placeholder</div>} /> */}
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
