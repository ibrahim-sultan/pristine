import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { programService } from '../services/api';
import Modal from '../components/UI/Modal';
import EnrollmentForm from '../components/UI/EnrollmentForm';
import './Admissions.css';

const Admissions = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await programService.getAll();
        setPrograms(response.data.programs || []);
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const handleEnroll = (program) => {
    setSelectedProgram(program);
    setShowEnrollModal(true);
  };

  const groupedPrograms = programs.reduce((acc, prog) => {
    if (!acc[prog.category]) acc[prog.category] = [];
    acc[prog.category].push(prog);
    return acc;
  }, {});

  return (
    <div className="admissions-page">
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <h1>Admissions</h1>
            <p>Start your learning journey with Pristine Education. Choose a program and enroll today.</p>
          </div>
        </div>
      </section>

      <section className="admissions-process section">
        <div className="container">
          <div className="section-header">
            <h2>How to Enroll</h2>
          </div>
          <div className="process-steps">
            <div className="step"><span className="step-num">1</span><h4>Choose Program</h4><p>Browse and select a program</p></div>
            <div className="step"><span className="step-num">2</span><h4>Submit Application</h4><p>Fill in your details</p></div>
            <div className="step"><span className="step-num">3</span><h4>Confirmation</h4><p>Receive enrollment confirmation</p></div>
            <div className="step"><span className="step-num">4</span><h4>Start Learning</h4><p>Begin your program</p></div>
          </div>
        </div>
      </section>

      <section className="programs-catalog section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Available Programs</h2>
          </div>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            Object.entries(groupedPrograms).map(([category, progs]) => (
              <div key={category} className="category-section">
                <h3 className="category-title">{category.charAt(0).toUpperCase() + category.slice(1)} Programs</h3>
                <div className="programs-table">
                  <div className="table-header">
                    <span>Program</span><span>Duration</span><span>Level</span><span>Price</span><span></span>
                  </div>
                  {progs.map(prog => (
                    <div key={prog._id} className="table-row">
                      <span className="prog-name">{prog.title}</span>
                      <span>{prog.duration}</span>
                      <span className="level-badge">{prog.level}</span>
                      <span>${prog.price?.amount}</span>
                      <button className="btn btn-primary btn-sm" onClick={() => handleEnroll(prog)}>Enroll</button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="faq section">
        <div className="container">
          <div className="section-header"><h2>FAQs</h2></div>
          <div className="faq-list">
            <div className="faq-item">
              <h4>What are the prerequisites?</h4>
              <p>Prerequisites vary by program. Beginner programs require no prior experience.</p>
            </div>
            <div className="faq-item">
              <h4>Are scholarships available?</h4>
              <p>Yes, we offer need-based scholarships. Contact us for more information.</p>
            </div>
            <div className="faq-item">
              <h4>What payment methods do you accept?</h4>
              <p>We accept credit/debit cards, bank transfers, and mobile payments.</p>
            </div>
          </div>
        </div>
      </section>

      <Modal isOpen={showEnrollModal} onClose={() => setShowEnrollModal(false)} size="large">
        {selectedProgram && (
          <EnrollmentForm
            program={selectedProgram}
            onClose={() => setShowEnrollModal(false)}
            onSuccess={() => {
              setShowEnrollModal(false);
              navigate(`/checkout/${selectedProgram._id}`);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Admissions;
