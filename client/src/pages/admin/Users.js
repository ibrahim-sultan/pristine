import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Modal from '../../components/UI/Modal';
import './Admin.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const params = filter !== 'all' ? { role: filter } : {};
      const response = await adminService.getUsers(params);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
      setDeleteConfirm(null);
      setMessage({ type: 'success', text: 'User deleted successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete user' });
      setDeleteConfirm(null);
    }
  };

  const toggleActive = async (user) => {
    try {
      await adminService.updateUser(user._id, { isActive: !user.isActive });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const updateRole = async (user, newRole) => {
    try {
      await adminService.updateUser(user._id, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active="users" />

      <main className="admin-main">
        <header className="admin-header">
          <h1>Users Management</h1>
          <div className="filter-tabs">
            {['all', 'student', 'parent', 'instructor', 'corporate'].map(role => (
              <button 
                key={role}
                className={`filter-tab ${filter === role ? 'active' : ''}`}
                onClick={() => setFilter(role)}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </header>

        <div className="admin-content">
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          {loading ? <div className="loading-spinner"></div> : (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-sm">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                          <strong>{user.firstName} {user.lastName}</strong>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        {user.role === 'admin' ? (
                          <span className="role-badge admin">Admin</span>
                        ) : (
                          <select 
                            value={user.role} 
                            onChange={(e) => updateRole(user, e.target.value)}
                            className="role-select"
                          >
                            <option value="student">Student</option>
                            <option value="parent">Parent</option>
                            <option value="instructor">Instructor</option>
                            <option value="corporate">Corporate</option>
                          </select>
                        )}
                      </td>
                      <td>
                        <button 
                          className={`status-toggle ${user.isActive ? 'active' : 'inactive'}`}
                          onClick={() => toggleActive(user)}
                          disabled={user.role === 'admin'}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        {user.role !== 'admin' && (
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => setDeleteConfirm(user)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {users.length === 0 && (
                <div className="no-data">
                  <p>No users found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} size="small">
        <div className="confirm-delete">
          <h3>Delete User?</h3>
          <p>Are you sure you want to delete <strong>{deleteConfirm?.firstName} {deleteConfirm?.lastName}</strong>?</p>
          <p className="warning-text">This will also delete all their enrollments and progress. This action cannot be undone.</p>
          <div className="confirm-actions">
            <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm._id)}>Delete User</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
