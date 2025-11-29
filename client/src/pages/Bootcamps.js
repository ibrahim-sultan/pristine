import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProgramCard from '../components/UI/ProgramCard';
import { programService } from '../services/api';
import './Programs.css';

const Bootcamps = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await programService.getByCategory('bootcamp');
        setPrograms(response.data.programs || []);
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const filteredPrograms = filter === 'all' 
    ? programs 
    : programs.filter(p => p.level === filter);

  return (
    <div className="programs-page">
      {/* Hero Section */}
      <section className="page-hero bootcamp-hero">
        <div className="container">
          <div className="page-hero-content">
            <span className="hero-label">Programs</span>
            <h1>High-Impact Bootcamps for Tomorrow's Skills</h1>
            <p>
              Our bootcamps prepare learners for real-world application—from coding their first 
              website to building data-driven climate models. Intensive, hands-on, results-driven.
            </p>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="features-bar">
        <div className="container">
          <div className="features-bar-grid">
            <div className="feature-item">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
              </svg>
              <span>4-12 Week Programs</span>
            </div>
            <div className="feature-item">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
              </svg>
              <span>Live Instructor Sessions</span>
            </div>
            <div className="feature-item">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              <span>Project-Based Learning</span>
            </div>
            <div className="feature-item">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
              </svg>
              <span>Certificate Included</span>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="programs-list section">
        <div className="container">
          <div className="programs-header">
            <h2>Available Bootcamps</h2>
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Levels
              </button>
              <button 
                className={`filter-tab ${filter === 'beginner' ? 'active' : ''}`}
                onClick={() => setFilter('beginner')}
              >
                Beginner
              </button>
              <button 
                className={`filter-tab ${filter === 'intermediate' ? 'active' : ''}`}
                onClick={() => setFilter('intermediate')}
              >
                Intermediate
              </button>
              <button 
                className={`filter-tab ${filter === 'advanced' ? 'active' : ''}`}
                onClick={() => setFilter('advanced')}
              >
                Advanced
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          ) : filteredPrograms.length > 0 ? (
            <div className="programs-grid">
              {filteredPrograms.map(program => (
                <ProgramCard key={program._id} program={program} />
              ))}
            </div>
          ) : (
            <div className="no-programs">
              <p>No programs found for this filter. Try a different level.</p>
            </div>
          )}
        </div>
      </section>

      {/* Curriculum Highlights */}
      <section className="curriculum-highlights section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>What You'll Learn</h2>
            <p className="section-subtitle">Our bootcamp curriculum covers the most in-demand tech skills.</p>
          </div>

          <div className="curriculum-grid">
            <div className="curriculum-track">
              <div className="track-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                </svg>
              </div>
              <h3>Coding & Development</h3>
              <ul>
                <li>Python Programming</li>
                <li>Web Development (HTML, CSS, JS)</li>
                <li>React.js Framework</li>
                <li>Backend Development</li>
              </ul>
            </div>

            <div className="curriculum-track">
              <div className="track-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79s7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58s9.14-3.47 12.65 0L21 3v7.12zM12.5 8v4.25l3.5 2.08-.72 1.21L11 13V8h1.5z"/>
                </svg>
              </div>
              <h3>AI & Data Science</h3>
              <ul>
                <li>Machine Learning</li>
                <li>Data Analysis</li>
                <li>Neural Networks</li>
                <li>Predictive Modeling</li>
              </ul>
            </div>

            <div className="curriculum-track">
              <div className="track-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L7 18.5l3.5 3.5L13 18.5l3.5 3.5L19 18.5l2.22 2.22 1.44-1.44L19 14.78c0-3.39-2.61-6.78-2-8.78z"/>
                </svg>
              </div>
              <h3>Climate Tech</h3>
              <ul>
                <li>Climate Data Analysis</li>
                <li>Sustainability Solutions</li>
                <li>Environmental Monitoring</li>
                <li>Green Innovation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="programs-cta section">
        <div className="container">
          <div className="cta-box">
            <h2>Start Your Bootcamp Journey</h2>
            <p>Transform your skills and career with our intensive, hands-on bootcamps.</p>
            <div className="cta-buttons">
              <Link to="/admissions" className="btn btn-primary btn-lg">Apply Now</Link>
              <Link to="/contact" className="btn btn-outline btn-lg">Get More Info</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Bootcamps;
