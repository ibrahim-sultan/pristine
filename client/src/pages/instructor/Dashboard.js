import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { instructorService } from '../../services/api';
import './Instructor.css';

const InstructorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await instructorService.getDashboard();
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
    <div className="instructor-layout">
      <aside className="instructor-sidebar">
        <div className="sidebar-header">
          <Link to="/" className="logo">
            <span className="logo-text">Pristine</span>
            <span className="logo-accent">Edu</span>
          </Link>
        </div>
        <nav className="sidebar-nav">
          <Link to="/instructor" className="nav-link active">Dashboard</Link>
          <Link to="/instructor/courses" className="nav-link">My Courses</Link>
          <Link to="/" className="nav-link">View Site</Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
            <div>
              <span className="user-name">{user?.firstName} {user?.lastName}</span>
              <span className="user-role">Instructor</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
        </div>
      </aside>

      <main className="instructor-main">
        <header className="instructor-header">
          <h1>Welcome back, {data?.instructor?.name?.split(' ')[0]}!</h1>
          <p>Manage your courses and track student progress</p>
        </header>

        <div className="instructor-content">
          {/* Stats */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon courses">📚</div>
              <div className="stat-info">
                <h3>{data?.stats?.totalPrograms || 0}</h3>
                <p>Assigned Courses</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon lessons">🎬</div>
              <div className="stat-info">
                <h3>{data?.stats?.totalLessons || 0}</h3>
                <p>Total Lessons</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon students">👥</div>
              <div className="stat-info">
                <h3>{data?.stats?.totalStudents || 0}</h3>
                <p>Active Students</p>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Your Courses</h2>
            </div>
            
            {data?.programs?.length > 0 ? (
              <div className="courses-grid">
                {data.programs.map(program => (
                  <div key={program._id} className="course-card">
                    <div className="course-thumbnail">
                      {program.thumbnail ? (
                        <img src={program.thumbnail} alt={program.title} />
                      ) : (
                        <div className="thumbnail-placeholder">{program.title[0]}</div>
                      )}
                    </div>
                    <div className="course-info">
                      <span className="course-category">{program.category}</span>
                      <h3>{program.title}</h3>
                      <p>{program.duration}</p>
                    </div>
                    <div className="course-actions">
                      <Link to={`/instructor/courses/${program._id}`} className="btn btn-primary btn-block">
                        Manage Course
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No courses assigned yet</h3>
                <p>Contact the administrator to get courses assigned to your account.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;
