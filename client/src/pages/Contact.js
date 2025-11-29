import React, { useState } from 'react';
import { contactService } from '../services/api';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', organization: '',
    inquiryType: 'general', subject: '', message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await contactService.submit(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', organization: '', inquiryType: 'general', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <h1>Connect With Us</h1>
            <p>Need help choosing a program? Our team is ready to guide you.</p>
          </div>
        </div>
      </section>

      <section className="contact-section section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>We'd love to hear from you. Reach out through any of the channels below.</p>
              <div className="contact-methods">
                <div className="contact-method">
                  <h4>Email</h4>
                  <p>info@pristineeducation.com</p>
                </div>
                <div className="contact-method">
                  <h4>Phone</h4>
                  <p>+234 800 123 4567</p>
                </div>
                <div className="contact-method">
                  <h4>Locations</h4>
                  <p>Lagos, Nigeria | Riyadh, Saudi Arabia | London, UK</p>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              {success ? (
                <div className="success-message">
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll get back to you within 24-48 hours.</p>
                  <button className="btn btn-primary" onClick={() => setSuccess(false)}>Send Another Message</button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  {error && <div className="form-error">{error}</div>}
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Organization</label>
                      <input type="text" name="organization" value={formData.organization} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Inquiry Type</label>
                    <select name="inquiryType" value={formData.inquiryType} onChange={handleChange}>
                      <option value="general">General Inquiry</option>
                      <option value="bootcamp">Bootcamp Information</option>
                      <option value="olympiad">Olympiad Prep</option>
                      <option value="corporate">Corporate Training</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Subject *</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Message *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows="5" required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
