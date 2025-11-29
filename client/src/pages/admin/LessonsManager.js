import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { programService, lessonService } from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Modal from '../../components/UI/Modal';
import './Admin.css';
import '../../components/admin/AdminForms.css';

const LessonsManager = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    moduleIndex: 0,
    title: '',
    description: '',
    type: 'video',
    content: { videoUrl: '', articleContent: '' },
    duration: 10,
    order: 0,
    isFree: false,
    isPublished: true
  });

  useEffect(() => {
    fetchData();
  }, [programId]);

  const fetchData = async () => {
    try {
      const [progRes, lessonsRes] = await Promise.all([
        programService.getBySlug(programId).catch(() => programService.getAll().then(r => {
          const found = r.data.programs.find(p => p._id === programId);
          return { data: { program: found } };
        })),
        lessonService.getByProgram(programId).catch(() => ({ data: { lessons: [] } }))
      ]);
      setProgram(progRes.data.program);
      setLessons(lessonsRes.data.lessons || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (moduleIndex = 0) => {
    setEditingLesson(null);
    setFormData({
      program: programId,
      moduleIndex,
      title: '',
      description: '',
      type: 'video',
      content: { videoUrl: '', articleContent: '' },
      duration: 10,
      order: lessons.filter(l => l.moduleIndex === moduleIndex).length,
      isFree: false,
      isPublished: true
    });
    setShowModal(true);
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      ...lesson,
      content: lesson.content || { videoUrl: '', articleContent: '' }
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await lessonService.delete(id);
      setLessons(lessons.filter(l => l._id !== id));
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('content.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        content: { ...prev.content, [field]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, program: programId };
      if (editingLesson) {
        await lessonService.update(editingLesson._id, data);
      } else {
        await lessonService.create(data);
      }
      fetchData();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Failed to save lesson');
    }
  };

  // Group lessons by module
  const lessonsByModule = {};
  lessons.forEach(l => {
    if (!lessonsByModule[l.moduleIndex]) lessonsByModule[l.moduleIndex] = [];
    lessonsByModule[l.moduleIndex].push(l);
  });

  return (
    <div className="admin-layout">
      <AdminSidebar active="programs" />

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <button className="btn btn-sm btn-outline" onClick={() => navigate('/admin/programs')}>← Back</button>
            <h1>{program?.title || 'Program'} - Lessons</h1>
          </div>
        </header>

        <div className="admin-content">
          {loading ? <div className="loading-spinner"></div> : (
            <div className="lessons-manager">
              {program?.modules?.map((module, mi) => (
                <div key={mi} className="module-section">
                  <div className="module-section-header">
                    <h3>Module {mi + 1}: {module.title}</h3>
                    <button className="btn btn-sm btn-primary" onClick={() => handleAdd(mi)}>+ Add Lesson</button>
                  </div>
                  
                  {lessonsByModule[mi]?.length > 0 ? (
                    <div className="lessons-list">
                      {lessonsByModule[mi].sort((a, b) => a.order - b.order).map((lesson, li) => (
                        <div key={lesson._id} className="lesson-item">
                          <div className="lesson-info">
                            <span className="lesson-order">{li + 1}</span>
                            <div className="lesson-details">
                              <strong>{lesson.title}</strong>
                              <span className="lesson-meta">
                                <span className={`type-badge ${lesson.type}`}>{lesson.type}</span>
                                <span>{lesson.duration} min</span>
                                {lesson.isFree && <span className="free-badge">Free</span>}
                              </span>
                            </div>
                          </div>
                          <div className="lesson-actions">
                            <button className="btn btn-sm btn-outline" onClick={() => handleEdit(lesson)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(lesson._id)}>Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-lessons">No lessons yet. Add your first lesson.</p>
                  )}
                </div>
              ))}

              {(!program?.modules || program.modules.length === 0) && (
                <div className="empty-state">
                  <p>This program has no modules defined. Add modules in the program editor first, or add lessons to Module 1.</p>
                  <button className="btn btn-primary" onClick={() => handleAdd(0)}>+ Add Lesson to Module 1</button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="large">
        <form className="admin-form lesson-form" onSubmit={handleSubmit}>
          <h2>{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</h2>

          <div className="form-grid">
            <div className="form-group full-width">
              <label>Lesson Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Module</label>
              <select name="moduleIndex" value={formData.moduleIndex} onChange={handleChange}>
                {program?.modules?.map((m, i) => (
                  <option key={i} value={i}>Module {i + 1}: {m.title}</option>
                ))}
                {!program?.modules?.length && <option value={0}>Module 1</option>}
              </select>
            </div>

            <div className="form-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="video">Video</option>
                <option value="article">Article</option>
                <option value="quiz">Quiz</option>
                <option value="assignment">Assignment</option>
                <option value="resource">Resource</option>
              </select>
            </div>

            <div className="form-group">
              <label>Duration (minutes)</label>
              <input type="number" name="duration" value={formData.duration} onChange={handleChange} min="1" />
            </div>

            <div className="form-group">
              <label>Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange} min="0" />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
          </div>

          {formData.type === 'video' && (
            <div className="form-group">
              <label>Video URL (YouTube, Vimeo, or direct link) *</label>
              <input type="url" name="content.videoUrl" value={formData.content.videoUrl} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." />
            </div>
          )}

          {formData.type === 'article' && (
            <div className="form-group">
              <label>Article Content *</label>
              <textarea name="content.articleContent" value={formData.content.articleContent} onChange={handleChange} rows="10" placeholder="Write your article content here..." />
            </div>
          )}

          {formData.type === 'resource' && (
            <div className="form-group">
              <label>Resource URL</label>
              <input type="url" name="content.resourceUrl" value={formData.content.resourceUrl || ''} onChange={handleChange} placeholder="https://..." />
            </div>
          )}

          <div className="form-row checkboxes">
            <label className="checkbox-label">
              <input type="checkbox" name="isFree" checked={formData.isFree} onChange={handleChange} />
              Free Preview (available without enrollment)
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} />
              Published
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingLesson ? 'Update' : 'Create'} Lesson</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LessonsManager;
