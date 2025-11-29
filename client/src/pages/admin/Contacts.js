import React, { useState, useEffect } from 'react';
import { contactService } from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './Admin.css';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await contactService.getAll();
      setContacts(response.data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await contactService.update(id, { status });
      fetchContacts();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active="contacts" />

      <main className="admin-main">
        <header className="admin-header"><h1>Contact Messages</h1></header>
        <div className="admin-content">
          {loading ? <div className="loading-spinner"></div> : (
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Type</th><th>Subject</th><th>Status</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {contacts.map(c => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.inquiryType}</td>
                    <td>{c.subject}</td>
                    <td><span className={`status-badge ${c.status}`}>{c.status}</span></td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select value={c.status} onChange={(e) => updateStatus(c._id, e.target.value)} className="status-select">
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Contacts;
