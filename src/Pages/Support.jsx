import { useState } from "react";
// 💡 IMPORTANT: Update these paths based on your actual file structure
import Header from "../Component/Header"
import Footer from "../Component/Footer";
import { Search, Plus, Minus, Phone, Mail, MapPin } from "lucide-react";
// Import the companion SCSS file
import "../assets/styles/Support.scss";
// Import world map image
import worldMapImage from "../assets/image/world map.png";

// We'll define the structure for clarity, removing TypeScript colon notation for .jsx compatibility
// interface FAQItem {
//   id: number;
//   question: string;
//   answer: string;
// }

export default function Support() {
  // Removed <number | null> type annotation for pure JSX
  const [openFAQ, setOpenFAQ] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [ // No explicit type needed in JSX
    {
      id: 1,
      question: "How do I reset my password?",
      answer:
        'You can reset your password by going to the login page and clicking on "Forgot Password".',
    },
    {
      id: 2,
      question: "What are the customer support hours?",
      answer:
        "Our customer support is available Monday to Friday, 9 AM to 6 PM IST. We strive to respond to all queries within 24 hours.",
    },
  ];

  const toggleFAQ = (id) => { // No explicit type needed in JSX
    setOpenFAQ(openFAQ === id ? null : id);
  };


  return (
    <div className="support-page-container">
      <Header />

      <main className="main-content">
        <div className="section-container">
          {/* Search Section */}
          <section className="search-section">
            <div className="search-input-wrapper">
              <div className="search-bar-wrapper">
                <input
                  type="text"
                  placeholder="How Can We Help...?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button className="search-button">
                  <Search className="search-icon" />
                  Search
                </button>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="faq-section">
            <h2 className="faq-title">FAQ's</h2>

            <div className="faq-list">
              {faqs.map((faq) => (
                <div key={faq.id} className="faq-item">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="faq-question-button"
                  >
                    <span className="faq-question-text">{faq.question}</span>
                    {openFAQ === faq.id ? (
                      <Minus className="toggle-icon" />
                    ) : (
                      <Plus className="toggle-icon" />
                    )}
                  </button>
                  {openFAQ === faq.id && (
                    <div className="faq-answer-wrapper">
                      <div className="faq-answer-content">
                        <p className="faq-answer-text">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Contact Support Section */}
          <section className="contact-section">
            <h2 className="contact-title">Contact Support</h2>

            {/* Contact Details Grid */}
            <div className="contact-details-grid">
              <div className="contact-detail-card">
                <div className="contact-icon-wrapper contact-icon-yellow-bg">
                  <Phone className="contact-icon contact-icon-yellow-text" />
                </div>
                <h3 className="contact-heading">Call</h3>
                <p className="contact-text">+91 8263066511</p>
              </div>

              <div className="contact-detail-card">
                <div className="contact-icon-wrapper contact-icon-green-bg">
                  <Mail className="contact-icon contact-icon-green-text" />
                </div>
                <h3 className="contact-heading">Email</h3>
                <p className="contact-text">contact@thecapitaltree.in</p>
              </div>

              <div className="contact-detail-card">
                <div className="contact-icon-wrapper contact-icon-green-bg">
                  <MapPin className="contact-icon contact-icon-green-text" />
                </div>
                <h3 className="contact-heading">Location</h3>
                <p className="contact-text">The Capital Tree, Pune, India</p>
              </div>
            </div>

            {/* Contact Form & SVG */}
            <div className="contact-form-layout">
              <div className="contact-form-wrapper">
                <div className="input-field-group">
                  <label htmlFor="name" className="input-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    defaultValue="Prateek"
                    className="text-input"
                  />
                </div>

                <div className="input-field-group">
                  <label htmlFor="email" className="input-label">
                    Email
                  </label>
                  <input type="email" id="email" className="text-input" />
                </div>

                <div className="input-field-group">
                  <label htmlFor="subject" className="input-label">
                    Subject
                  </label>
                  <input type="text" id="subject" className="text-input" />
                </div>

                <div className="input-field-group">
                  <label htmlFor="message" className="input-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="text-input resize-none"
                  />
                </div>

                <button className="submit-button">Send Message</button>
              </div>

              {/* World Map Image */}
              <div className="contact-svg-wrapper">
                <img
                  src={worldMapImage}
                  alt="World Map"
                  className="contact-svg"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Decorative absolute elements */}
        <div className="decorative-bottom-left" />
        <div className="decorative-ellipse-1" />
        <div className="decorative-ellipse-2" />
      </main>

      <Footer />
    </div>
  );
}