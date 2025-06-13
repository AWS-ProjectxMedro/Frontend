import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "../assets/styles/Support.scss";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import Seo from "../Component/Seo";
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaChevronDown, FaChevronUp } from "react-icons/fa";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const Support = () => {
  // State for the original list of FAQs from the API
  const [allFaqs, setAllFaqs] = useState([]);
  
  // State for loading, error, and search functionality
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchFaqs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${baseUrl}/api/faqs`);
        // Assuming response.data is an array like [{id: 1, question: '...', answer: '...'}]
        if (Array.isArray(response.data)) {
          setAllFaqs(response.data);
        } else {
            throw new Error("API did not return an array of FAQs.");
        }
      } catch (err) {
        console.error("Failed to fetch FAQs from API:", err);
        setError("Sorry, we couldn't load the FAQs. Please try again later.");
        setAllFaqs([]); // Clear out any stale data
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaqs();
  }, []); // Empty dependency array means this runs once on mount

  // Memoize the filtered FAQs to avoid recalculating on every render
  const filteredFaqs = useMemo(() => {
    if (!searchTerm) {
      return allFaqs;
    }
    return allFaqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allFaqs, searchTerm]);

  return (
    <div className="support-container">
      <Seo
        title="Support - The Capital Tree"
        description="Get help and answers to your questions. Contact our support team or browse our FAQ."
        page="Support"
        keywords={["trading", "thecapitaltree", "support", "help", "faq"]}
      />
      <Header />

      <main className="main-content-support">
        <section className="support-hero">
          <div className="support-content">
            <h1 className="support-title">How can we help?</h1>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search questions..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="faq-section">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-list-container">
            {isLoading && <p className="loading-message">Loading FAQs...</p>}
            {error && <p className="error-message">{error}</p>}
            {!isLoading && !error && (
              <ul className="faq-list">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, index) => (
                    <li 
                      // *** KEY FIX ***: Use a unique ID from your data, not the index.
                      // If your API doesn't provide an ID, the index is a fallback, but an ID is much better.
                      key={faq.id || index} 
                      className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                    >
                      <button className="faq-question" onClick={() => toggleFAQ(index)}>
                        <span>{faq.question}</span>
                        <span className="faq-icon-wrapper">
                            {activeIndex === index ? <FaChevronUp className="faq-icon" /> : <FaChevronDown className="faq-icon" />}
                        </span>
                      </button>
                      <div className="faq-answer-wrapper">
                        <p className="faq-answer">{faq.answer}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="no-results-message">No matching FAQs found.</p>
                )}
              </ul>
            )}
          </div>
        </section>

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
              width="100%" // Changed from 200%
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