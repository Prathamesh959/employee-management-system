import React from "react";

const Logo = ({ className = "" }) => {
  return (
    <div className={`logo-container ${className}`} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rounded square background */}
        <rect x="5" y="5" width="90" height="90" rx="25" fill="#4f46e5" />
        
        {/* Left person */}
        <circle cx="28" cy="40" r="12" fill="white" />
        <path
          d="M10 80 C 10 55, 46 55, 46 80 Z"
          fill="white"
        />

        {/* Right person */}
        <circle cx="72" cy="40" r="12" fill="white" />
        <path
          d="M54 80 C 54 55, 90 55, 90 80 Z"
          fill="white"
        />

        {/* Center person (front) */}
        <circle cx="50" cy="35" r="14" fill="#4f46e5" />
        <circle cx="50" cy="35" r="12" fill="white" />
        
        <path
          d="M26 80 C 26 48, 74 48, 74 80 Z"
          fill="#4f46e5"
        />
        <path
          d="M30 80 C 30 52, 70 52, 70 80 Z"
          fill="white"
        />
      </svg>
      <span
        style={{
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          fontSize: "2rem",
          fontWeight: "700",
          color: "#111827",
          letterSpacing: "-0.03em",
          marginLeft: "4px"
        }}
      >
        EMS Portal
      </span>
    </div>
  );
};

export default Logo;
