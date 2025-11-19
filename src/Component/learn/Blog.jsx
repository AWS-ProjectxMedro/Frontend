import React, { useState, useEffect, useCallback } from "react";
import { NavLink, Link } from "react-router-dom"; // Link for "Read More"
import axios from "axios";
import "./Style/Blog.scss" // Assuming this is your SCSS file for the blog page
import Header from "../Header";   // Assuming correct path
import Footer from "../Footer";   // Assuming correct path
import Seo from "../Seo";       // Assuming correct path

// Helper function to truncate content (optional)
const truncateContent = (htmlContent, maxLength) => {
  if (!htmlContent) return '';
  // Strip HTML tags for a cleaner excerpt
  const textContent = new DOMParser().parseFromString(htmlContent, 'text/html').body.textContent || "";
  if (textContent.length <= maxLength) return textContent;
  // Find the last space within the maxLength
  const trimmedString = textContent.substr(0, maxLength);
  return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))) + "...";
};

function PublicBlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = process.env.REACT_APP_API_BASE_URL; // Your API base URL

  const fetchPublicBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Public endpoint, no token needed generally
      const response = await axios.get(`${baseUrl}/api/blogs`);
      // You might want to filter for "published" blogs if your API supports it
      // For example: response.data.filter(blog => blog.isPublished)
      setBlogs(response.data);
    } catch (err) {
      console.error("Error fetching public blog data:", err);
      setError(
        "Failed to load articles. " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchPublicBlogs();
  }, [fetchPublicBlogs]);

  return (
    <div className="blog-container">
      <Seo
        title="Blog & Insights - TheCapitalTree"
        description="Stay updated with expert market analysis, investment strategies, and financial insights from TheCapitalTree."
        page="Blog"
        keywords={[
          "blog",
          "insights",
          "market analysis",
          "investment strategies",
          "financial education",
          "thecaptaltree",
        ]}
      />

      <Header />

      <main className="blog-main-content">
        <section className="blog-hero-section">
          <h1 className="blog-heading">
            <span className="blog-heading-b">B</span>log & Insights
          </h1>
          <p className="blog-description">
            Stay updated with expert market analysis, investment strategies, and financial insights. Latest Articles:
          </p>
        </section>

        <section className="blog-articles-section">
          {loading && <p className="loading-text">Loading articles...</p>}
          {error && <p className="error-text">{error}</p>}
          
          {!loading && !error && blogs.length === 0 && (
            <p className="no-articles-text">No articles found at the moment. Check back soon!</p>
          )}

          {!loading && !error && blogs.length > 0 && (
            <div className="blog-cards-grid">
              {blogs.slice(0, 3).map((blog) => (
                <div className="blog-article-card" key={blog.id || blog._id}>
                  <div className="blog-card-image-wrapper">
                    {blog.imageUrl ? (
                      <Link to={`/blog/${blog.id || blog._id}`}>
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          className="blog-card-image"
                        />
                      </Link>
                    ) : (
                      <div className="blog-card-image-placeholder">
                        <div className="blog-card-image-circle"></div>
                      </div>
                    )}
                  </div>
                  <div className="blog-card-text-content">
                    <h3 className="blog-card-title">
                      <Link to={`/blog/${blog.id || blog._id}`}>
                        {blog.title || "Smart Investing"}
                      </Link>
                    </h3>
                    <p className="blog-card-subtitle">
                      {blog.subtitle || truncateContent(blog.content, 50) || "How to Build Wealth with Smart Investments"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default PublicBlogPage;