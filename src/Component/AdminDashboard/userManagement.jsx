// UserManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useOutletContext } from 'react-router-dom'; // Import useOutletContext
import './Style/UserManagement.scss';         // Ensure this path is correct

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { onLogout } = useOutletContext() || {}; // Get onLogout from AdminDashboard context

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // console.warn('Invalid date string received for formatting:', dateString);
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    if (!baseUrl) {
      setError("API base URL is not configured. Please set REACT_APP_API_BASE_URL in your .env file.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole"); // Good practice to check role again

    if (!token || userRole !== "admin") { // Ensure only admin can access
      setError("Unauthorized: No valid admin token or role. Please log in.");
      setLoading(false);
      if (onLogout) onLogout(); // Use the central logout function
      else navigate('/login'); // Fallback
      return;
    }

    setLoading(true);
    setError(null);

    axios.get(`${baseUrl}/api/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        let usersData = [];
        if (Array.isArray(response.data)) {
          usersData = response.data;
        } else if (response.data && typeof response.data === 'object') {
          usersData = response.data.users || response.data.data || [];
          if (!Array.isArray(usersData)) {
            console.error('Expected users array, but got:', usersData);
            usersData = []; // Default to empty array on unexpected structure
            throw new Error('Invalid data format for users list');
          }
        } else {
          console.error('Invalid data format received for users:', response.data);
          throw new Error('Invalid data format received from API');
        }
        setUsers(usersData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        let errorMessage = 'Failed to fetch users.';
        if (err.response) {
          errorMessage += ` Server responded with status ${err.response.status}.`;
          if (err.response.data && err.response.data.message) {
            errorMessage += ` Message: ${err.response.data.message}`;
          }
          if (err.response.status === 401 || err.response.status === 403) {
            errorMessage += " Your session may have expired or you lack permission. Please log in again.";
            if (onLogout) onLogout();
            else { // Fallback if onLogout is not available
                localStorage.removeItem("authToken");
                localStorage.removeItem("userRole");
                localStorage.removeItem("userData");
                navigate('/login');
            }
          }
        } else if (err.request) {
          errorMessage += ' No response received from server. Check API server and network.';
        } else {
          errorMessage += ` Error: ${err.message}`;
        }
        setError(errorMessage);
        setLoading(false);
      });
  }, [baseUrl, navigate, onLogout]); // Added onLogout to dependency array

  if (loading && !users.length && !error) {
    return <div className="user-management-page"><p>Loading users...</p></div>;
  }

  return (
    // This div is now a child of "main-content-Admin" from AdminDashboard.jsx
    // REMOVED <SidebarAdmin />
    <div className="user-management-page"> {/* Or use "user-management-content" if that's more semantic for your CSS */}
      <h2>User Management</h2>

      {loading && users.length > 0 && <p>Updating user list...</p>} {/* More subtle loading for updates */}
      {error && <p className="error-message" style={{color: 'red', border: '1px solid red', padding: '10px'}}>{error}</p>}
      
      {!loading && !error && users.length === 0 && (
        <p>No users found.</p>
      )}

      {!error && users.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id || user._id}> {/* Support for _id from MongoDB */}
                    <td>{user.name || 'N/A'}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>{user.role || 'N/A'}</td>
                    <td>
                      {user.isEmailVerified ? 'Email ✓' : 'Email ✗'}
                      {' | '}
                      {user.isPhoneVerified ? 'Phone ✓' : 'Phone ✗'}
                    </td>
                    <td>{formatDate(user.createdAt || user.registrationDate)}</td> {/* Adjust date field name if necessary */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button disabled>❮</button>
            <span>1</span>
            {/* Add more pagination logic as needed */}
            <button disabled>❯</button>
          </div>
        </>
      )}
      {/* REMOVED <Outlet /> */}
    </div>
  );
};

export default UserManagement;