import React from "react";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
// Import images directly
import processImage from "../assets/image/process.png";
import logoImage from "../assets/image/logo21.png";
import "../assets/styles/Invest.scss";

// Constants
const ILLUSTRATION =
  "https://cdn.builder.io/api/v1/image/assets%2Fc4fe271434c34a4ab024c85d60fccf8c%2Fac68eaf117a54283b98d1c0cf3a67bf2?format=webp&width=800";
const PROCESS_ILLUSTRATION =
  "https://cdn.builder.io/api/v1/image/assets%2Fc4fe271434c34a4ab024c85d60fccf8c%2F3a274ba1317e4690bbc836ba261c1cae?format=webp&width=1200";

const BENEFITS = [
  { key: "r", title: "Consistent Returns", body: "Targeting 8-15% monthly gains", icon: "star" },
  { key: "e", title: "Expert Management", body: "Experienced portfolio managers backed by research", icon: "gear" },
  { key: "f", title: "Flexible Investment Options", body: "Tailored plans for different financial goals", icon: "options" },
  { key: "t", title: "Transparency & Security", body: "Regular reporting and compliance safeguards", icon: "shield" },
];

const PERFORMANCE_HIGHLIGHTS = [
  "Average annual returns exceeding 36%.",
  "Strong risk-adjusted returns through diversified strategies.",
  "Proven track record of consistent monthly payouts.",
  "Average annual returns exceeding 36%.",
  "Strong risk-adjusted returns through diversified strategies.",
  "Proven track record of consistent monthly payouts.",
];

export default function Invest() {
  return (
    <>
      <Header />
      <div className="page-container">
        {/* HERO */}
        <section className="hero-section section-base">
          <h1 className="hero-title">
            Grow Your <span className="wealth-span">Wealth</span>
            <br />
            with Strategic <span className="investments-span">Investments</span>
          </h1>
          <p className="hero-subtitle">
            Unlock consistent growth through innovative active+diversified portfolio strategies.
          </p>
          <div className="hero-button-wrapper">
            <button className="shop-now-button">Shop now</button>
          </div>
        </section>

        {/* Investment Philosophy */}
        <section className="philosophy-section">
          <div className="philosophy-content">
            <div className="image-wrapper">
              <img src={ILLUSTRATION} alt="invest" className="illustration-image" />
            </div>

            <div className="text-wrapper">
              <div className="philosophy-card">
                <h3 className="card-title">Investment Philosophy</h3>
                <p className="card-body">
                  At The Capital Tree, we believe in sustainable wealth creation through strategic and
                  diversified investment approaches. Our focus on long-term returns, risk management, and
                  continuous portfolio optimisation ensures financial security for our investors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="benefits-section section-base">
          <h2 className="benefits-title">
            Key Benefits of Partnering with <span className="benefits-span">The Capital Tree</span>
          </h2>

          <div className="benefits-grid">
            {BENEFITS.map((c) => (
              <div key={c.key} className="benefit-item">
                <div className="icon-wrapper">
                  {/* SVG icons use CSS variables for fill color */}
                  {c.icon === "star" && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="var(--soft-green)" />
                    </svg>
                  )}
                  {c.icon === "gear" && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 00.11-.64l-1.92-3.32a.5.5 0 00-.6-.22l-2.39.96a7.007 7.007 0 00-1.6-.94l-.36-2.54A.5.5 0 0013.5 2h-3a.5.5 0 00-.49.42l-.36 2.54c-.58.23-1.12.53-1.62.9l-2.39-.96a.5.5 0 00-.6.22L2.72 8.5a.5.5 0 00.11.64L4.86 10.7c-.04.31-.06.63-.06.95s.02.64.06.95L2.83 14.2a.5.5 0 00-.11.64l1.92 3.32c.14.24.43.34.68.24l2.39-.96c.5.37 1.04.67 1.62.9l.36 2.54c.05.26.27.42.49.42h3c.23 0 .43-.16.49-.42l.36-2.54c.58-.23 1.12-.53 1.6-.94l2.39.96c.25.1.54 0 .68-.24l1.92-3.32a.5.5 0 00-.11-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" fill="var(--soft-green)" />
                    </svg>
                  )}
                  {c.icon === "options" && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 10h16v2H4zM4 6h10v2H4zM4 14h6v2H4z" fill="var(--soft-green)" />
                    </svg>
                  )}
                  {c.icon === "shield" && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2l7 3v6c0 5-3.8 9.7-7 11-3.2-1.3-7-6-7-11V5l7-3z" fill="var(--soft-green)" />
                    </svg>
                  )}
                </div>

                <div>
                  <div className="benefit-title">{c.title}</div>
                  <div className="benefit-body">{c.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Investment Process */}
        <section className="process-section section-base">
          <h2 className="process-title">
            Our Investment <span className="process-span">Process</span>
          </h2>

          <div className="process-image-wrapper">
            <img
              src={processImage}
              alt="Investment Process Flow"
              className="process-image"
            />
            <div className="process-cta">
              <button className="process-cta-button">Get Started</button>
            </div>
          </div>
        </section>

        {/* Performance Highlights */}
        <section className="performance-section section-base">
          <h2 className="performance-title">
            Performance <span className="performance-span">Highlights</span>
          </h2>

          <div className="performance-grid-container">
            <div className="performance-grid">
              {PERFORMANCE_HIGHLIGHTS.map((text, i) => (
                <div key={i} className="highlight-card">
                  <img
                    src={logoImage}
                    alt="Logo"
                    className="highlight-logo"
                  />
                  <div className="highlight-decorator">
                    <div className="highlight-decorator-inner" />
                  </div>
                  <div className="highlight-text">{text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Regulatory */}
        <section className="regulatory-section section-base">
          <h2 className="regulatory-title">
            Take the next step toward <span className="regulatory-span">financial</span> freedom!
          </h2>

          <div className="regulatory-content-wrapper">
            <div className="regulatory-card">
              <p className="regulatory-text">
                The Capital Tree operates under strict financial guidelines, ensuring compliance with
                relevant investment laws. Our strategies adhere to local regulations, offering a
                secure and transparent investment platform.
              </p>

              <div className="input-group">
                <input className="email-input" placeholder="Enter your email" />
                <button className="start-button">Get Started</button>
              </div>

              {/* dotted decor */}
              <div className="dot-decorator-top-right" />
              <div className="dot-decorator-bottom-left" />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}