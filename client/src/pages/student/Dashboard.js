import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/api';
import './Student.css';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await studentService.getDashboard();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="loading-screen"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="student-layout">
      <aside className="student-sidebar">
        <div className="sidebar-header">
          <Link to="/" className="logo">
            <span className="logo-text">Pristine</span>
            <span className="logo-accent">Edu</span>
          </Link>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link active">Dashboard</Link>
          <Link to="/dashboard/courses" className="nav-link">My Courses</Link>
          <Link to="/" className="nav-link">Browse Programs</Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
            <span>{user?.firstName} {user?.lastName}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
        </div>
      </aside>

      <main className="student-main">
        <header className="student-header">
          <h1>Welcome back, {user?.firstName}!</h1>
        </header>

        <div className="student-content">
          {/* Stats */}
          <div className="stats-row">
            <div className="stat-card">
              <h3>{data?.stats?.activePrograms || 0}</h3>
              <p>Active Courses</p>
            </div>
            <div className="stat-card">
              <h3>{data?.stats?.completedPrograms || 0}</h3>
              <p>Completed</p>
            </div>
            <div className="stat-card">
              <h3>{data?.stats?.pendingEnrollments || 0}</h3>
              <p>Pending</p>
            </div>
          </div>

          {/* Pending Enrollments */}
          {data?.pendingEnrollments?.length > 0 && (
            <div className="dashboard-section">
              <h2>Pending Enrollments</h2>
              <p className="section-note">Your enrollment is being reviewed by admin. You'll be notified once confirmed.</p>
              <div className="pending-list">
                {data.pendingEnrollments.map(e => (
                  <div key={e._id} className="pending-card">
                    <h4>{e.program?.title}</h4>
                    <span className="status-badge pending">Pending Approval</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Courses */}
          <div className="dashboard-section">
            <h2>Continue Learning</h2>
            {data?.enrollments?.length > 0 ? (
              <div className="courses-grid">
                {data.enrollments.map(({ enrollment, progress, totalLessons }) => (
                  <div key={enrollment._id} className="course-card">
                    <div className="course-category">{enrollment.program?.category}</div>
                    <h3>{enrollment.program?.title}</h3>
                    <p>{enrollment.program?.shortDescription}</p>
                    
                    <div className="progress-section">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${progress?.overallProgress || 0}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{progress?.overallProgress || 0}% Complete</span>
                    </div>

                    <div className="course-meta">
                      <span>{progress?.completedLessons?.length || 0} / {totalLessons} lessons</span>
                      <span>{enrollment.program?.duration}</span>
                    </div>

                    <Link 
                      to={`/learn/${enrollment.program?._id}`} 
                      className="btn btn-primary btn-block"
                    >
                      {progress?.overallProgress > 0 ? 'Continue Learning' : 'Start Learning'}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>You don't have any active courses yet.</p>
                <Link to="/admissions" className="btn btn-primary">Browse Programs</Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
