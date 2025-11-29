import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { programService, paymentService } from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState('paystack');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/checkout/${programId}`);
      return;
    }
    fetchData();
  }, [programId, isAuthenticated]);

  const fetchData = async () => {
    try {
      const [programRes, configRes] = await Promise.all([
        programService.getById(programId),
        paymentService.getConfig()
      ]);
      setProgram(programRes.data.program || programRes.data);
      setPaymentConfig(configRes.data);
      
      // Set default provider based on availability
      if (configRes.data.paystack?.enabled) {
        setSelectedProvider('paystack');
      } else if (configRes.data.stripe?.enabled) {
        setSelectedProvider('stripe');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load program details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError('');
    
    try {
      const response = await paymentService.initialize(programId, selectedProvider);
      
      if (response.data.provider === 'stripe' && response.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } else if (response.data.provider === 'paystack' && response.data.authorization_url) {
        // Redirect to Paystack
        window.location.href = response.data.authorization_url;
      } else {
        setError('Payment initialization failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.message || 'Payment initialization failed. Please try again.');
      setProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="checkout-loading">
        <div className="loading-spinner"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="checkout-error">
        <h2>Program not found</h2>
        <Link to="/programs" className="btn btn-primary">Browse Programs</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-main">
          <div className="checkout-header">
            <Link to={`/programs/${programId}`} className="back-link">
              ← Back to Program
            </Link>
            <h1>Complete Your Enrollment</h1>
          </div>

          {error && <div className="checkout-error-msg">{error}</div>}

          {/* User Info */}
          <div className="checkout-section">
            <h2>Your Information</h2>
            <div className="user-info-card">
              <div className="info-row">
                <span className="label">Name:</span>
                <span>{user?.firstName} {user?.lastName}</span>
              </div>
              <div className="info-row">
                <span className="label">Email:</span>
                <span>{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-section">
            <h2>Payment Method</h2>
            <div className="payment-methods">
              {paymentConfig?.paystack?.enabled && (
                <label className={`payment-option ${selectedProvider === 'paystack' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="provider"
                    value="paystack"
                    checked={selectedProvider === 'paystack'}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                  />
                  <div className="payment-option-content">
                    <div className="payment-logo paystack">
                      <svg viewBox="0 0 100 24" fill="currentColor">
                        <path d="M5.1 8.1h6.6v2.4H5.1v5.4h7.5v2.4H2.4V5.7h10.2v2.4H5.1v0zm11.7 0v10.2h-2.7V5.7h2.7v2.4zm3.6-2.4h2.7v12.6h-2.7V5.7zm7.2 0h2.7l4.5 8.1V5.7h2.7v12.6h-2.7l-4.5-8.1v8.1h-2.7V5.7z"/>
                      </svg>
                    </div>
                    <div className="payment-info">
                      <strong>Paystack</strong>
                      <span>Pay with Card, Bank Transfer, USSD</span>
                    </div>
                  </div>
                </label>
              )}

              {paymentConfig?.stripe?.enabled && (
                <label className={`payment-option ${selectedProvider === 'stripe' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="provider"
                    value="stripe"
                    checked={selectedProvider === 'stripe'}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                  />
                  <div className="payment-option-content">
                    <div className="payment-logo stripe">
                      <svg viewBox="0 0 60 25" fill="currentColor">
                        <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a10.6 10.6 0 0 1-4.56.95c-4.01 0-6.83-2.5-6.83-7.14 0-4.07 2.5-7.14 6.32-7.14 3.78 0 5.92 3.07 5.92 7.14 0 .39-.02.86-.04 1.27zm-5.92-5.62c-1.15 0-2 .84-2.18 2.43h4.27c-.07-1.59-.84-2.43-2.1-2.43z"/>
                      </svg>
                    </div>
                    <div className="payment-info">
                      <strong>Stripe</strong>
                      <span>Pay with Credit/Debit Card</span>
                    </div>
                  </div>
                </label>
              )}

              {!paymentConfig?.paystack?.enabled && !paymentConfig?.stripe?.enabled && (
                <div className="no-payment-methods">
                  <p>No payment methods are currently available. Please contact support.</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Security Notice */}
          <div className="security-notice">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-sidebar">
          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="program-summary">
              {program.thumbnail && (
                <img src={program.thumbnail} alt={program.title} className="program-thumb" />
              )}
              <div className="program-details">
                <h3>{program.title}</h3>
                <span className="program-category">{program.category}</span>
              </div>
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span>Duration</span>
                <span>{program.duration}</span>
              </div>
              <div className="summary-row">
                <span>Level</span>
                <span>{program.level}</span>
              </div>
              <div className="summary-row">
                <span>Format</span>
                <span>{program.format}</span>
              </div>
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Program Price</span>
                <span>{formatPrice(program.price)}</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>{formatPrice(program.price)}</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg btn-block pay-btn"
              onClick={handlePayment}
              disabled={processing || (!paymentConfig?.paystack?.enabled && !paymentConfig?.stripe?.enabled)}
            >
              {processing ? (
                <>
                  <span className="spinner-small"></span>
                  Processing...
                </>
              ) : (
                `Pay ${formatPrice(program.price)}`
              )}
            </button>

            <p className="terms-notice">
              By completing this purchase, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
