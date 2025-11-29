import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', role: 'student', phone: '', country: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join Pristine Education today</p>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>I am a</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="instructor">Instructor</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password *</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" />
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
