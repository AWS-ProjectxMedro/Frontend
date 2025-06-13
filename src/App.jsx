// src/App.jsx

import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// CSS import moved to top
import "./App.css";

// Lazy load ALL components to prevent circular dependencies
const Homepage = lazy(() => import("./Pages/Homepage"));
const Login = lazy(() => import("./Pages/Login"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const About = lazy(() => import("./Pages/About"));
const Support = lazy(() => import("./Pages/Support"));
const Invest = lazy(() => import("./Pages/Invest"));
const Learn = lazy(() => import("./Pages/Learn"));
const SwpCalculator = lazy(() => import("./Pages/SwpCalculator"));
const Services = lazy(() => import("./Pages/Services"));
const Blog = lazy(() => import("./Component/learn/Blog"));
const AdminDashboard = lazy(() => import("./Pages/AdminDashboard"));

// Dashboard Components
const Short60 = lazy(() => import("./Component/learn/Short60"));
const Book = lazy(() => import("./Component/learn/Book"));
const MarketGuides = lazy(() => import("./Component/dashboard/MarketGuides"));
const Profile = lazy(() => import("./Component/dashboard/Profile"));
const InvestmentTools = lazy(() => import("./Component/dashboard/InvestmentTools"));
const Payment = lazy(() => import("./Component/dashboard/Payment"));
const Withdrawal = lazy(() => import("./Component/dashboard/Withdrawal"));

// Admin Components
const AdminOverview = lazy(() => import("./Component/AdminDashboard/AdminOverview"));
const UserManagement = lazy(() => import("./Component/AdminDashboard/userManagement"));
const ManageBlog = lazy(() => import("./Component/AdminDashboard/manageBlog"));
const TransactionPage = lazy(() => import("./Component/AdminDashboard/transcation"));
const AdminPlansPage = lazy(() => import("./Component/AdminDashboard/AdminPlans"));
const AdminWithdrawal = lazy(() => import("./Component/AdminDashboard/Withdrawal"));

// Layout Component
const DashboardLayout = lazy(() => import("./Pages/DashboardLayout"));

// Query Client Configuration
const queryClient = new QueryClient({
  defaultOptions: { 
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  },
});

// Admin email list - Update this with your actual admin emails
const ADMIN_EMAILS = [
  'admin@yourdomain.com',
  'superadmin@yourdomain.com',
  // Add more admin emails as needed
];

// Utility Functions
const determineUserRole = (user) => {
  if (!user || !user.email) return 'user';
  return ADMIN_EMAILS.includes(user.email.toLowerCase()) ? 'admin' : 'user';
};

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// Loading Component
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    fontSize: '18px',
    backgroundColor: '#f8f9fa'
  }}>
    <div style={{
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #007bff',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px'
    }}></div>
    {message}
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Suspense Fallback
const SuspenseFallback = ({ message = "Loading..." }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '16px'
  }}>
    {message}
  </div>
);

