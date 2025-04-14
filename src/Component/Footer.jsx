import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter, FaPhone, FaMapMarkerAlt, FaEnvelope} from "react-icons/fa"; 
import "../assets/styles/Footer.scss";
import footerLogo from "../assets/image/logo4.png";


const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section ">
                    <div className="footer-heading">
                        <img className="footerLogo" src={footerLogo} alt="logo" title="logo" loading="eager" />
                        <h2 className="logo-text">TheCapitalTree</h2>
                    </div>
                    <p className="footer-para">
                        TheCapitalTree provides the <br />  best investment options to <br /> help you grow your wealth.
                    </p>
                    <div className="contact">
                    <a href="tel:+918263066511" target="_blank" rel="noopener noreferrer"><span><FaPhone /> 8263066511</span> </a>
                    <a href="https://maps.app.goo.gl/xdqz1Wpt6SNNejF97"><span><FaMapMarkerAlt />  The Capital Tree, Pune, India</span> </a>
                    <a href= "mailto:contact@thecapitaltree.in" target="_blank" rel="noopener noreferrer">   <span><FaEnvelope /> contact@thecapitaltree.in</span> </a>
                    </div>
                    
                </div>

                

                <div className="footer-section links">
                    <h2>TheCapitalTree</h2>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/support">Support</Link></li>
                        <li><Link to="/blog"> Blog</Link></li>
                        
                        
                    </ul>
                </div>

                <div className="footer-section links">
                    <h2>Resources</h2>
                    <ul>
                        <li><Link to="/">Terms & Conditions</Link></li>
                        <li><Link to="/services">Privacy Policy</Link></li>
                        <li><Link to="/Support">FAQs</Link></li>
                    </ul>
                </div>
               
                <div className="footer-section links">
                    <ul className="social-icons">
                    <a href="https://www.linkedin.com/company/thecapitaltree" target="_blank" rel="noopener noreferrer"><FaLinkedin className="social-icon" /></a>
                        <a href="https://www.facebook.com/thecapitaltree" target="_blank" rel="noopener noreferrer"><FaFacebook className="social-icon" /></a>
                        <a href="https://www.instagram.com/thecapitaltree" target="_blank" rel="noopener noreferrer"><FaInstagram className="social-icon" /></a>
                        <a href="https://www.twitter.com/thecapitaltree" target="_blank" rel="noopener noreferrer"><FaTwitter className="social-icon" /></a>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
            <p className="copyright">&copy; TheCapitalTree. Backed by Medro. All rights reserved.</p>
            
            
</div>

        </footer>
    );
};

export default Footer;
