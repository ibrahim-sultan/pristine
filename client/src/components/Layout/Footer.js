import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-text">Pristine</span>
              <span className="logo-accent">Education</span>
            </Link>
            <p className="footer-description">
              Future-focused education in coding, AI, climate technology, and Olympiad excellence. 
              Empowering learners across Nigeria, Saudi Arabia, and beyond.
            </p>
            <div className="social-links">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.58-2.11-9.96-5.02-.42.72-.66 1.56-.66 2.46 0 1.68.85 3.16 2.14 4.02-.79-.02-1.53-.24-2.18-.6v.06c0 2.35 1.67 4.31 3.88 4.76-.4.1-.83.16-1.27.16-.31 0-.62-.03-.92-.08.63 1.96 2.45 3.39 4.61 3.43-1.69 1.32-3.83 2.1-6.15 2.1-.4 0-.8-.02-1.19-.07 2.19 1.4 4.78 2.22 7.57 2.22 9.07 0 14.02-7.52 14.02-14.02 0-.21 0-.43-.01-.64.96-.69 1.79-1.56 2.45-2.55z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Programs</h4>
            <ul>
              <li><Link to="/bootcamps">Bootcamps</Link></li>
              <li><Link to="/olympiad-prep">Olympiad Prep</Link></li>
              <li><Link to="/corporate-training">Corporate Training</Link></li>
              <li><Link to="/climate-programs">Climate Programs</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/admissions">Admissions</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="#faq">FAQs</a></li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Subscribe to our newsletter for the latest programs and updates.</p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {new Date().getFullYear()} Pristine Education. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
