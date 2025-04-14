import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo3 from "../../assets/image/logo3.png";
import "./Sidebar.scss";

const SidebarAdmin = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    if (typeof setIsAuthenticated === 'function') {
      setIsAuthenticated(false); // Ensure this function exists and is correctly passed
    } else {
      console.error("setIsAuthenticated is not defined or not a function");
    }
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <aside className="dashboard__sidebar">
        <div className="dashboard__sidebar-logo">
          <img src={logo3} alt="logo" height="50px" width="50px" />
          <h2 className="dashboard__sidebar-title">User Dashboard</h2>
        </div>
        <ul className="dashboard__sidebar-menu">
          <li className="dashboard__sidebar-menu-item">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "dashboard__sidebar-menu-item--active" : ""}>
              Invest Dashboard
            </NavLink>
          </li>
          <li className="dashboard__sidebar-menu-item">
            <NavLink to="/account" className={({ isActive }) => isActive ? "dashboard__sidebar-menu-item--active" : ""}>
              Transaction
            </NavLink>
          </li>
          <li className="dashboard__sidebar-menu-item">
            <NavLink to="/InvestmentTools" className={({ isActive }) => isActive ? "dashboard__sidebar-menu-item--active" : ""}>
              Withdrawal
            </NavLink>
          </li>
          <li className="dashboard__sidebar-menu-item">
            <NavLink to="/MarketGuides" className={({ isActive }) => isActive ? "dashboard__sidebar-menu-item--active" : ""}>
              Manage Blog
            </NavLink>
          </li>
          <li className="dashboard__sidebar-menu-item">
            <NavLink to="/Profile" className={({ isActive }) => isActive ? "dashboard__sidebar-menu-item--active" : ""}>
              User Mangament
            </NavLink>
          </li>
          <li className="dashboard__sidebar-signout" onClick={handleSignOut}>
            Sign Out
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default SidebarAdmin;
