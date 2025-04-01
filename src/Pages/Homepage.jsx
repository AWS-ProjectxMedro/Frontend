import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Homepage.scss';
import logo from '../assets/image/logo.png';
import Header from '../Component/Header';
import Footer from  '../Component/Footer';
import mob from '../assets/image/home-img.png';
import { BiMobileAlt } from 'react-icons/bi';
import Seo from '../Component/Seo';

const Homepage = () => {
  return (
    <div className="homepage-container">
      
      <Seo title="Home Page" description="this is home page" page="http://localhost:3000/" keywords={["trading", "thecaptaltree", "risk management", "strategies"]} />
      <Header />

      <main className="main-content">
        <section className="description-section">
          
          <br /> <br />
          <h1 className="main-heading" >"Cultivating Growth" One Investment at a Time</h1>
          <h5 className='para1' >Empowering you with strategies to grow wealth, manage risk, and achieve financial freedom.</h5>
          <div className='button-container'>
          <button className="button1">Get Started Today</button>
          <button className="button2">Learn About Our Strategy</button>
          </div>
        </section>
        <div className="img-section">
        <img className="mobile1" src={mob} alt="Mobile-img" title='mobile-img' height="600px" width="600px" loading="eager" />
        <img className="mobile2" src={mob} alt="Mobile-img" title='mobile-img' height="600px" width="600px" loading="eager" />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Homepage;