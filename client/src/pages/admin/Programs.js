import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { programService } from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ProgramForm from '../../components/admin/ProgramForm';
import Modal from '../../components/UI/Modal';
import './Admin.css';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await programService.getAll({ active: 'all' });
      setPrograms(response.data.programs || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProgram(null);
    setShowModal(true);
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await programService.delete(id);
      setPrograms(programs.filter(p => p._id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Failed to delete program');
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingProgram) {
        await programService.update(editingProgram._id, formData);
      } else {
        await programService.create(formData);
      }
      fetchPrograms();
      setShowModal(false);
      setEditingProgram(null);
    } catch (error) {
      console.error('Error saving program:', error);
      alert('Failed to save program');
    }
  };

  const toggleActive = async (program) => {
    try {
      await programService.update(program._id, { isActive: !program.isActive });
      fetchPrograms();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active="programs" />

      <main className="admin-main">
        <header className="admin-header">
          <h1>Programs Management</h1>
          <button className="btn btn-primary" onClick={handleAdd}>+ Add Program</button>
        </header>

        <div className="admin-content">
          {loading ? <div className="loading-spinner"></div> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Level</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map(p => (
                  <tr key={p._id}>
                    <td><strong>{p.title}</strong></td>
                    <td><span className="category-tag">{p.category}</span></td>
                    <td>${p.price?.amount} {p.price?.currency}</td>
                    <td>{p.duration}</td>
                    <td>{p.level}</td>
                    <td>
                      <button 
                        className={`status-toggle ${p.isActive ? 'active' : 'inactive'}`}
                        onClick={() => toggleActive(p)}
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="actions-cell">
                      <button className="btn btn-sm btn-outline" onClick={() => handleEdit(p)}>Edit</button>
                      <button className="btn btn-sm btn-outline" onClick={() => navigate(`/admin/programs/${p._id}/lessons`)}>Lessons</button>
                      <button className="btn btn-sm btn-danger" onClick={() => setDeleteConfirm(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="large">
        <ProgramForm 
          program={editingProgram} 
          onSave={handleSave} 
          onCancel={() => setShowModal(false)} 
        />
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} size="small">
        <div className="confirm-delete">
          <h3>Delete Program?</h3>
          <p>This action cannot be undone. All lessons will also be deleted.</p>
          <div className="confirm-actions">
            <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Programs;
