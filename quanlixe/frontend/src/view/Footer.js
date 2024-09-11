import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import '../css/Footer.css';

function Footer({ isUserPage, isAdminPage }) {
  return (
    <footer className="footer">
      <div className="footer-container">
        {isUserPage ? (
          <div className="footer-section">
            <p>Bạn đang trong trang người dùng</p>
          </div>
        ) : isAdminPage ? (
          <div className="footer-section">
            <p>Bạn đang trong trang quản trị</p>
          </div>
        ) : (
          <>
            <div className="footer-section">
              <h4>About Us</h4>
              <ul>
                <li><a href="/about">Our Company</a></li>
                <li><a href="/team">Team</a></li>
                <li><a href="/careers">Careers</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Services</h4>
              <ul>
                <li><a href="/services">What We Do</a></li>
                <li><a href="/projects">Projects</a></li>
                <li><a href="/support">Support</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <ul className="social-icons">
                <li>
                  <a href="https://www.facebook.com/HuyShtorm?locale=vi_VN" target="_blank" rel="noopener noreferrer" className="facebook-icon">
                    <FaFacebook /> Nguyễn Quốc Huy
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/cdanh.2002?locale=vi_VN" target="_blank" rel="noopener noreferrer" className="facebook-icon">
                    <FaFacebook />
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <ul className="social-icons">
                <li>
                  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="facebook-icon">
                    <FaFacebook />
                  </a>
                </li>
                <li>
                  <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="twitter-icon">
                    <FaTwitter />
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="linkedin-icon">
                    <FaLinkedin />
                  </a>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
