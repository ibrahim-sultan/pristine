import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProgramCard from '../components/UI/ProgramCard';
import { programService } from '../services/api';
import './Programs.css';

const CorporateTraining = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await programService.getByCategory('corporate');
        setPrograms(response.data.programs || []);
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <div className="programs-page">
      {/* Hero Section */}
      <section className="page-hero corporate-hero">
        <div className="container">
          <div className="page-hero-content">
            <span className="hero-label">Corporate Solutions</span>
            <h1>Transform Your Workforce Through Innovation</h1>
            <p>
              Personalized digital upskilling to empower educators, teams, and institutions. 
              Tailored programs that deliver measurable outcomes.
            </p>
            <div className="hero-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">Request Proposal</Link>
              <a href="#programs" className="btn btn-outline btn-lg">View Programs</a>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="benefits section">
        <div className="container">
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h4v2h-4v2h4v2H9V7h6v2z"/>
                </svg>
              </div>
              <h3>Customized Content</h3>
              <p>Programs tailored to your organization's specific needs and industry context.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
              <h3>Expert Instructors</h3>
              <p>Industry professionals with real-world experience in technology and education.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <h3>Measurable Outcomes</h3>
              <p>Clear KPIs and assessment frameworks to track progress and ROI.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <h3>Flexible Delivery</h3>
              <p>Online, onsite, or hybrid options to fit your team's schedule and preferences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Training Modules */}
      <section className="modules section section-alt" id="programs">
        <div className="container">
          <div className="section-header">
            <h2>Training Modules</h2>
            <p className="section-subtitle">Comprehensive programs designed for organizational growth.</p>
          </div>

          <div className="modules-showcase">
            <div className="module-item">
              <div className="module-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79s7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58s9.14-3.47 12.65 0L21 3v7.12z"/>
                </svg>
              </div>
              <h3>AI Literacy for Leaders</h3>
              <p>Understanding AI applications and strategic implementation for decision-makers.</p>
            </div>
            <div className="module-item">
              <div className="module-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <h3>Data Analytics for Teams</h3>
              <p>Practical data skills for non-technical professionals to drive informed decisions.</p>
            </div>
            <div className="module-item">
              <div className="module-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
              </div>
              <h3>Cybersecurity Essentials</h3>
              <p>Protecting organizational assets and data in the digital age.</p>
            </div>
            <div className="module-item">
              <div className="module-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L7 18.5l3.5 3.5L13 18.5l3.5 3.5L19 18.5l2.22 2.22 1.44-1.44L19 14.78c0-3.39-2.61-6.78-2-8.78z"/>
                </svg>
              </div>
              <h3>Climate Risk Analysis</h3>
              <p>Understanding and managing climate-related business risks and opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="programs-list section">
        <div className="container">
          <div className="section-header">
            <h2>Available Programs</h2>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          ) : programs.length > 0 ? (
            <div className="programs-grid">
              {programs.map(program => (
                <ProgramCard key={program._id} program={program} />
              ))}
            </div>
          ) : (
            <div className="no-programs">
              <p>Corporate training programs available upon request. Contact us for custom solutions.</p>
            </div>
          )}
        </div>
      </section>

      {/* Case Studies */}
      <section className="case-studies section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Success Stories</h2>
            <p className="section-subtitle">Real results from our corporate partners.</p>
          </div>

          <div className="case-studies-grid">
            <div className="case-study-card">
              <div className="case-study-metric">85%</div>
              <h4>Digital Literacy Improvement</h4>
              <p>Teachers at Greensprings School showed 85% improvement in digital tool proficiency after our training program.</p>
              <span className="case-study-client">Greensprings School, Lagos</span>
            </div>
            <div className="case-study-card">
              <div className="case-study-metric">40%</div>
              <h4>Productivity Increase</h4>
              <p>TechCorp Nigeria reported 40% increase in team productivity following our AI literacy program.</p>
              <span className="case-study-client">TechCorp Nigeria</span>
            </div>
            <div className="case-study-card">
              <div className="case-study-metric">100%</div>
              <h4>Participant Satisfaction</h4>
              <p>All participants rated our cybersecurity training as "highly valuable" for their professional development.</p>
              <span className="case-study-client">Multiple Clients</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="programs-cta section">
        <div className="container">
          <div className="cta-box">
            <h2>Request a Corporate Proposal</h2>
            <p>Let's discuss how we can help transform your team's capabilities.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary btn-lg">Request Proposal</Link>
              <a href="#" className="btn btn-outline btn-lg">Download Brochure</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CorporateTraining;
