import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <h1>About Pristine Education</h1>
            <p>Shaping the future through innovative, technology-centered learning.</p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content">
              <h2>Our Mission</h2>
              <p className="lead">
                To empower learners of all ages with cutting-edge skills in technology, 
                innovation, and sustainability that prepare them for the challenges 
                and opportunities of tomorrow's world.
              </p>
              <p>
                We believe that education should be practical, engaging, and globally 
                relevant. Through our bootcamps, Olympiad preparation tracks, and corporate 
                training programs, we bridge the gap between academic knowledge and 
                real-world application.
              </p>
            </div>
            <div className="mission-image">
              <div className="image-placeholder">
                <svg viewBox="0 0 24 24" width="120" height="120" fill="#003B73" opacity="0.2">
                  <path d="M12 2L1 21h22M12 6l7.53 13H4.47"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Our Values</h2>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                </svg>
              </div>
              <h3>Innovation</h3>
              <p>We embrace emerging technologies and continuously evolve our curriculum to stay ahead of industry trends.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <h3>Global Perspective</h3>
              <p>Our programs reflect international standards while remaining accessible and relevant to local contexts.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
              </div>
              <h3>Excellence</h3>
              <p>We maintain the highest standards in curriculum design, instruction, and student outcomes.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L7 18.5l3.5 3.5L13 18.5l3.5 3.5L19 18.5l2.22 2.22 1.44-1.44L19 14.78c0-3.39-2.61-6.78-2-8.78z"/>
                </svg>
              </div>
              <h3>Sustainability</h3>
              <p>We're committed to environmental stewardship and integrate climate awareness into our programs.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
              <h3>Community</h3>
              <p>We build supportive learning communities where students, parents, and educators thrive together.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <h3>Transparency</h3>
              <p>We provide clear curriculum outlines, pricing, and outcomes so families can make informed decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team section">
        <div className="container">
          <div className="section-header">
            <h2>Leadership Team</h2>
            <p className="section-subtitle">Meet the people driving innovation in education.</p>
          </div>

          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar">
                <span>JO</span>
              </div>
              <h3>Dr. James Okonkwo</h3>
              <p className="team-role">Founder & CEO</p>
              <p className="team-bio">20+ years in education technology and curriculum development across Africa and the Middle East.</p>
            </div>

            <div className="team-card">
              <div className="team-avatar">
                <span>SA</span>
              </div>
              <h3>Sarah Al-Rashid</h3>
              <p className="team-role">Chief Academic Officer</p>
              <p className="team-bio">Former university professor with expertise in AI/ML education and international program design.</p>
            </div>

            <div className="team-card">
              <div className="team-avatar">
                <span>EA</span>
              </div>
              <h3>Emmanuel Adeyemi</h3>
              <p className="team-role">Head of Bootcamps</p>
              <p className="team-bio">Software engineer turned educator with experience at leading tech companies worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Our Partners</h2>
            <p className="section-subtitle">Collaborating with leading institutions to deliver excellence.</p>
          </div>

          <div className="partners-grid">
            <div className="partner-logo">Partner School 1</div>
            <div className="partner-logo">Partner School 2</div>
            <div className="partner-logo">Tech Partner 1</div>
            <div className="partner-logo">University Partner</div>
            <div className="partner-logo">Corporate Partner</div>
            <div className="partner-logo">NGO Partner</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta section">
        <div className="container">
          <div className="cta-box">
            <h2>Join Our Mission</h2>
            <p>Whether you're a student, parent, school, or corporate partner, there's a place for you in the Pristine community.</p>
            <div className="cta-buttons">
              <Link to="/admissions" className="btn btn-primary btn-lg">Enroll Now</Link>
              <Link to="/contact" className="btn btn-outline btn-lg">Partner With Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
