import React from 'react';
import '../assets/styles/About.scss';
import Header from '../Component/Header';
import Footer from '../Component/Footer';
import WCS from '../assets/image/About Us.png';
import Seo from '../Component/Seo';
import GeometricBackground from '../Component/GeometricBackground';

const About = () => {
  return (
    <div className="about-container">
      <Seo 
        title="About Page" 
        description="This is the About page"  
        keywords={["trading", "thecapitaltree", "risk management", "strategies"]} 
      />

      <Header />

      {/* Main Content */}
      <main className="about-main">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <div className="about-title-wrapper">
              <h1 className="about-title">
                About <span className="title-accent">The Capital Tree</span>
              </h1>
              <div className="about-hero-actions">
                <a href="#why" className="btn-learn-more">Learn more</a>
              </div>
            </div>
            <p className="about-intro">
              At The Capital Tree, we blend innovative strategies with rigorous analysis to help our clients achieve sustainable financial growth. Our team of seasoned experts specializes in diversified investment portfolios tailored to your goals.
            </p>
            <p className="about-intro">
              The Capital Tree is a next-generation investment platform dedicated to helping individuals and families achieve financial freedom. We specialize in hedge funds and systematic investment plans (SIPs), offering stable and high-yield investment options. Our mission is to bridge the gap between retail investors and sophisticated investment strategies, ensuring consistent returns with minimal risk.
            </p>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="why" className="why-choose-us">
          <div className="why-content-wrapper">
            <div className="why-left">
              <h2 className="why-title">
                <span className="why-w">W</span><span className="why-rest">hy Choose Us</span>
              </h2>
              <div className="why-features">
                <div className="why-feature-item">
                  <span className="feature-number">1.</span>
                  <span className="feature-text">Proven track record with high monthly gains</span>
                </div>
                <div className="why-feature-item">
                  <span className="feature-number">2.</span>
                  <span className="feature-text">Professional portfolio management</span>
                </div>
                <div className="why-feature-item">
                  <span className="feature-number">3.</span>
                  <span className="feature-text">Secure & transparent investment</span>
                </div>
                <div className="why-feature-item">
                  <span className="feature-number">4.</span>
                  <span className="feature-text">Personalized investment solutions for platform</span>
                </div>
              </div>
            </div>
            <div className="why-right">
              <div className="why-images-grid">
                {/* Replace src values with your own images */}
                <img src={WCS} alt="Feature visual 1" className="why-grid-img" />
                <img src={WCS} alt="Feature visual 2" className="why-grid-img" />
                <img src={WCS} alt="Feature visual 3" className="why-grid-img" />
                <img src={WCS} alt="Feature visual 4" className="why-grid-img" />
              </div>
            </div>
          </div>
        </section>

        {/* Decorative Image Section */}
       

        {/* CTA Section */}
        <section className="about-cta">
          <GeometricBackground className="cta-background-svg" />
          <div className="cta-content">
            <div className="cta-dot"></div>
            <h2 className="cta-title">
              Join us in growing<br />
              wealth smarter, faster<br />
              and safer!
            </h2>
            <div className="cta-dot"></div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default About;
