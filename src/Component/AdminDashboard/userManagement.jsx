import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import logo3 from "../../assets/image/logo3.png";
import SidebarAdmin from "./AdminSidebar";
import './UserManagement.scss';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const handleSignOut = () => {
    // Implement authentication state management
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    setLoading(true);
    axios.get(`${baseUrl}/api/users`)
      .then(response => {
        // Check if the response data is an array
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else if (response.data && typeof response.data === 'object') {
          // If the response is an object but contains users data in a property
          // This is a fallback in case the API returns { users: [...] } format
          const userData = response.data.users || response.data.data || [];
          setUsers(Array.isArray(userData) ? userData : []);
        } else {
          // If response structure is unexpected
          throw new Error('Invalid data format received from API');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setError(`Failed to fetch users: ${err.message || 'Unknown error'}`);
        setLoading(false);
      });
  }, [baseUrl]);

  return (
    <div className="dashboard-account">
      <SidebarAdmin />

      <div className="user-management-content">
        <h2>User Management</h2>

        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <>
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
                  <tr key={user.id}>
                    <td>{user.name || 'N/A'}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>{user.role || 'N/A'}</td>
                    <td>
                      {user.isEmailVerified ? 'Email ✓' : 'Email ✗'}
                      {' | '}
                      {user.isPhoneVerified ? 'Phone ✓' : 'Phone ✗'}
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button>❮</button>
              <span>1</span>
              <span>2</span>
              <span>...</span>
              <span>10</span>
              <button>❯</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagement;