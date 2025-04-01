import React from "react";
import "../assets/styles/Support.scss";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import Seo from "../Component/Seo";
import { FaPhone, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

const Support = () => {
  return (
    <div className="support-container">
      <Seo
        title="Support Page"
        description="Get help and support for our services"
        page="Support"
        keywords={["trading", "thecapitaltree", "support", "help"]}
      />
      <Header />

      {/* Main Content */}
      <main className="main-content-support">
        {/* Hero Section */}
        <section className="support-hero">
          <div className="support-content">
            <h1 className="support-title">How can we help?</h1>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search for help..."
                className="search-input"
              />
              <button className="search-btn">Search</button>
            </div>
          </div>
        </section>

        {/* Help Desk Section */}
        <section className="help-desk">
          <h2 className="help-title">Contact Support</h2>
          <div className="help-options">
            <div className="help-card">
              <FaPhone className="help-icon" />
              <h3>Call Us</h3>
              <p> 8263066511</p>
            </div>
            <div className="help-card">
              <FaEnvelope className="help-icon" />
              <h3>Email Us</h3>
              <p>contact@thecapitaltree.in</p>
            </div>
            <div className="help-card">
              <FaMapMarkerAlt className="help-icon" />
              <h3>Visit Us</h3>
              <p>The Capital Tree Office</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
