import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./TopHeader.css";

const TopHeader = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  return (
    <header className="top-header">
      <div className="search-bar-container">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
          <path d="M20 20L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input type="text" placeholder="Search..." className="global-search-input" />
      </div>

      <div className="header-actions">
        <div className="user-profile" onClick={() => navigate('/settings')} title="Settings">
          <div className="avatar-small">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
