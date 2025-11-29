import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProgramCard from '../components/UI/ProgramCard';
import { programService } from '../services/api';
import './Programs.css';

const ClimatePrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await programService.getByCategory('climate');
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
      <section className="page-hero climate-hero">
        <div className="container">
          <div className="page-hero-content">
            <span className="hero-label">Climate Action</span>
            <h1>Technology for a Sustainable Future</h1>
            <p>Combine cutting-edge technology skills with environmental action. Build solutions that address climate change.</p>
          </div>
        </div>
      </section>

      <section className="climate-focus section">
        <div className="container">
          <div className="section-header">
            <h2>Our Climate Focus Areas</h2>
          </div>
          <div className="focus-grid">
            <div className="focus-card">
              <h3>Climate Data Analysis</h3>
              <p>Learn to analyze environmental datasets and derive actionable insights.</p>
            </div>
            <div className="focus-card">
              <h3>Sustainable Tech Solutions</h3>
              <p>Build IoT systems for environmental monitoring and smart resource management.</p>
            </div>
            <div className="focus-card">
              <h3>Green Innovation</h3>
              <p>Design products and services aligned with circular economy principles.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="programs-list section section-alt">
        <div className="container">
          <div className="section-header"><h2>Climate Programs</h2></div>
          {loading ? (
            <div className="loading-grid">{[1,2,3].map(i => <div key={i} className="skeleton-card"></div>)}</div>
          ) : programs.length > 0 ? (
            <div className="programs-grid">{programs.map(p => <ProgramCard key={p._id} program={p} />)}</div>
          ) : (
            <div className="no-programs"><p>Climate programs coming soon.</p></div>
          )}
        </div>
      </section>

      <section className="programs-cta section">
        <div className="container">
          <div className="cta-box">
            <h2>Join the Climate Tech Movement</h2>
            <p>Be part of the solution. Learn skills that make a difference.</p>
            <div className="cta-buttons">
              <Link to="/admissions" className="btn btn-primary btn-lg">Enroll Now</Link>
              <Link to="/contact" className="btn btn-outline btn-lg">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClimatePrograms;
