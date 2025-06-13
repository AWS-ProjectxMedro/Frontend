// SidebarAdmin.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo3 from "../../assets/image/logo3.png";
import "../../assets/styles/AdminSidebar.scss"; // Styles for this specific sidebar

const SidebarAdmin = ({ onLogout, isOpen }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      navigate('/login');
    }
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      <div className="admin-sidebar__logo-section">
        <img src={logo3} alt="logo" height="50px" width="50px" />
        <h2 className="admin-sidebar__title">Admin Dashboard</h2>
      </div>
      <ul className="admin-sidebar__menu">
        <li className="admin-sidebar__menu-item">
          <NavLink 
            to="/adminDashboard" 
            end 
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Invest Dashboard
          </NavLink>
        </li>
        <li className="admin-sidebar__menu-item">
          <NavLink 
            to="/adminDashboard/userManagement" 
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            User Management
          </NavLink>
        </li>
        <li className="admin-sidebar__menu-item">
          <NavLink to="/adminDashboard/manageBlog" className={({ isActive }) => isActive ? "active-link" : ""}>
            Manage Blog
          </NavLink>
        </li>
        <li className="admin-sidebar__menu-item">
          <NavLink to="/adminDashboard/transaction" className={({ isActive }) => isActive ? "active-link" : ""}>
            Transactions
          </NavLink>
        </li>
        {/* ========================================================= */}
        {/* 1. NEW NavLink for the Withdrawal page has been added here */}
        {/* ========================================================= */}
        <li className="admin-sidebar__menu-item">
          <NavLink to="/adminDashboard/withdrawals" className={({ isActive }) => isActive ? "active-link" : ""}>
            Withdrawals
          </NavLink>
        </li>
        <li className="admin-sidebar__menu-item">
          <NavLink to="/adminDashboard/adminPlans" className={({ isActive }) => isActive ? "active-link" : ""}>
            Plans
          </NavLink>
        </li>
      </ul>
      <div 
        className="admin-sidebar__signout"
        onClick={handleSignOut} 
        style={{ cursor: 'pointer' }}
        tabIndex={0}
        role="button"
      >
        Sign Out
      </div>
    </aside>
  );
};

export default SidebarAdmin;