import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProgramCard from '../components/UI/ProgramCard';
import { programService } from '../services/api';
import './Programs.css';

const OlympiadPrep = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await programService.getByCategory('olympiad');
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
      <section className="page-hero olympiad-hero">
        <div className="container">
          <div className="page-hero-content">
            <span className="hero-label">Olympiad Preparation</span>
            <h1>International STEM Olympiad Preparation</h1>
            <p>
              Purpose-built training to help students compete and excel globally. 
              Structured programs for ages 6-19 with expert mentorship.
            </p>
          </div>
        </div>
      </section>

      {/* Age Groups Overview */}
      <section className="age-groups section">
        <div className="container">
          <div className="section-header">
            <h2>Programs by Age Group</h2>
            <p className="section-subtitle">Tailored content for every stage of development.</p>
          </div>

          <div className="age-groups-grid">
            <div className="age-group-card">
              <div className="age-badge">Ages 6-11</div>
              <h3>Climate Awareness Challenge</h3>
              <p>Young learners explore climate concepts through creative coding with Scratch.</p>
              <ul className="age-features">
                <li>Introduction to coding concepts</li>
                <li>Climate awareness activities</li>
                <li>Creative storytelling projects</li>
                <li>Fun, age-appropriate challenges</li>
              </ul>
            </div>

            <div className="age-group-card featured">
              <div className="age-badge">Ages 11-14</div>
              <h3>Climate Action App Challenge</h3>
              <p>Build real apps that promote climate action using Python and web technologies.</p>
              <ul className="age-features">
                <li>Python programming fundamentals</li>
                <li>Web development basics</li>
                <li>App design and creation</li>
                <li>Team collaboration skills</li>
              </ul>
            </div>

            <div className="age-group-card">
              <div className="age-badge">Ages 14-19</div>
              <h3>Climate Data Analysis Challenge</h3>
              <p>Advanced students tackle real climate datasets using data science techniques.</p>
              <ul className="age-features">
                <li>Advanced data analysis</li>
                <li>Statistical modeling</li>
                <li>Research methodology</li>
                <li>Scientific communication</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Program Structure */}
      <section className="program-structure section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Our Training Approach</h2>
          </div>

          <div className="structure-timeline">
            <div className="timeline-item">
              <div className="timeline-number">1</div>
              <div className="timeline-content">
                <h3>Core Concepts</h3>
                <p>Build a strong foundation in programming and climate science fundamentals.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-number">2</div>
              <div className="timeline-content">
                <h3>Worked Examples</h3>
                <p>Learn through guided problem-solving with expert instructors.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-number">3</div>
              <div className="timeline-content">
                <h3>Practice Sessions</h3>
                <p>Regular hands-on practice with real competition-style challenges.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-number">4</div>
              <div className="timeline-content">
                <h3>Mock Tests</h3>
                <p>Simulated competition environments to build confidence and readiness.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-number">5</div>
              <div className="timeline-content">
                <h3>Performance Tracking</h3>
                <p>Detailed progress reports and personalized feedback for improvement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="programs-list section">
        <div className="container">
          <div className="section-header">
            <h2>Available Olympiad Tracks</h2>
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
              <p>Olympiad programs coming soon. Contact us for more information.</p>
            </div>
          )}
        </div>
      </section>

      {/* Past Winners */}
      <section className="winners section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Success Stories</h2>
            <p className="section-subtitle">Our students achieve remarkable results in international competitions.</p>
          </div>

          <div className="winners-grid">
            <div className="winner-card">
              <div className="winner-medal gold">🥇</div>
              <h4>Gold Medal</h4>
              <p className="winner-name">Chidi Okonkwo</p>
              <p className="winner-detail">Climate Data Challenge 2023</p>
            </div>
            <div className="winner-card">
              <div className="winner-medal silver">🥈</div>
              <h4>Silver Medal</h4>
              <p className="winner-name">Fatima Al-Hassan</p>
              <p className="winner-detail">App Innovation Award 2023</p>
            </div>
            <div className="winner-card">
              <div className="winner-medal bronze">🥉</div>
              <h4>Bronze Medal</h4>
              <p className="winner-name">David Adeyemi</p>
              <p className="winner-detail">Junior Coding Challenge 2023</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="programs-cta section">
        <div className="container">
          <div className="cta-box">
            <h2>Join the Olympiad Track</h2>
            <p>Prepare your child for international STEM excellence with our structured programs.</p>
            <div className="cta-buttons">
              <Link to="/admissions" className="btn btn-primary btn-lg">Register Now</Link>
              <Link to="/contact" className="btn btn-outline btn-lg">School Partnerships</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OlympiadPrep;
