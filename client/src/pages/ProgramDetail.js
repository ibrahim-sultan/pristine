import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { programService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/UI/Modal';
import EnrollmentForm from '../components/UI/EnrollmentForm';
import './ProgramDetail.css';

const ProgramDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await programService.getBySlug(slug);
        setProgram(response.data.program);
      } catch (error) {
        console.error('Error fetching program:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [slug]);

  if (loading) return <div className="loading-screen"><div className="loading-spinner"></div></div>;
  if (!program) return <div className="container"><h2>Program not found</h2><Link to="/bootcamps">Browse Programs</Link></div>;

  return (
    <div className="program-detail-page">
      <section className="program-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <Link to="/bootcamps">Programs</Link> / <span>{program.title}</span>
          </div>
          <div className="program-hero-content">
            <span className={`category-badge ${program.category}`}>{program.category}</span>
            <h1>{program.title}</h1>
            <p className="program-short-desc">{program.shortDescription}</p>
            <div className="program-meta-bar">
              <span><strong>Duration:</strong> {program.duration}</span>
              <span><strong>Level:</strong> {program.level}</span>
              <span><strong>Mode:</strong> {program.deliveryMode}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="program-content section">
        <div className="container">
          <div className="program-grid">
            <div className="program-main">
              <div className="content-block">
                <h2>About This Program</h2>
                <p>{program.description}</p>
              </div>

              {program.modules?.length > 0 && (
                <div className="content-block">
                  <h2>Curriculum</h2>
                  <div className="modules-list">
                    {program.modules.map((module, idx) => (
                      <div key={idx} className="module-item">
                        <div className="module-header">
                          <span className="module-number">{idx + 1}</span>
                          <div>
                            <h4>{module.title}</h4>
                            <span className="module-duration">{module.duration}</span>
                          </div>
                        </div>
                        <p>{module.description}</p>
                        {module.topics?.length > 0 && (
                          <ul className="topic-list">
                            {module.topics.map((topic, i) => <li key={i}>{topic}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {program.outcomes?.length > 0 && (
                <div className="content-block">
                  <h2>What You'll Learn</h2>
                  <ul className="outcomes-list">
                    {program.outcomes.map((outcome, idx) => <li key={idx}>{outcome}</li>)}
                  </ul>
                </div>
              )}
            </div>

            <div className="program-sidebar">
              <div className="enrollment-card">
                <div className="price-display">
                  <span className="price">${program.price?.amount || program.price}</span>
                  {program.price?.currency && <span className="currency">{program.price?.currency}</span>}
                </div>
                <button 
                  className="btn btn-primary btn-block btn-lg" 
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate(`/checkout/${program._id}`);
                    } else {
                      navigate(`/login?redirect=/checkout/${program._id}`);
                    }
                  }}
                >
                  Enroll & Pay Online
                </button>
                <button 
                  className="btn btn-outline btn-block" 
                  onClick={() => setShowEnrollModal(true)}
                >
                  Request Enrollment
                </button>
                <p className="enrollment-note">Pay online for instant access or request enrollment for other payment options</p>
                <ul className="program-features">
                  {program.features?.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal isOpen={showEnrollModal} onClose={() => setShowEnrollModal(false)} size="large">
        <EnrollmentForm program={program} onClose={() => setShowEnrollModal(false)} />
      </Modal>
    </div>
  );
};

export default ProgramDetail;
