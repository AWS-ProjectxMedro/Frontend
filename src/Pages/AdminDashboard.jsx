// src/pages/AdminDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";

import SidebarAdmin from "../Component/AdminDashboard/AdminSidebar";
import "../assets/styles/AdminDashboard.scss";

// CONFIGURATION & CONSTANTS
const CONFIG = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
  LOCAL_STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken', 
    USER_ROLE: 'userRole', 
    USER_DATA: 'userData',
  },
  USER_ROLES: { ADMIN: 'admin' },
  ROUTES: { LOGIN: '/login' },
  API_ENDPOINTS: { 
    ADMIN_INVESTMENT_SUMMARY: '/api/transactions/summary?period=yearly' 
  },
  UI: { MOBILE_BREAKPOINT: 768 }
};

// Create axios instance with interceptors
const apiClient = axios.create({ 
  baseURL: CONFIG.API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(CONFIG.LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(CONFIG.LOCAL_STORAGE_KEYS.USER_ROLE);
      localStorage.removeItem(CONFIG.LOCAL_STORAGE_KEYS.USER_DATA);
    }
    return Promise.reject(error);
  }
);

const HamburgerIcon = ({ onClick, isOpen }) => (
  <button 
    className={`hamburger-menu ${isOpen ? "open" : ""}`} 
    onClick={onClick} 
    aria-label="Toggle navigation" 
    aria-expanded={isOpen}
    type="button"
  >
    <span />
    <span />
    <span />
  </button>
);

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    window.innerWidth > CONFIG.UI.MOBILE_BREAKPOINT
  );
  const [activatedInvestment, setActivatedInvestment] = useState(null);
  const [isLoadingInvestment, setIsLoadingInvestment] = useState(true);

  const handleLogout = useCallback(() => {
    if (onLogout) onLogout();
    localStorage.removeItem(CONFIG.LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(CONFIG.LOCAL_STORAGE_KEYS.USER_ROLE);
    localStorage.removeItem(CONFIG.LOCAL_STORAGE_KEYS.USER_DATA);
    navigate(CONFIG.ROUTES.LOGIN);
  }, [onLogout, navigate]);

  const fetchActivatedInvestment = useCallback(async () => {
    setIsLoadingInvestment(true);
    try {
      const response = await apiClient.get(CONFIG.API_ENDPOINTS.ADMIN_INVESTMENT_SUMMARY);
      if (response.data) {
        setActivatedInvestment(response.data.summary || response.data);
      } else {
        setActivatedInvestment({ error: true, message: "No data received" });
      }
    } catch (error) {
      console.error("Error fetching activated investment:", error);
      if (error.response?.status === 401) {
        handleLogout();
        return;
      }
      setActivatedInvestment({ 
        error: true, 
        message: error.response?.data?.message || "Failed to fetch data"
      });
    } finally {
      setIsLoadingInvestment(false);
    }
  }, [handleLogout]);

  const handleResize = useCallback(() => {
    setIsSidebarOpen(window.innerWidth > CONFIG.UI.MOBILE_BREAKPOINT);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    const userRole = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.USER_ROLE);

    if (!token || userRole !== CONFIG.USER_ROLES.ADMIN) {
      handleLogout();
      return;
    }
    const storedUserData = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.USER_DATA);
    if (storedUserData) {
      try { setUserData(JSON.parse(storedUserData)); } catch { setUserData({}); }
    }
    fetchActivatedInvestment();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleLogout, fetchActivatedInvestment, handleResize]);

  useEffect(() => {
    if (window.innerWidth <= CONFIG.UI.MOBILE_BREAKPOINT && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]); // Removed isSidebarOpen dependency to avoid loops

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const formatInvestmentAmount = (amount) => {
    return typeof amount === 'number' ? `$${amount.toLocaleString()}` : 'N/A';
  };

  const renderInvestmentSummary = () => {
    if (isLoadingInvestment) return <p>Loading summary...</p>;
    if (activatedInvestment?.error) {
      return (
        <p>
          <span className="error-detail"> ({activatedInvestment.message})</span>
        </p>
      );
    }
    if (activatedInvestment) {
      return (
        <p>
          Activated Investment:{" "}
          <strong>{formatInvestmentAmount(activatedInvestment.totalInvestment)}</strong>
        </p>
      );
    }
    return <p>No investment data available.</p>;
  };

  return (
    <div className={`dashboard-layout ${isSidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}>
      <SidebarAdmin 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      
      <main className="main-content-Admin">
        <header className="Admin-header">
          {/* Grouping items on the left for correct flex alignment */}
          <div className="header-left">
            <HamburgerIcon onClick={toggleSidebar} isOpen={isSidebarOpen} />
            <h1>Investment Insight - Admin Panel</h1>
          </div>

          {/* Grouping items on the right */}
          <div className="header-right">
            <div className="sub-header">
              Welcome, {userData.email || userData.firstName || "Admin"}
            </div>
            <div className="header-summary">
              {renderInvestmentSummary()}
            </div>
          </div>
        </header>
        
        {/* This wrapper is defined in your SCSS for content padding */}
        <div className="page-content-wrapper">
          <Outlet context={{ 
            userData, 
            onLogout: handleLogout, 
            activatedInvestment,
            isLoadingInvestment,
            refreshInvestmentData: fetchActivatedInvestment
          }} />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard