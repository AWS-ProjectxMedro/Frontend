import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Invest.scss";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import Seo from "../Component/Seo";
import philosophy from "../assets/image/invest1.webp";
import timeline from '../assets/image/timeline.png';
import { FaChartBar,FaBriefcase,FaMoneyBillWave, FaShieldAlt, FaChartLine, FaCoins, FaLightbulb} from 'react-icons/fa';

function Invest() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 500);
  }, []);

  return (
    <div className="invest-container">
      <Seo
        title="Invest Page"
        description="This is the invest page"
        page="Invest"
        keywords={["trading", "thecapitaltree", "risk management", "strategies"]}
      />
      <Header />

      <main className="main-content-invest">
        <br />
        <br />  
        {/* Hero Section */}
        <section className="invest-hero">
          <div className="hero-text">
            <h1 className="invest-heading">
              Grow Your Wealth with Strategic Investments
            </h1>
            <p className="invest-subtext">
              Unlock consistent growth through innovative and risk-adjusted
              portfolio strategies.
            </p>
            <button className="primary-btn">Get Started</button>
          </div>
        </section>

        {/* Investment Philosophy */}
        <section className="invest-philosophy">
          <img
            src={philosophy}
            alt="Investment philosophy at The Capital Tree"
            title="Investment Philosophy"
            loading="eager"
          />
          <div className="philosophy-content">
            <h2>Investment Philosophy</h2>
            <p>
              At The Capital Tree, we believe in sustainable wealth creation
              through strategic and data-driven investment approaches. Our
              philosophy revolves around disciplined risk management,
              diversification, and maximizing returns while ensuring financial
              security for our investors.
            </p>
          </div>
        </section>

        {/* Key Benefits - Using Cards */}
        <section className="invest-benefits">
          <h2>Key Benefits of Partnering with The Capital Tree</h2>
          <div className="benefit-cards">
            <div className="benefit-card">
              <h3>📈 Consistent Returns</h3>
              <p>Targeting 3-5% monthly gains.</p>
            </div>
            <div className="benefit-card">
              <h3>🎯 Expert Management</h3>
              <p>Professionally curated portfolios backed by market research.</p>
            </div>
            <div className="benefit-card">
              <h3>🔄 Flexible Investment Options</h3>
              <p>Tailored plans for different financial goals.</p>
            </div>
            <div className="benefit-card">
              <h3>🔍 Transparency & Security</h3>
              <p>Regular performance reports and compliance with regulations.</p>
            </div>
          </div>
        </section>

        <div className="invest-process-invest-performance">
          {/* Investment Process - Using a Timeline */}
          <section className="invest-process">
            <h2>Our Investment Process</h2>
            <div className="process-timeline">
              <img src={timeline} alt="timeline" className="timeline" />
            </div>
          </section>

      <section className="invest-performance">
          <h2 className={visible ? "fade-in-title show" : "fade-in-title"}>Performance Highlights</h2>
          <ul className="fade-in-list show">
          <li className="fade-in-item">
          <FaChartBar className="highlight-icon" /> Average annual returns exceeding 36%.
          </li>
          <li className="fade-in-item">
        <FaBriefcase className="highlight-icon" /> Strong risk-adjusted returns through diversified strategies.
          </li>
          < li className="fade-in-item">
        <FaShieldAlt className="highlight-icon" /> Proven track record of consistent monthly payouts.
          </li>
          < li className="fade-in-item">
        <FaMoneyBillWave className="highlight-icon" /> Optimized risk management ensuring stable and high-yield investments.
          </li>
          < li className="fade-in-item">
        <FaChartLine className="highlight-icon" /> Maximizing returns while maintaining a balanced risk profile.
          </li>
          < li className="fade-in-item">
        <FaCoins className="highlight-icon" /> Strategic investment approaches yielding superior market performance.
          </li>
          < li className="fade-in-item">
        <FaLightbulb className="highlight-icon" /> Adaptive market strategies to capitalize on emerging opportunities.
          </li>
  </ul>
</section>

        </div>

        {/* CTA - Call to Action */}
        <section className="invest-cta">
          <h2>Take the next step toward financial freedom!</h2>
          <div className="cta-buttons">
            <button className="primary-btn">Schedule a Free Consultation</button>
            <button className="secondary-btn">Learn More About Our Funds</button>
          </div>
          <section className="">
            <h2>Regulatory and Compliance Notes</h2>
            <br />
            <p>The Capital Tree operates under <b>strict financial guidelines</b>, ensuring compliance with Indian investment laws. Our strategies adhere to SEBI regulations, offering a <b>secure and transparent investment platform</b>.</p>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Invest;
