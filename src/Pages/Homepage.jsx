import React, { useState } from 'react';
import '../assets/styles/Homepage.scss';
import Header from '../Component/Header';
import Footer from '../Component/Footer';
import mob from '../assets/image/home-img.jpg';
import Seo from '../Component/Seo';

const Homepage = () => {
  const [showPlans, setShowPlans] = useState(false);
  const [showStrategy, setShowStrategy] = useState(false);

  const handlePlansClick = () => {
    setShowPlans(!showPlans);
    setShowStrategy(false); // hide strategy if open
  };

  const handleStrategyClick = () => {
    setShowStrategy(!showStrategy);
    setShowPlans(false); // hide plans if open
  };

  return (
    <div className="homepage-container">
      <Seo 
        title="Home Page" 
        description="this is home page" 
        page="home" 
        keywords={["trading", "thecaptaltree", "risk management", "strategies"]} 
      />
      
      <Header />

      <main className="main-content">
        <section className="description-section">
          <br /><br /><br />
          <h1 className="main-heading">"Cultivating Growth" One Investment at a Time</h1>
          <h5 className='para1'>
            Empowering you with strategies to grow wealth, manage risk, and achieve financial freedom.
          </h5>

          <div className='button-container'>
            <button className="button1" onClick={handlePlansClick}>Get Started Today</button>
            <button className="button2" onClick={handleStrategyClick}>Learn About Our Strategy</button>
          </div>

          {showPlans && (
            <div className="info-section">
              <h3>Choose Your Plan</h3>
              <div className="plan-box">
                <h4>🔹 Basic Plan</h4>
                <p>Ideal for beginners. Includes weekly market analysis, risk management tips, and educational content.</p>
              </div>
              <div className="plan-box">
                <h4>🔹 Premium Plan</h4>
                <p>Includes all Basic features plus real-time trading alerts, 1-on-1 portfolio reviews, and priority support .</p>
              </div>
            </div>
          )}

          {showStrategy && (
            <div className="info-section">
              <h3>Our Investment Strategy</h3>
              <p>
                Our approach blends long-term portfolio growth with active risk-managed trading. We leverage technical analysis,
                macroeconomic trends, and AI-driven insights to help clients make informed investment decisions and stay ahead of market volatility.
              </p>
            </div>
          )}
        </section>

        <div className="img-section">
          <img className="mobile-img mobile1" src={mob} alt="Screenshot of Capital Tree app interface 1" title='mobile-img-1' loading="eager" />
          <img className="mobile-img mobile2" src={mob} alt="Screenshot of Capital Tree app interface 2" title='mobile-img-2' loading="eager" />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Homepage;