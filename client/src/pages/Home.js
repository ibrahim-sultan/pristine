import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProgramCard from '../components/UI/ProgramCard';
import TestimonialCard from '../components/UI/TestimonialCard';
import { programService, testimonialService } from '../services/api';
import './Home.css';

const Home = () => {
  const [featuredPrograms, setFeaturedPrograms] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programsRes, testimonialsRes] = await Promise.all([
          programService.getFeatured(),
          testimonialService.getAll({ featured: 'true', limit: 5 })
        ]);
        setFeaturedPrograms(programsRes.data.programs || []);
        setTestimonials(testimonialsRes.data.testimonials || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-shape hero-shape-1"></div>
          <div className="hero-shape hero-shape-2"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Empowering the Next Generation of <span className="text-accent">Innovators</span>
            </h1>
            <p className="hero-subtitle">
              Future-focused education in coding, AI, climate technology, and Olympiad excellence. 
              Building skills that matter for tomorrow's world.
            </p>
            <div className="hero-ctas">
              <Link to="/bootcamps" className="btn btn-primary btn-lg">
                Explore Bootcamps
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg">
                Book Consultation
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">5000+</span>
                <span className="stat-label">Students Trained</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Partner Schools</span>
              </div>
              <div className="stat">
                <span className="stat-number">3</span>
                <span className="stat-label">Countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="offerings section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What We Offer</h2>
            <p className="section-subtitle">
              Comprehensive programs designed to build real-world skills and prepare learners for the future.
            </p>
          </div>

          <div className="offerings-grid">
            <div className="offering-card">
              <div className="offering-icon bootcamp-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                </svg>
              </div>
              <h3>Bootcamps</h3>
              <p>Intensive hands-on programs designed to build real-world skills in technology and innovation.</p>
              <Link to="/bootcamps" className="offering-link">
                Explore Bootcamps
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                </svg>
              </Link>
            </div>

            <div className="offering-card">
              <div className="offering-icon olympiad-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
                </svg>
              </div>
              <h3>Olympiad Prep</h3>
              <p>Structured training for global STEM competitions with expert mentorship and proven results.</p>
              <Link to="/olympiad-prep" className="offering-link">
                View Programs
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                </svg>
              </Link>
            </div>

            <div className="offering-card">
              <div className="offering-icon corporate-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M18 15h-2v2h2m0-6h-2v2h2m2 6h-8v-2h2v-2h-2v-2h2v-2h-2V9h8M10 7H8V5h2m0 6H8V9h2m0 6H8v-2h2m0 6H8v-2h2M6 7H4V5h2m0 6H4V9h2m0 6H4v-2h2m0 6H4v-2h2m6-10V3H2v18h20V7H12z"/>
                </svg>
              </div>
              <h3>Corporate Training</h3>
              <p>Tailored digital upskilling solutions for schools, NGOs, and businesses worldwide.</p>
              <Link to="/corporate-training" className="offering-link">
                Learn More
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Pristine Section */}
      <section className="why-pristine section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Pristine Education?</h2>
          </div>

          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h4>Cutting-Edge Curriculum</h4>
              <p>Industry-aligned content updated to reflect the latest technologies and methodologies.</p>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h4>Global-Standard Pedagogy</h4>
              <p>Teaching methods proven effective across Nigeria, Saudi Arabia, and international markets.</p>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h4>Real Projects</h4>
              <p>Build portfolio-worthy projects that demonstrate practical skills to employers and universities.</p>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h4>Competency-Based Learning</h4>
              <p>Progress at your own pace with clear skill outcomes and measurable achievements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="featured-programs section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Programs</h2>
            <p className="section-subtitle">
              Our most popular programs designed to launch your tech career.
            </p>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          ) : (
            <div className="programs-grid">
              {featuredPrograms.slice(0, 6).map(program => (
                <ProgramCard key={program._id} program={program} />
              ))}
            </div>
          )}

          <div className="section-cta">
            <Link to="/bootcamps" className="btn btn-outline btn-lg">
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* International Reach Section */}
      <section className="international section section-alt">
        <div className="container">
          <div className="international-content">
            <div className="international-text">
              <h2>Global Reach, Local Impact</h2>
              <p>
                Pristine Education delivers world-class training across multiple countries, 
                adapting our programs to local contexts while maintaining international standards.
              </p>
              <div className="countries">
                <div className="country">
                  <span className="country-flag">🇳🇬</span>
                  <span className="country-name">Nigeria</span>
                </div>
                <div className="country">
                  <span className="country-flag">🇸🇦</span>
                  <span className="country-name">Saudi Arabia</span>
                </div>
                <div className="country">
                  <span className="country-flag">🇬🇧</span>
                  <span className="country-name">United Kingdom</span>
                </div>
              </div>
            </div>
            <div className="international-image">
              <div className="globe-placeholder">
                <svg viewBox="0 0 24 24" width="200" height="200" fill="#003B73" opacity="0.1">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Community Says</h2>
            <p className="section-subtitle">
              Hear from students, parents, and partners who have experienced Pristine Education.
            </p>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          ) : (
            <div className="testimonials-grid">
              {testimonials.map(testimonial => (
                <TestimonialCard key={testimonial._id} testimonial={testimonial} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Learning Journey?</h2>
            <p>Join thousands of students building future-ready skills with Pristine Education.</p>
            <div className="cta-buttons">
              <Link to="/admissions" className="btn btn-primary btn-lg">
                Enroll Now
              </Link>
              <Link to="/contact" className="btn btn-outline-light btn-lg">
                Request Proposal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
