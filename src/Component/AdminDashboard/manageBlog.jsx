import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "./AdminSidebar";
import "../AdminDashboard/manageBlog.scss";
import axios from "axios"; // Ensure axios is imported

function ManageBlog() {
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/blogs`)
      .then((response) => {
        setBlogData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog data:", err);
        setError("Failed to load blog data");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="dashboard-manageBlog">
        <SidebarAdmin />

        <div className="main-content-manageBlog">
          <h2>Welcome Back!</h2>
          <div className="profile">
            <img src="profile-picture-placeholder.png" alt="Profile" />
            <div className="user-info">
              <h3>John Doe</h3>
              <p>WRITER / AUTHOR</p>
              <p>FOLLOWERS: 1.5k</p>
              <p>JOINED: May 12, 2020</p>
            </div>
          </div>

          <div className="stats">
            <div className="stat">
              <h4>Total Page</h4>
              <p>160</p>
            </div>
            <div className="stat">
              <h4>Total Post</h4>
              <p>{blogData.length}</p>
            </div>
          </div>

          <div className="recent-blog">
            <h4>Recent Blog</h4>

            {loading ? (
              <p>Loading blogs...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : (
              blogData.map((blog, index) => (
                <div className="blog-item" key={index}>
                  <input type="checkbox" />
                  <span>{blog.title}</span>
                  <span>{blog.comments || 0} Comments</span>
                  <span>{blog.views || 0} Views</span>
                  <button>Edit</button>
                </div>
              ))
            )}

            <button className="add-new">+ Add New</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageBlog;
