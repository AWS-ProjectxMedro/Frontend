import React from "react";
import "../assets/styles/Blog.scss";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import Seo from "../Component/Seo";
import { NavLink } from "react-router-dom";
import {
    FaBeer ,
    FaUniversity,
    FaEye,
  FaMoneyBillWave,
} from "react-icons/fa";

function Blog() {
  return (
    <div className="blog-container">
      <Seo
        title="Blog Page"
        description="This is the Blog page"
        page="Blog"
        keywords={["trading", "thecaptaltree", "risk management", "strategies"]}
      />

      <Header />

      <div className="blog-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2 className="sidebar-title">Learning Paths</h2>
          <ul>
            <li>
              <NavLink
                to="/learn"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Investment Learning
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/book"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Books
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/short60"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Short60
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/blog"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Blog
              </NavLink>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content-blog">
          <section className="blog-section">
            <h1 className="main-heading-blog">Blog & Insights</h1>
            <p className="intro-text">
                Stay updated with expert market analysis, investment strategies,
                and financial insights.
              </p>

            <div className="hero-blog">
              
              <h3>Latest Articles:</h3>

              <div className="blog-grid">
                <div className="blog-card">
                  <FaUniversity size={60} color="#ffcc00" />
                  <h3>Smart Investing</h3>
                  <p>How to Build Wealth with Smart Investments</p>
                </div>

                <div className="blog-card">
                  <FaBeer  size={60} color="#ffcc00" />
                  <h3>Guide To Beginner</h3>
                  <p>Understanding Hedge Funds: A Beginner’s Guide</p>
                </div>

                <div className="blog-card">
                  <FaEye size={60} color="#ffcc00" />
                  <h3>Market Trends</h3>
                  <p>Market Trends to Watch in 2025</p>
                </div>

                <div className="blog-card">
                  <FaMoneyBillWave size={60} color="#ffcc00" />
                  <h3>SIP and Its Benefit</h3>
                  <p>The Power of SIPs in Wealth Creation</p>
                </div>
              </div>

              <p className="footer-note">
                📌 Explore more and take control of your financial future.
              </p>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Blog;
