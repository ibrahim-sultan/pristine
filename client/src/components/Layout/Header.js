import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programsDropdown, setProgramsDropdown] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setProgramsDropdown(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" onClick={closeMobileMenu}>
            <span className="logo-text">Pristine</span>
            <span className="logo-accent">Education</span>
          </Link>

          <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <NavLink to="/" onClick={closeMobileMenu}>Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/about" onClick={closeMobileMenu}>About</NavLink>
              </li>
              <li 
                className="nav-item dropdown"
                onMouseEnter={() => setProgramsDropdown(true)}
                onMouseLeave={() => setProgramsDropdown(false)}
              >
                <span className="dropdown-trigger">
                  Programs
                  <svg className="dropdown-arrow" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                  </svg>
                </span>
                <ul className={`dropdown-menu ${programsDropdown ? 'show' : ''}`}>
                  <li><NavLink to="/bootcamps" onClick={closeMobileMenu}>Bootcamps</NavLink></li>
                  <li><NavLink to="/olympiad-prep" onClick={closeMobileMenu}>Olympiad Prep</NavLink></li>
                  <li><NavLink to="/corporate-training" onClick={closeMobileMenu}>Corporate Training</NavLink></li>
                  <li><NavLink to="/climate-programs" onClick={closeMobileMenu}>Climate Programs</NavLink></li>
                </ul>
              </li>
              <li className="nav-item">
                <NavLink to="/admissions" onClick={closeMobileMenu}>Admissions</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/contact" onClick={closeMobileMenu}>Contact</NavLink>
              </li>
            </ul>

            <div className="nav-actions">
              {user ? (
                <div className="user-menu">
                  <span className="user-greeting">Hi, {user.firstName}</span>
                  {isAdmin && (
                    <Link to="/admin" className="btn btn-outline btn-sm" onClick={closeMobileMenu}>
                      Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="btn btn-outline btn-sm">
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline btn-sm" onClick={closeMobileMenu}>
                    Login
                  </Link>
                  <Link to="/admissions" className="btn btn-primary btn-sm" onClick={closeMobileMenu}>
                    Enroll Now
                  </Link>
                </>
              )}
            </div>
          </nav>

          <button 
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
