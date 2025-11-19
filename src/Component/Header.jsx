import { Link } from "react-router-dom";
import { useState } from "react";
import '../assets/styles/Header.scss'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [learnDropdownOpen, setLearnDropdownOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          The Capital Tree
        </Link>
        
        {/* Desktop Menu */}
        <div className="navbar__menu navbar__menu--desktop">
          <Link to="/" className="navbar__link navbar__link--home">Home</Link>
          <Link to="/about" className="navbar__link">About us</Link>
          <Link to="/invest" className="navbar__link">Invest</Link>
          <Link to="/swp-calculator" className="navbar__link">SWP Calculator</Link>
          <div 
            className="navbar__dropdown"
            onMouseEnter={() => setLearnDropdownOpen(true)}
            onMouseLeave={() => setLearnDropdownOpen(false)}
          >
            <Link to="/learn" className="navbar__link navbar__link--dropdown">
              Learn
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="dropdown-arrow">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            {learnDropdownOpen && (
              <div className="navbar__dropdown-menu">
                <Link to="/learn" className="navbar__dropdown-item" onClick={() => setLearnDropdownOpen(false)}>
                  Investment Learning
                </Link>
                <Link to="/book" className="navbar__dropdown-item" onClick={() => setLearnDropdownOpen(false)}>
                  Books
                </Link>
                <Link to="/blog" className="navbar__dropdown-item" onClick={() => setLearnDropdownOpen(false)}>
                  Blog
                </Link>
              </div>
            )}
          </div>
          <Link to="/support" className="navbar__link">Support</Link>
        </div>

        <div className="navbar__actions">
          <Link to="/login" className="navbar__login">
            <span>Login</span>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Login Icon Path */}
                <path fillRule="evenodd" clipRule="evenodd" d="M13.0875 10.5875C12.9119 10.7633 12.8133 11.0016 12.8133 11.25C12.8133 11.4984 12.9119 11.7367 13.0875 11.9125L15.2375 14.0625H5C4.75136 14.0625 4.5129 14.1613 4.33709 14.3371C4.16127 14.5129 4.0625 14.7514 4.0625 15C4.0625 15.2486 4.16127 15.4871 4.33709 15.6629C4.5129 15.8387 4.75136 15.9375 5 15.9375H15.2375L13.0875 18.0875C12.9954 18.1733 12.9215 18.2768 12.8703 18.3918C12.819 18.5068 12.7915 18.631 12.7893 18.7568C12.787 18.8827 12.8102 19.0078 12.8573 19.1245C12.9045 19.2412 12.9747 19.3473 13.0637 19.4363C13.1527 19.5253 13.2588 19.5955 13.3755 19.6427C13.4922 19.6898 13.6173 19.713 13.7432 19.7107C13.869 19.7085 13.9932 19.681 14.1082 19.6297C14.2232 19.5785 14.3267 19.5046 14.4125 19.4125L18.1625 15.6625C18.3381 15.4867 18.4367 15.2484 18.4367 15C18.4367 14.7516 18.3381 14.5133 18.1625 14.3375L14.4125 10.5875C14.2367 10.4119 13.9984 10.3133 13.75 10.3133C13.5016 10.3133 13.2633 10.4119 13.0875 10.5875Z" fill="currentColor"/>
              <path opacity="0.5" d="M15 25C17.6522 25 20.1957 23.9464 22.0711 22.0711C23.9464 20.1957 25 17.6522 25 15C25 12.3478 23.9464 9.8043 22.0711 7.92893C20.1957 6.05357 17.6522 5 15 5V25Z" fill="currentColor"/>
            </svg>
          </Link>

          <button 
            className="navbar__mobile-button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="navbar__menu navbar__menu--mobile">
          <Link to="/" className="navbar__link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/about" className="navbar__link" onClick={() => setMobileMenuOpen(false)}>About us</Link>
          <Link to="/invest" className="navbar__link" onClick={() => setMobileMenuOpen(false)}>Invest</Link>
          <Link to="/swp-calculator" className="navbar__link" onClick={() => setMobileMenuOpen(false)}>SWP Calculator</Link>
          <Link to="/learn" className="navbar__link" onClick={() => setMobileMenuOpen(false)}>Investment Learning</Link>
          <Link to="/book" className="navbar__link" onClick={() => setMobileMenuOpen(false)}>Books</Link>
          <Link to="/blog" className="navbar__link" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
          <Link to="/support" className="navbar__link" onClick={() => setMobileMenuOpen(false)}>Support</Link>
        </div>
      )}
    </nav>
  );
}