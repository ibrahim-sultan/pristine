import React, { useState, useEffect } from 'react';
import { enrollmentService } from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './Admin.css';

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await enrollmentService.getAll();
      setEnrollments(response.data.enrollments || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await enrollmentService.updateStatus(id, { status });
      fetchEnrollments();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteEnrollment = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this enrollment? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await enrollmentService.delete(id);
      setEnrollments(prev => prev.filter(e => e._id !== id));
      if (selectedEnrollment?._id === id) {
        setSelectedEnrollment(null);
      }
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      alert('Failed to delete enrollment');
    }
  };

  const filteredEnrollments = enrollments.filter(e => {
    const statusMatch = filter === 'all' || e.status === filter;
    const paymentMatch = paymentFilter === 'all' || e.paymentStatus === paymentFilter;
    return statusMatch && paymentMatch;
  });

  const paidCount = enrollments.filter(e => e.paymentStatus === 'paid').length;
  const pendingPaymentCount = enrollments.filter(e => e.paymentStatus === 'pending' || !e.paymentStatus).length;

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount || 0);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active="enrollments" />

      <main className="admin-main">
        <header className="admin-header">
          <h1>Enrollments</h1>
          <div className="header-stats">
            <div className="stat-pill paid">
              <span className="stat-icon">✓</span>
              <span>{paidCount} Paid</span>
            </div>
            <div className="stat-pill pending">
              <span className="stat-icon">⏳</span>
              <span>{pendingPaymentCount} Awaiting Payment</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {/* Filters */}
          <div className="filters-bar">
            <div className="filter-group">
              <label>Status:</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Payment:</label>
              <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          {loading ? <div className="loading-spinner"></div> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Program</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.map(e => (
                  <tr key={e._id} className={e.paymentStatus === 'paid' ? 'paid-row' : ''}>
                    <td>
                      <div className="student-cell">
                        <strong>{e.studentInfo?.firstName} {e.studentInfo?.lastName}</strong>
                        <span className="email-small">{e.studentInfo?.email}</span>
                      </div>
                    </td>
                    <td>{e.program?.title}</td>
                    <td><span className={`status-badge ${e.status}`}>{e.status}</span></td>
                    <td>
                      <span className={`payment-badge ${e.paymentStatus || 'pending'}`}>
                        {e.paymentStatus === 'paid' ? '✓ Paid' : e.paymentStatus || 'Pending'}
                      </span>
                      {e.paymentDetails?.provider && (
                        <span className="provider-badge">{e.paymentDetails.provider}</span>
                      )}
                    </td>
                    <td>
                      {e.paymentDetails?.amount ? (
                        <strong>{formatCurrency(e.paymentDetails.amount, e.paymentDetails.currency)}</strong>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <div className="date-cell">
                        <span>{new Date(e.createdAt).toLocaleDateString()}</span>
                        {e.paymentDetails?.paidAt && (
                          <span className="paid-date">Paid: {new Date(e.paymentDetails.paidAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <select value={e.status} onChange={(ev) => updateStatus(e._id, ev.target.value)} className="status-select">
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={() => setSelectedEnrollment(e)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteEnrollment(e._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Enrollment Details Modal */}
      {selectedEnrollment && (
        <div className="modal-overlay" onClick={() => setSelectedEnrollment(null)}>
          <div className="modal-content enrollment-details" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Enrollment Details</h2>
              <button className="close-btn" onClick={() => setSelectedEnrollment(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Student Information</h3>
                <div className="detail-grid">
                  <div><label>Name:</label><span>{selectedEnrollment.studentInfo?.firstName} {selectedEnrollment.studentInfo?.lastName}</span></div>
                  <div><label>Email:</label><span>{selectedEnrollment.studentInfo?.email}</span></div>
                  <div><label>Phone:</label><span>{selectedEnrollment.studentInfo?.phone || '-'}</span></div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Program</h3>
                <div className="detail-grid">
                  <div><label>Title:</label><span>{selectedEnrollment.program?.title}</span></div>
                  <div><label>Status:</label><span className={`status-badge ${selectedEnrollment.status}`}>{selectedEnrollment.status}</span></div>
                  <div><label>Enrolled:</label><span>{new Date(selectedEnrollment.createdAt).toLocaleString()}</span></div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Payment Information</h3>
                {selectedEnrollment.paymentStatus === 'paid' ? (
                  <div className="payment-success-box">
                    <span className="payment-check">✓</span>
                    <div>
                      <strong>Payment Confirmed</strong>
                      <p>This student has successfully paid for the program.</p>
                    </div>
                  </div>
                ) : (
                  <div className="payment-pending-box">
                    <span className="payment-icon">⏳</span>
                    <div>
                      <strong>Awaiting Payment</strong>
                      <p>Payment has not been received yet.</p>
                    </div>
                  </div>
                )}
                <div className="detail-grid">
                  <div><label>Status:</label><span className={`payment-badge ${selectedEnrollment.paymentStatus || 'pending'}`}>{selectedEnrollment.paymentStatus || 'Pending'}</span></div>
                  <div><label>Provider:</label><span>{selectedEnrollment.paymentDetails?.provider || '-'}</span></div>
                  <div><label>Amount:</label><span>{selectedEnrollment.paymentDetails?.amount ? formatCurrency(selectedEnrollment.paymentDetails.amount, selectedEnrollment.paymentDetails.currency) : '-'}</span></div>
                  <div><label>Reference:</label><span className="ref-code">{selectedEnrollment.paymentDetails?.reference || '-'}</span></div>
                  <div><label>Paid At:</label><span>{selectedEnrollment.paymentDetails?.paidAt ? new Date(selectedEnrollment.paymentDetails.paidAt).toLocaleString() : '-'}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enrollments;
