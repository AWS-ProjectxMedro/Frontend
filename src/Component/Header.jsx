import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Header.scss";
import logo from "../assets/image/logo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="The Capital Tree Logo"  title="logo" height="40px" width="60px" loading="eager"/>

        <span>Cultivating Growth, One Investment at a Time</span>
      </div>

      
      <nav>
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><Link className="nav-link" to="/">Home</Link></li>
          <li><Link className="nav-link" to="/about">About</Link></li>
          <li><Link className="nav-link" to="/invest">Invest</Link></li>
          <li><Link className="nav-link" to="/swp-calculator">SWP Calculator</Link></li>
          <li><Link className="nav-link" to="/learn">Learn</Link></li>
          <li><Link className="nav-link" to="/support">Support</Link></li>
          <li><Link className="nav-link" to="/login">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
