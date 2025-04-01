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
                        TheCapitalTree provides the best investment options to help you grow your wealth.
                    </p>
                    <div className="contact">
                        <span><FaPhone /> 8263066511</span>
                        <span><FaMapMarkerAlt />  The Capital Tree, Pune, India</span>
                        <span><FaEnvelope /> contact@thecapitaltree.in</span>
                    </div>
                    <div className="social-icons">
                        <a href="https://www.linkedin.com/company/thecapitaltree" target="_blank" rel="noopener noreferrer"><FaLinkedin className="social-icon" /></a>
                        <a href="https://www.facebook.com/thecapitaltree" target="_blank" rel="noopener noreferrer"><FaFacebook className="social-icon" /></a>
                        <a href="https://www.instagram.com/thecapitaltree" target="_blank" rel="noopener noreferrer"><FaInstagram className="social-icon" /></a>
                        <a href="https://www.twitter.com/thecapitaltree" target="_blank" rel="noopener noreferrer"><FaTwitter className="social-icon" /></a>
                    </div>
                </div>

                <div className="footer-section links">
                    <h2>Products</h2>
                    <ul>
                        <li><Link to="/">MTF</Link></li>
                        <li><Link to="/about">NFO</Link></li>
                        <li><Link to="/services">IPO</Link></li>
                        <li><Link to="/blog">ETF</Link></li>
                        <li><Link to="/contact">Credit</Link></li>
                        <li><Link to="/contact">Stocks</Link></li>
                        <li><Link to="/contact">Mutual Funds</Link></li>
                        <li><Link to="/contact">Bill Payment</Link></li>
                        <li><Link to="/contact">Future & Option</Link></li>
                    </ul>
                </div>

                <div className="footer-section links">
                    <h2>TheCapitalTree</h2>
                    <ul>
                        <li><Link to="/">Blog</Link></li>
                        <li><Link to="/about">Pricing</Link></li>
                        <li><Link to="/services">Career</Link></li>
                        <li><Link to="/blog">About</Link></li>
                        <li><Link to="/contact">Media & Press</Link></li>
                        <li><Link to="/contact">Help & Support</Link></li>
                        <li><Link to="/contact">Trust and Safety</Link></li>
                    </ul>
                </div>

                <div className="footer-section links">
                    <h2>Resources</h2>
                    <ul>
                        <li><Link to="/">AMC</Link></li>
                        <li><Link to="/services">Glossary</Link></li>
                        <li><Link to="/blog">Calculator</Link></li>
                        <li><Link to="/contact">Mutual Funds</Link></li>
                        <li><Link to="/contact">Open Demat Account</Link></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
            <p className="copyright">&copy; TheCapitalTree. Backed by Medro. All rights reserved.</p>
            <div className="app-buttons">
                <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg" alt="Download on the App Store" className="app-store-btn" />
                </a>
                <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="play-store-btn" />
                </a>
            </div>
            
</div>

        </footer>
    );
};

export default Footer;
