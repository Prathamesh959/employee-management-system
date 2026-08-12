import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  return (
    <div className="layout-wrapper">
      <Sidebar />
      <div className="main-content-wrapper">
        <TopHeader />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
