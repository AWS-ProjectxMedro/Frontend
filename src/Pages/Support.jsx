import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles/Support.scss";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import Seo from "../Component/Seo";
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaChevronDown, FaChevronUp } from "react-icons/fa";

const Support = () => {
  const [faqs, setFaqs] = useState([
    { question: "How do I reset my password?", answer: "You can reset your password by going to the login page and clicking on 'Forgot Password'." },
    { question: "What are the customer support hours?", answer: "Our support team is available 24/7 to assist you." },
    { question: "How can I track my investments?", answer: "You can track your investments through your dashboard after logging into your account." }
  ]);

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get("http://3.109.55.32:3308/api/faqs");
        if (Array.isArray(response.data)) {
          setFaqs(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch FAQs from API:", error);
      }
    };

    fetchFaqs();
  }, []);

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

            {/* FAQ Section */}
            <div className="faq-section">
              <h2 className="faq-title">Frequently Asked Questions</h2>
              <ul className="faq-list">
                {faqs.map((faq, index) => (
                  <li key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
                    <button className="faq-question" onClick={() => toggleFAQ(index)}>
                      {faq.question}
                      {activeIndex === index ? <FaChevronUp className="faq-icon" /> : <FaChevronDown className="faq-icon" />}
                    </button>
                    {activeIndex === index && <p className="faq-answer">{faq.answer}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Help Desk Section */}
        <section className="help-desk">
          <h2 className="help-title">Contact Support</h2>
          <div className="help-options">
            <div className="help-card">
              <a href="tel:+918263066511" target="_blank" rel="noopener noreferrer">
                <FaPhone className="help-icon" />
                <h3>Call Us</h3>
                <p>+918263066511</p>
              </a>
            </div>
            <div className="help-card">
              <a href="mailto:contact@thecapitaltree.in">
                <FaEnvelope className="help-icon" />
                <h3>Email Us</h3>
                <p>contact@thecapitaltree.in</p>
              </a>
            </div>
            <div className="help-card">
              <a href="https://maps.app.goo.gl/xdqz1Wpt6SNNejF97" target="_blank" rel="noopener noreferrer">
                <FaMapMarkerAlt className="help-icon" />
                <h3>Visit Us</h3>
                <p>The Capital Tree Office</p>
              </a>
            </div>
          </div>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d483932.5549122065!2d73.84133806650388!3d18.631520958858324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1743574547016!5m2!1sen!2sin"
              width="200%"
              height="450"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="The Capital Tree Location"
            ></iframe>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