// Unauthorized Page Component
const UnauthorizedPage = ({ userRole, isAuthenticated, onLogout }) => (
  <div style={{ 
    padding: '40px', 
    textAlign: 'center',
    maxWidth: '600px',
    margin: '50px auto',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }}>
    <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>Access Denied</h1>
    <p style={{ fontSize: '16px', marginBottom: '20px' }}>
      You do not have permission to view this page.
    </p>
    <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '30px' }}>
      Current role: {userRole} | Authenticated: {isAuthenticated ? 'Yes' : 'No'}
    </p>
    <button 
      onClick={() => window.history.back()}
      style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '10px'
      }}
    >
      Go Back
    </button>
    <button 
      onClick={onLogout}
      style={{
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Logout
    </button>
  </div>
);

// Route Protection Components
const PrivateRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RoleBasedRoute = ({ isAuthenticated, userRole, allowedRoles, children }) => {
  console.log('RoleBasedRoute - Auth:', isAuthenticated, 'Role:', userRole, 'Allowed:', allowedRoles);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles || !allowedRoles.includes(userRole)) {
    console.log('Access denied - redirecting to unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>Something went wrong</h2>
          <p style={{ marginBottom: '20px' }}>The application encountered an error.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  // State Management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear authentication data
  const clearAuthData = () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userData");
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
    
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentUser(null);
    setError(null);
  };

  // Store authentication data
  const storeAuthData = (token, role, user) => {
    try {
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userData", JSON.stringify({
        uid: user.uid || user.id,
        email: user.email,
        displayName: user.displayName || user.name,
        photoURL: user.photoURL || user.avatar
      }));
    } catch (error) {
      console.error("Error storing auth data:", error);
    }
  };

  // Check stored authentication on app load
  useEffect(() => {
    const checkStoredAuth = () => {
      try {
        const token = localStorage.getItem("authToken");
        const role = localStorage.getItem("userRole");
        const userData = localStorage.getItem("userData");
        
        console.log('Checking stored auth:', { hasToken: !!token, role, hasUserData: !!userData });
        
        if (token && role && userData) {
          const tokenPayload = parseJwt(token);
          const currentTime = Date.now() / 1000;
          
          if (tokenPayload && tokenPayload.exp && tokenPayload.exp > currentTime) {
            const user = JSON.parse(userData);
            setIsAuthenticated(true);
            setUserRole(role);
            setCurrentUser(user);
            console.log('Restored auth from storage:', role);
          } else {
            console.log('Stored token expired');
            clearAuthData();
          }
        }
      } catch (error) {
        console.error("App.jsx: Error parsing stored token:", error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    checkStoredAuth();
  }, []);

  // Login handler - Updated to work with any authentication system
  const handleLogin = async (token, role, userData) => {
    console.log('HandleLogin called with:', { role, userData: userData?.email });
    
    // Re-determine role based on email if needed
    if (!role || role === 'user') {
      role = determineUserRole(userData);
    }
    
    storeAuthData(token, role, userData);
    setIsAuthenticated(true);
    setUserRole(role);
    setCurrentUser(userData);
    setError(null);
    
    console.log('Login successful, role set to:', role);
  };

  // Logout handler - Simplified without Firebase
  const handleLogout = async () => {
    try {
      // If you have a logout API endpoint, call it here
      // await fetch('/api/logout', { method: 'POST' });
      
      clearAuthData();
    } catch (error) {
      console.error("App.jsx: Error during logout:", error);
      clearAuthData(); // Clear local state even if API call fails
    }
  };

  // Debug auth when loading completes
  useEffect(() => {
    if (!loading && process.env.NODE_ENV === 'development') {
      console.log('=== AUTH DEBUG INFO ===');
      console.log('isAuthenticated:', isAuthenticated);
      console.log('userRole:', userRole);
      console.log('currentUser:', currentUser?.email);
      console.log('localStorage userRole:', localStorage.getItem('userRole'));
      console.log('localStorage userData:', localStorage.getItem('userData'));
      console.log('Admin emails:', ADMIN_EMAILS);
      console.log('========================');
    }
  }, [loading, isAuthenticated, userRole, currentUser]);

  // Error boundary fallback
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>Application Error</h2>
        <p style={{ marginBottom: '20px' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reload Application
        </button>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return <LoadingSpinner message="Loading Application..." />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <Router>
            <div className="app-container">
              <Suspense fallback={<SuspenseFallback message="Loading page..." />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Homepage />} />
                  
                  <Route 
                    path="/login" 
                    element={
                      isAuthenticated ? (
                        userRole === "admin" ? 
                          <Navigate to="/adminDashboard" replace /> : 
                          <Navigate to="/dashboard" replace />
                      ) : (
                        <Login onLoginSuccess={handleLogin} />
                      )
                    } 
                  />
                  
                  <Route path="/invest" element={<Invest />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/swp-calculator" element={<SwpCalculator />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/short60" element={<Short60 />} />
                  <Route path="/book" element={<Book />} />
                  
                  {/* Unauthorized Route */}
                  <Route 
                    path="/unauthorized" 
                    element={
                      <UnauthorizedPage 
                        userRole={userRole}
                        isAuthenticated={isAuthenticated}
                        onLogout={handleLogout}
                      />
                    } 
                  />

                  {/* User Protected Routes with Layout */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <PrivateRoute isAuthenticated={isAuthenticated}>
                        <Suspense fallback={<SuspenseFallback message="Loading dashboard..." />}>
                          <DashboardLayout onLogout={handleLogout} />
                        </Suspense>
                      </PrivateRoute>
                    }
                  >
                    <Route index element={
                      <Suspense fallback={<SuspenseFallback />}>
                        <Dashboard />
                      </Suspense>
                    } /> 
                    <Route path="marketguides" element={
                      <Suspense fallback={<SuspenseFallback />}>
                        <MarketGuides />
                      </Suspense>
                    } />
                    <Route path="profile" element={
                      <Suspense fallback={<SuspenseFallback />}>
                        <Profile />
                      </Suspense>
                    } />
                    <Route path="investmenttools" element={
                      <Suspense fallback={<SuspenseFallback />}>
                        <InvestmentTools />
                      </Suspense>
                    } />
                    <Route path="payment" element={
                      <Suspense fallback={<SuspenseFallback />}>
                        <Payment />
                      </Suspense>
                    } />
                    <Route path="withdrawal" element={
                      <Suspense fallback={<SuspenseFallback />}>
                        <Withdrawal />
                      </Suspense>
                    } />
                  </Route>
                  
                  {/* Admin Protected Routes */}
                  <Route 
                    path="/adminDashboard"
                    element={
                      <RoleBasedRoute 
                        isAuthenticated={isAuthenticated} 
                        userRole={userRole} 
                        allowedRoles={["admin"]}
                      >
                        <Suspense fallback={<SuspenseFallback message="Loading admin dashboard..." />}>
                          <AdminDashboard onLogout={handleLogout} />
                        </Suspense>
                      </RoleBasedRoute>
                    }
                  >
                    <Route index element={
                      <Suspense fallback={<SuspenseFallback />}>
                        <AdminOverview />
                      </Suspense>
                    } />
                    <Route path="userManagement" element={
                      <Suspense fallback={<SuspenseFallback />}>
                        <UserManagement />
                      </Suspense>
                    } />
                    <Route path="manageBlog" element={
                      <Suspense fallback={<SuspenseFallback />}>
                        <ManageBlog />
                      </Suspense>
                    } />
                    <Route path="adminPlans" element={
                      <Suspense fallback={<SuspenseFallback />}>
                        <AdminPlansPage />
                      </Suspense>
                    } />
                    <Route path="transaction" element={
                      <Suspense fallback={<SuspenseFallback />}>
                        <TransactionPage />
                      </Suspense>
                    } />
                    <Route path="withdrawals" element={
                      <Suspense fallback={<SuspenseFallback />}>
                        <AdminWithdrawal />
                      </Suspense>
                    } />
                  </Route>
                  
                  {/* Catch-all Route */}
                  <Route 
                    path="*" 
                    element={
                      isAuthenticated ? (
                        userRole === "admin" ? 
                          <Navigate to="/adminDashboard" replace /> : 
                          <Navigate to="/dashboard" replace />
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    } 
                  />
                </Routes>
              </Suspense>
            </div>
          </Router>
        </HelmetProvider>
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;