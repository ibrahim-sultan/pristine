import React, { useState } from 'react';
import { enrollmentService } from '../../services/api';
import './EnrollmentForm.css';

const EnrollmentForm = ({ program, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    organization: '',
    country: '',
    enrollmentType: 'individual',
    numberOfParticipants: 1,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isMinor = program?.ageGroup?.max <= 18;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await enrollmentService.create({
        programId: program._id,
        studentInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          age: formData.age ? parseInt(formData.age) : undefined,
          parentName: formData.parentName,
          parentEmail: formData.parentEmail,
          parentPhone: formData.parentPhone,
          organization: formData.organization,
          country: formData.country
        },
        enrollmentType: formData.enrollmentType,
        numberOfParticipants: parseInt(formData.numberOfParticipants),
        notes: formData.notes
      });

      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit enrollment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="enrollment-form enrollment-success">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" width="64" height="64" fill="#0FA776">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h3>Enrollment Submitted!</h3>
        <p>Thank you for enrolling in {program.title}. Check your email for confirmation and next steps.</p>
        <button className="btn btn-primary" onClick={onClose}>Close</button>
      </div>
    );
  }

  return (
    <form className="enrollment-form" onSubmit={handleSubmit}>
      <h3>Enroll in {program?.title}</h3>
      
      {error && <div className="form-error">{error}</div>}

      <div className="form-section">
        <h4>Student Information</h4>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        {isMinor && (
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min={program?.ageGroup?.min}
              max={program?.ageGroup?.max}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="">Select Country</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {isMinor && (
        <div className="form-section">
          <h4>Parent/Guardian Information</h4>
          <div className="form-group">
            <label htmlFor="parentName">Parent/Guardian Name</label>
            <input
              type="text"
              id="parentName"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="parentEmail">Parent/Guardian Email</label>
              <input
                type="email"
                id="parentEmail"
                name="parentEmail"
                value={formData.parentEmail}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="parentPhone">Parent/Guardian Phone</label>
              <input
                type="tel"
                id="parentPhone"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      )}

      <div className="form-section">
        <h4>Enrollment Type</h4>
        <div className="form-group">
          <label htmlFor="enrollmentType">Type</label>
          <select
            id="enrollmentType"
            name="enrollmentType"
            value={formData.enrollmentType}
            onChange={handleChange}
          >
            <option value="individual">Individual</option>
            <option value="school">School</option>
            <option value="corporate">Corporate</option>
          </select>
        </div>

        {formData.enrollmentType !== 'individual' && (
          <>
            <div className="form-group">
              <label htmlFor="organization">Organization Name</label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="numberOfParticipants">Number of Participants</label>
              <input
                type="number"
                id="numberOfParticipants"
                name="numberOfParticipants"
                value={formData.numberOfParticipants}
                onChange={handleChange}
                min="1"
              />
            </div>
          </>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="notes">Additional Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Any special requirements or questions?"
        />
      </div>

      <div className="form-footer">
        <div className="enrollment-price">
          <span>Total:</span>
          <strong>${program?.price?.amount * formData.numberOfParticipants} {program?.price?.currency}</strong>
        </div>
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Enrollment'}
        </button>
      </div>
    </form>
  );
};

export default EnrollmentForm;
