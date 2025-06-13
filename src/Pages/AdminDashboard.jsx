// AdminDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";

import SidebarAdmin from "../Component/AdminDashboard/AdminSidebar";
import "../assets/styles/AdminDashboard.scss";

// CONFIGURATION & CONSTANTS
const CONFIG = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
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
  timeout: 10000, // 10 second timeout
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
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
    <span></span>
    <span></span>
    <span></span>
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

  // Memoized logout handler
  const handleLogout = useCallback(() => {
    if (onLogout) onLogout();
    
    // Clear localStorage
    localStorage.removeItem(CONFIG.LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(CONFIG.LOCAL_STORAGE_KEYS.USER_ROLE);
    localStorage.removeItem(CONFIG.LOCAL_STORAGE_KEYS.USER_DATA);
    
    navigate(CONFIG.ROUTES.LOGIN);
  }, [onLogout, navigate]);

  // Fetch activated investment data
  const fetchActivatedInvestment = useCallback(async () => {
    setIsLoadingInvestment(true);
    
    if (!CONFIG.API_BASE_URL) {
      console.error("API base URL is not defined in your .env file!");
      setActivatedInvestment({ error: true, message: "API configuration error" });
      setIsLoadingInvestment(false);
      return;
    }

    try {
      const response = await apiClient.get(CONFIG.API_ENDPOINTS.ADMIN_INVESTMENT_SUMMARY);
      
      console.log("API RESPONSE RECEIVED:", response.data);
      
      // Handle different response structures
      if (response.data) {
        // If the response has a summary property, use it
        if (response.data.summary) {
          setActivatedInvestment(response.data.summary);
        } 
        // If the response has totalInvestment directly
        else if (response.data.totalInvestment !== undefined) {
          setActivatedInvestment(response.data);
        }
        // If it's an array, take the first item or handle accordingly
        else if (Array.isArray(response.data) && response.data.length > 0) {
          setActivatedInvestment(response.data[0]);
        }
        // Otherwise use the full response
        else {
          setActivatedInvestment(response.data);
        }
      } else {
        setActivatedInvestment({ error: true, message: "No data received" });
      }

    } catch (error) {
      console.error("Error fetching activated investment:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 401) {
        handleLogout();
        return;
      }
      
      setActivatedInvestment({ 
        error: true, 
        message: error.response?.data?.message || error.message || "Failed to fetch data"
      });
    } finally {
      setIsLoadingInvestment(false);
    }
  }, [handleLogout]);

  // Handle window resize
  const handleResize = useCallback(() => {
    if (window.innerWidth <= CONFIG.UI.MOBILE_BREAKPOINT) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, []);

  // Main effect for authentication and data fetching
  useEffect(() => {
    // Check authentication using localStorage token
    const token = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    const userRole = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.USER_ROLE);

    if (!token || userRole !== CONFIG.USER_ROLES.ADMIN) {
      console.warn("Invalid token or user role for admin access");
      handleLogout();
      return;
    }

    // Load user data from localStorage
    const storedUserData = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.USER_DATA);
    if (storedUserData) {
      try { 
        setUserData(JSON.parse(storedUserData)); 
      } catch (error) { 
        console.error("AdminDashboard: Error parsing user data:", error);
        setUserData({});
      }
    }

    // Fetch investment data
    fetchActivatedInvestment();

    // Set up resize listener
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleLogout, fetchActivatedInvestment, handleResize]);

  // Effect to handle sidebar on route change (mobile)
  useEffect(() => {
    if (window.innerWidth <= CONFIG.UI.MOBILE_BREAKPOINT && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isSidebarOpen]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // Format investment amount
  const formatInvestmentAmount = (amount) => {
    if (typeof amount === 'number') {
      return `$${amount.toLocaleString()}`;
    }
    return 'N/A';
  };

  // Render investment summary
  const renderInvestmentSummary = () => {
    if (isLoadingInvestment) {
      return <p>Loading summary...</p>;
    }
    
    if (activatedInvestment?.error) {
      return (
        <p>
          Could not load summary.
          {activatedInvestment.message && (
            <span className="error-detail"> ({activatedInvestment.message})</span>
          )}
        </p>
      );
    }
    
    if (activatedInvestment) {
      return (
        <p>
          Activated Investment:{" "}
          <strong>
            {formatInvestmentAmount(activatedInvestment.totalInvestment)}
          </strong>
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
      <div className="main-content-Admin">
        <header className="Admin-header">
          <HamburgerIcon onClick={toggleSidebar} isOpen={isSidebarOpen} />
          <div className="header-content">
            <h1>Investment Insight - Admin Panel</h1>
            <p className="sub-header">
              Welcome, {userData.email || userData.firstName || "Admin"}
            </p>
          </div>
          <div className="header-summary">
            {renderInvestmentSummary()}
          </div>
        </header>
        <Outlet context={{ 
          userData, 
          onLogout: handleLogout, 
          activatedInvestment,
          isLoadingInvestment,
          refreshInvestmentData: fetchActivatedInvestment
        }} />
      </div>
    </div>
  );
};

export default AdminDashboard;