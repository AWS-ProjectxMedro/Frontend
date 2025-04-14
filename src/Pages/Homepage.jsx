import React from 'react';
// import { Link } from 'react-router-dom'; // Import if you wrap buttons in Link
import '../assets/styles/Homepage.scss';
import Header from '../Component/Header';
import Footer from  '../Component/Footer';
import mob from '../assets/image/home-img.png';
import Seo from '../Component/Seo';

const Homepage = () => {
  return (
    <div className="homepage-container">

      <Seo title="Home Page" description="this is home page" page="http://localhost:3000/" keywords={["trading", "thecaptaltree", "risk management", "strategies"]} />
      <Header />

      <main className="main-content">
        <section className="description-section">
          {/* Removed hardcoded negative margins in CSS */}
          <br /> <br />  <br />
          <h1 className="main-heading">"Cultivating Growth" One Investment at a Time</h1>
          {/* Reduced large top margin in CSS */}
          <h5 className='para1'>Empowering you with strategies to grow wealth, manage risk, and achieve financial freedom.</h5>
          <div className='button-container'>
            {/* Consider adding onClick handlers or wrapping in <Link> if they navigate */}
            <button className="button1">Get Started Today</button>
            <button className="button2">Learn About Our Strategy</button>
          </div>
        </section>
        <div className="img-section">
          {/* Removed fixed height/width attributes from HTML - CSS handles sizing */}
          {/* Added unique class names in case more specific styling is needed */}
          <img className="mobile-img mobile1" src={mob} alt="Screenshot of Capital Tree app interface 1" title='mobile-img-1' loading="eager" />
          <img className="mobile-img mobile2" src={mob} alt="Screenshot of Capital Tree app interface 2" title='mobile-img-2' loading="eager" />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Homepage;