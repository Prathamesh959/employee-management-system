import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../Logo";
import "./Sidebar.css";

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Logo className="sidebar-logo" />
        <span className="sidebar-subtitle">Admin Console</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Dashboard
        </NavLink>
        <NavLink to="/employees" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Employees
        </NavLink>
        <NavLink to="/departments" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 21V7L13 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 21V11L13 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 9V9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 13V13.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 17V17.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 13V13.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 17V17.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Departments
        </NavLink>
        {/* 
        <NavLink to="/reports" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Reports
        </NavLink>
        */}
        <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.4 15A1.65 1.65 0 0 0 21 13.35V10.65A1.65 1.65 0 0 0 19.4 9H18.57A6.95 6.95 0 0 0 17.5 6.36L18.09 5.77A1.65 1.65 0 0 0 18.09 3.44L16.19 1.54A1.65 1.65 0 0 0 13.86 1.54L13.27 2.13A6.95 6.95 0 0 0 10.65 1.43V0.6A1.65 1.65 0 0 0 9 0H6.3A1.65 1.65 0 0 0 4.65 1.65V2.48A6.95 6.95 0 0 0 2.01 3.55L1.42 2.96A1.65 1.65 0 0 0 -0.91 2.96L-2.81 4.86A1.65 1.65 0 0 0 -2.81 7.19L-2.22 7.78A6.95 6.95 0 0 0 -2.92 10.4V11.23A1.65 1.65 0 0 0 -1.27 12.88H-0.44A6.95 6.95 0 0 0 0.63 15.52L0.04 16.11A1.65 1.65 0 0 0 0.04 18.44L1.94 20.34A1.65 1.65 0 0 0 4.27 20.34L4.86 19.75A6.95 6.95 0 0 0 7.48 20.45V21.28A1.65 1.65 0 0 0 9.13 22.93H11.77A1.65 1.65 0 0 0 13.42 21.28V20.45A6.95 6.95 0 0 0 16.06 19.38L16.65 19.97A1.65 1.65 0 0 0 18.98 19.97L20.88 18.07A1.65 1.65 0 0 0 20.88 15.74L20.29 15.15A6.95 6.95 0 0 0 20.99 12.53H21.82A1.65 1.65 0 0 0 23.47 10.88V8.24A1.65 1.65 0 0 0 21.82 6.59H20.99A6.95 6.95 0 0 0 19.92 3.95L20.51 3.36A1.65 1.65 0 0 0 20.51 1.03L18.61 -0.87A1.65 1.65 0 0 0 16.28 -0.87L15.69 -0.28A6.95 6.95 0 0 0 13.07 -0.98V-1.81A1.65 1.65 0 0 0 11.42 -3.46H8.78A1.65 1.65 0 0 0 7.13 -1.81V-0.98A6.95 6.95 0 0 0 4.49 0.09L3.9 -0.5A1.65 1.65 0 0 0 1.57 -0.5L-0.33 1.4A1.65 1.65 0 0 0 -0.33 3.73L0.26 4.32A6.95 6.95 0 0 0 -0.44 6.94H-1.27A1.65 1.65 0 0 0 -2.92 8.59V11.23A1.65 1.65 0 0 0 -1.27 12.88H-0.44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Settings
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={logout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
