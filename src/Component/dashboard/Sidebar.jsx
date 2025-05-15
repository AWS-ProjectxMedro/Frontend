import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo3 from "../../assets/image/logo3.png"; // Ensure this path is correct
import "./Sidebar.scss"; // Ensure this path is correct

const Sidebar = ({ setIsAuthenticated }) => { // Destructured prop
  // Log when the component renders or re-renders
  console.log('Sidebar props:', { setIsAuthenticated });
  console.log('Type of setIsAuthenticated on render:', typeof setIsAuthenticated);

  const navigate = useNavigate();

  const handleSignOut = () => {
    // Log when the handler is called
    console.log('handleSignOut called. Current setIsAuthenticated:', setIsAuthenticated);
    console.log('Type of setIsAuthenticated in handleSignOut:', typeof setIsAuthenticated);

    if (typeof setIsAuthenticated === 'function') {
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
      navigate("/login");
    } else {
      console.error("setIsAuthenticated is NOT a function in handleSignOut!");
      // Fallback behavior: still try to log out and redirect
      localStorage.removeItem("authToken");
      navigate("/login");
    }
  };

  return (
    <div className="dashboard"> {/* This class here is a bit unusual if Sidebar is always a child component */}
      <aside className="dashboard__sidebar">
        <div className="dashboard__sidebar-logo">
          <img src={logo3} alt="logo" height="50px" width="50px" />
          <h2 className="dashboard__sidebar-title">User Dashboard</h2>
        </div>
        <ul className="dashboard__sidebar-menu">
          {/* ... other NavLinks ... */}
          <li className="dashboard__sidebar-menu-item">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "dashboard__sidebar-menu-item--active" : ""}>
              Dashboard
            </NavLink>
          </li>
          <li className="dashboard__sidebar-menu-item">
            <NavLink to="/account" className={({ isActive }) => isActive ? "dashboard__sidebar-menu-item--active" : ""}>
              Account
            </NavLink>
          </li>
          <li className="dashboard__sidebar-menu-item">
            <NavLink to="/InvestmentTools" className={({ isActive }) => isActive ? "dashboard__sidebar-menu-item--active" : ""}>
              Investment Tool
            </NavLink>
          </li>
          <li className="dashboard__sidebar-menu-item">
            <NavLink to="/MarketGuides" className={({ isActive }) => isActive ? "dashboard__sidebar-menu-item--active" : ""}>
              Market Guides
            </NavLink>
          </li>
          <li className="dashboard__sidebar-menu-item">
            <NavLink to="/Profile" className={({ isActive }) => isActive ? "dashboard__sidebar-menu-item--active" : ""}>
              Profile
            </NavLink>
          </li>
          <li className="dashboard__sidebar-signout" onClick={handleSignOut} style={{ cursor: 'pointer' }}>
            Sign Out
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;