import React from 'react';
import '../assets/styles/About.scss';
import Header from '../Component/Header';
import Footer from '../Component/Footer';
import { FaChartLine, FaUserShield, FaCoins, FaChartPie,FaQuestionCircle } from 'react-icons/fa';
import about from '../assets/image/About.png';
import Seo from '../Component/Seo';
import about2 from '../assets/image/about2.png';
import about3 from '../assets/image/About3.png';

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
      <main className="main-content-about">
        <br />
        <br />
        <section className="about-section">
          
          
          <img  
            className="About-img" 
            src={about} 
            alt="Trading Image" 
            title="Trading Image" 
            loading="eager" 
          />
        
        <h1>About The Capital Tree</h1>
        <div className='about-content'>
        <img  
            className="About3-img" 
            src={about3} 
            alt="Shutterstock Image "
            title="Shutterstock Image" 
            loading="eager" 
          />
          <p>
            At The Capital Tree, we blend innovative strategies with rigorous analysis to help our clients achieve sustainable financial growth. Our team of seasoned experts specializes in diversified investment portfolios tailored to your goals.
          </p>
          </div>
          <div className='business-trends' >
            
            <p>
              The Capital Tree is a next-generation investment platform dedicated to helping individuals and families achieve financial freedom. We specialize in hedge funds and systematic investment plans (SIPs), offering stable and high-yield investment options.
              Our mission is to bridge the gap between retail investors and sophisticated investment strategies, ensuring consistent returns with minimal risk.
            </p>
            <img  
              className="About2-img" 
              src={about2} 
              alt="portfolio Image" 
              title="portfolio Image" 
              loading="eager"
              height="300px"
            />
          </div>
        </section>

        {/* Why Choose Us */}
        <h2 className="about-h2">Why Choose Us <FaQuestionCircle /></h2>
        <div className="aboutChoose">
          
          <div className="about-card">
            <FaChartLine className="icon" />
            <p>Proven track record with high monthly gains</p>
          </div>
          <div className="about-card">
            <FaUserShield className="icon" />
            <p>Professional portfolio management</p>
          </div>
          <div className="about-card">
            <FaCoins className="icon" />
            <p>Secure & transparent investment platform</p>
          </div>
          <div className="about-card">
            <FaChartPie className="icon" />
            <p>Personalized investment solutions for diverse financial goals</p>
          </div>
        </div>

        <span className="join-us">
          Join us in <b>growing wealth smarter, faster and safer!</b>
        </span>
      </main>

      <Footer />
    </div>
  );
}

export default About;
