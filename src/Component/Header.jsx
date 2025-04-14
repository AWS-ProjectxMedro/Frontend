import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Header.scss";
import logo from "../assets/image/logo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu when a link is clicked
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" onClick={closeMenu}> {/* Close menu on logo click too */}
          <img src={logo} alt="The Capital Tree Logo" title="logo" height="40px" width="120px" loading="eager" />
        </Link>
        
      </div>

      {/* Hamburger Menu Button */}
      <button
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        aria-controls="nav-menu" // Points to the ID of the navigation list
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Navigation Links */}
      <nav>
        <ul id="nav-menu" className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><Link className="nav-link" to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link className="nav-link" to="/about" onClick={closeMenu}>About Us</Link></li>
          <li><Link className="nav-link" to="/invest" onClick={closeMenu}>Invest</Link></li>
          <li><Link className="nav-link" to="/swp-calculator" onClick={closeMenu}>SWP Calculator</Link></li>
          <li><Link className="nav-link" to="/learn" onClick={closeMenu}>Learn</Link></li>
          <li><Link className="nav-link" to="/support" onClick={closeMenu}>Support</Link></li>
          <li><Link className="nav-link" to="/login" onClick={closeMenu}>Login</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;