import { Link } from "react-router-dom";
import '../assets/styles/Footer.scss'

export default function Footer() {
  return (
    <footer className="footer">
      <svg 
        className="footer__wave" 
        viewBox="0 0 1512 195" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* SVG paths for the wavy background */}
        <mask id="mask0_footer" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="1527" height="195">
          <rect width="1527" height="195" fill="#C4C4C4"/>
        </mask>
        <g mask="url(#mask0_footer)">
          <path fillRule="evenodd" clipRule="evenodd" d="M-34.9937 154.509C-0.318119 176.842 40.6193 194.538 105.334 194.538C282.071 194.538 282.071 135.668 458.807 135.668C635.543 135.668 635.543 195.827 812.279 195.827C989.016 195.827 989.016 89.8185 1165.75 89.8185C1342.49 89.8185 1342.49 192.102 1519.22 192.102C1585.76 192.102 1626.36 186.825 1661.67 180.246V195.907L-34.9937 195.827V154.509Z" fill="#CADEB6"/>
          <path opacity="0.5" d="M-34.9937 142.065C-0.330847 171.141 40.6585 194.147 105.334 194.147C282.071 194.147 282.071 117.437 458.807 117.437C635.543 117.437 635.543 195.827 812.279 195.827C989.016 195.827 989.016 57.6948 1165.75 57.6948C1342.49 57.6948 1342.49 190.972 1519.22 190.972C1585.7 190.972 1626.38 184.109 1661.67 175.546" stroke="#CADEB6"/>
          <path d="M-34.9937 141.022C-0.33509 169.832 40.6691 192.627 105.334 192.627C282.071 192.627 282.071 107.405 458.807 107.405C635.543 107.404 635.543 194.822 812.279 194.822C989.016 194.822 989.016 46.1998 1165.75 46.1998C1342.49 46.1998 1342.49 184.663 1519.22 184.663C1585.39 184.663 1626.49 175.08 1661.67 163.089" stroke="#CADEB6"/>
          <path opacity="0.5" d="M-34.9937 139.951C-0.330847 168.509 40.6596 191.109 105.334 191.109C282.071 191.109 282.071 97.4148 458.807 97.4148C635.543 97.4148 635.543 193.817 812.279 193.817C989.016 193.817 989.016 34.7554 1165.75 34.7554C1342.49 34.7554 1342.49 178.378 1519.22 178.378C1585.72 178.378 1626.37 165.902 1661.67 150.337" stroke="#CADEB6"/>
          <path d="M-34.9937 139.583C-0.330847 168.051 40.6596 190.578 105.334 190.578C282.071 190.578 282.071 87.8486 458.807 87.8486C635.543 87.8486 635.543 193.817 812.279 193.817C989.016 193.817 989.016 23.3659 1165.75 23.3659C1342.49 23.3659 1342.49 172.997 1519.22 172.997C1585.35 172.997 1626.5 157.816 1661.67 138.813" stroke="#CADEB6" strokeDasharray="10 10"/>
          <path opacity="0.5" d="M-34.9937 138.495C-0.328727 166.721 40.6521 189.06 105.334 189.06C282.071 189.06 282.071 77.8424 458.807 77.8424C635.543 77.8424 635.543 192.812 812.279 192.812C989.016 192.812 989.016 11.8842 1165.75 11.8842C1342.49 11.8842 1342.49 166.716 1519.22 166.716C1585.58 166.716 1626.42 148.644 1661.67 126.071" stroke="#CADEB6"/>
        </g>
      </svg>
      
      <div className="footer__content">
        <div className="footer__container">
          <div className="footer__grid">
            <div className="footer__column">
              <h3 className="footer__heading footer__heading--logo">
                The Capital Tree
              </h3>
              <p className="footer__text">
                Mean if he they been no hold mr. Is at much do made took held help. Latter person am secure of estate genius at.
              </p>
              <div className="footer__social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Facebook">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Instagram">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Twitter">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="LinkedIn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Features</h4>
              <ul className="footer__links-list">
                <li><Link to="/features" className="footer__link">Features</Link></li>
                <li><Link to="/pricing" className="footer__link">Pricing</Link></li>
                <li><Link to="/login" className="footer__link">Login</Link></li>
                <li><Link to="/signup" className="footer__link">Signup</Link></li>
              </ul>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Terms of Use</h4>
              <ul className="footer__links-list">
                <li><Link to="/privacy-policy" className="footer__link">Privacy Policy</Link></li>
                <li><Link to="/legal-notice" className="footer__link">Legal Notice</Link></li>
              </ul>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Feedback</h4>
              <ul className="footer__links-list">
                <li><Link to="/privacy-policy" className="footer__link">Privacy Policy</Link></li>
                <li><Link to="/legal-notice" className="footer__link">Legal Notice</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer__copyright">
            <p className="footer__copyright-text">Made by Medro ❤️</p>
          </div>
        </div>
      </div>
    </footer>
  );
}