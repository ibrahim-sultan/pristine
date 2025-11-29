import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './Admin.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await adminService.getDashboard();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar active="dashboard" />

      <main className="admin-main">
        <header className="admin-header">
          <h1>Dashboard</h1>
        </header>

        <div className="admin-content">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : stats && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>{stats.stats?.programs?.total || 0}</h3>
                  <p>Total Programs</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.stats?.enrollments?.total || 0}</h3>
                  <p>Total Enrollments</p>
                </div>
                <div className="stat-card highlight">
                  <h3>{stats.stats?.enrollments?.pending || 0}</h3>
                  <p>Pending Enrollments</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.stats?.contacts?.new || 0}</h3>
                  <p>New Contacts</p>
                </div>
              </div>

              <div className="dashboard-section">
                <h2>Recent Enrollments</h2>
                {stats.recentEnrollments?.length > 0 ? (
                  <table className="admin-table">
                    <thead>
                      <tr><th>Student</th><th>Program</th><th>Status</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {stats.recentEnrollments.map(e => (
                        <tr key={e._id}>
                          <td>{e.studentInfo?.firstName} {e.studentInfo?.lastName}</td>
                          <td>{e.program?.title}</td>
                          <td><span className={`status-badge ${e.status}`}>{e.status}</span></td>
                          <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p>No recent enrollments</p>}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
