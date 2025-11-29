import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paymentService } from '../services/api';
import './Checkout.css';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    const reference = searchParams.get('reference');
    const sessionId = searchParams.get('session_id');
    const programId = searchParams.get('program');

    try {
      if (reference) {
        // Paystack verification
        await paymentService.verifyPaystack(reference, programId);
        setStatus('success');
        setMessage('Your payment was successful! You are now enrolled in the program.');
      } else if (sessionId) {
        // Stripe verification
        await paymentService.verifyStripe(sessionId, programId);
        setStatus('success');
        setMessage('Your payment was successful! You are now enrolled in the program.');
      } else {
        setStatus('error');
        setMessage('Invalid payment reference.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage(error.response?.data?.message || 'Payment verification failed. Please contact support.');
    }
  };

  return (
    <div className="payment-status-page">
      <div className="status-container">
        {status === 'verifying' && (
          <div className="status-content verifying">
            <div className="loading-spinner large"></div>
            <h1>Verifying Payment</h1>
            <p>Please wait while we confirm your payment...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="status-content success">
            <div className="status-icon success">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <h1>Payment Successful!</h1>
            <p>{message}</p>
            <div className="status-actions">
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to My Dashboard
              </Link>
              <Link to="/programs" className="btn btn-outline">
                Browse More Programs
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="status-content error">
            <div className="status-icon error">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <h1>Payment Verification Failed</h1>
            <p>{message}</p>
            <div className="status-actions">
              <Link to="/contact" className="btn btn-primary">
                Contact Support
              </Link>
              <Link to="/programs" className="btn btn-outline">
                Back to Programs
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const programId = searchParams.get('program');

  return (
    <div className="payment-status-page">
      <div className="status-container">
        <div className="status-content cancelled">
          <div className="status-icon cancelled">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
            </svg>
          </div>
          <h1>Payment Cancelled</h1>
          <p>Your payment was cancelled. No charges were made to your account.</p>
          <div className="status-actions">
            {programId && (
              <Link to={`/checkout/${programId}`} className="btn btn-primary btn-lg">
                Try Again
              </Link>
            )}
            <Link to="/programs" className="btn btn-outline">
              Browse Programs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PaymentSuccess, PaymentCancel };
