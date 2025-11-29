import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ active }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', path: '/admin' },
    { key: 'programs', label: 'Programs', path: '/admin/programs' },
    { key: 'enrollments', label: 'Enrollments', path: '/admin/enrollments' },
    { key: 'users', label: 'Users', path: '/admin/users' },
    { key: 'contacts', label: 'Contacts', path: '/admin/contacts' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Pristine Admin</h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <Link 
            key={item.key}
            to={item.path} 
            className={`nav-link ${active === item.key ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
        <div className="nav-divider"></div>
        <Link to="/" className="nav-link">View Site</Link>
      </nav>
      <div className="sidebar-footer">
        <span>{user?.firstName} {user?.lastName}</span>
        <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
