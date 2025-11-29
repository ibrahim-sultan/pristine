import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { instructorService } from '../../services/api';
import Modal from '../../components/UI/Modal';
import './Instructor.css';

const CourseManager = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('lessons');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    moduleIndex: 0,
    title: '',
    description: '',
    type: 'video',
    content: { videoUrl: '', articleContent: '', resourceUrl: '' },
    duration: 10,
    order: 0,
    isFree: false,
    isPublished: true
  });

  useEffect(() => {
    fetchCourse();
  }, [programId]);

  const fetchCourse = async () => {
    try {
      const response = await instructorService.getProgram(programId);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
      if (error.response?.status === 403) {
        navigate('/instructor');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = (moduleIndex = 0) => {
    setEditingLesson(null);
    const moduleLessons = data?.lessons?.filter(l => l.moduleIndex === moduleIndex) || [];
    setFormData({
      program: programId,
      moduleIndex,
      title: '',
      description: '',
      type: 'video',
      content: { videoUrl: '', articleContent: '', resourceUrl: '' },
      duration: 10,
      order: moduleLessons.length,
      isFree: false,
      isPublished: true
    });
    setShowModal(true);
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      ...lesson,
      content: lesson.content || { videoUrl: '', articleContent: '', resourceUrl: '' }
    });
    setShowModal(true);
  };

  const handleDeleteLesson = async (id) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await instructorService.deleteLesson(id);
      fetchCourse();
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

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append(type === 'video' ? 'video' : 'resource', file);

    try {
      const response = type === 'video' 
        ? await instructorService.uploadVideo(formDataUpload)
        : await instructorService.uploadResource(formDataUpload);

      const url = response.data.url;
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [type === 'video' ? 'videoUrl' : 'resourceUrl']: url
        }
      }));
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const lessonData = { ...formData, program: programId };
      if (editingLesson) {
        await instructorService.updateLesson(editingLesson._id, lessonData);
      } else {
        await instructorService.createLesson(lessonData);
      }
      fetchCourse();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Failed to save lesson');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  // Group lessons by module
  const lessonsByModule = {};
  data?.lessons?.forEach(l => {
    if (!lessonsByModule[l.moduleIndex]) lessonsByModule[l.moduleIndex] = [];
    lessonsByModule[l.moduleIndex].push(l);
  });

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
          <Link to="/instructor" className="nav-link">Dashboard</Link>
          <Link to="/instructor/courses" className="nav-link active">My Courses</Link>
          <Link to="/" className="nav-link">View Site</Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
            <span>{user?.firstName}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
        </div>
      </aside>

      <main className="instructor-main">
        <header className="instructor-header">
          <div className="header-top">
            <Link to="/instructor/courses" className="back-link">← Back to Courses</Link>
          </div>
          <h1>{data?.program?.title}</h1>
          <div className="course-stats">
            <span>{data?.stats?.totalLessons} lessons</span>
            <span>•</span>
            <span>{data?.stats?.totalStudents} students enrolled</span>
          </div>
        </header>

        <div className="tabs-nav">
          <button className={`tab ${activeTab === 'lessons' ? 'active' : ''}`} onClick={() => setActiveTab('lessons')}>
            Lessons
          </button>
          <button className={`tab ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>
            Students
          </button>
        </div>

        <div className="instructor-content">
          {activeTab === 'lessons' && (
            <div className="lessons-manager">
              {data?.program?.modules?.map((module, mi) => (
                <div key={mi} className="module-section">
                  <div className="module-header">
                    <div>
                      <h3>Module {mi + 1}: {module.title}</h3>
                      <span className="module-meta">{lessonsByModule[mi]?.length || 0} lessons</span>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => handleAddLesson(mi)}>
                      + Add Lesson
                    </button>
                  </div>

                  {lessonsByModule[mi]?.length > 0 ? (
                    <div className="lessons-list">
                      {lessonsByModule[mi].sort((a, b) => a.order - b.order).map((lesson, li) => (
                        <div key={lesson._id} className="lesson-item">
                          <div className="lesson-drag">⋮⋮</div>
                          <div className="lesson-number">{li + 1}</div>
                          <div className="lesson-details">
                            <h4>{lesson.title}</h4>
                            <div className="lesson-meta">
                              <span className={`type-badge ${lesson.type}`}>{lesson.type}</span>
                              <span>{lesson.duration} min</span>
                              {lesson.isFree && <span className="free-badge">Free Preview</span>}
                              {!lesson.isPublished && <span className="draft-badge">Draft</span>}
                            </div>
                          </div>
                          <div className="lesson-actions">
                            <button className="btn btn-sm btn-outline" onClick={() => handleEditLesson(lesson)}>
                              Edit
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteLesson(lesson._id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-lessons">
                      <p>No lessons in this module yet.</p>
                    </div>
                  )}
                </div>
              ))}

              {(!data?.program?.modules || data.program.modules.length === 0) && (
                <div className="module-section">
                  <div className="module-header">
                    <h3>Module 1</h3>
                    <button className="btn btn-primary btn-sm" onClick={() => handleAddLesson(0)}>
                      + Add Lesson
                    </button>
                  </div>
                  {lessonsByModule[0]?.length > 0 ? (
                    <div className="lessons-list">
                      {lessonsByModule[0].map((lesson, li) => (
                        <div key={lesson._id} className="lesson-item">
                          <div className="lesson-number">{li + 1}</div>
                          <div className="lesson-details">
                            <h4>{lesson.title}</h4>
                            <div className="lesson-meta">
                              <span className={`type-badge ${lesson.type}`}>{lesson.type}</span>
                              <span>{lesson.duration} min</span>
                            </div>
                          </div>
                          <div className="lesson-actions">
                            <button className="btn btn-sm btn-outline" onClick={() => handleEditLesson(lesson)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteLesson(lesson._id)}>Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-lessons">
                      <p>Add your first lesson to get started.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'students' && (
            <div className="students-section">
              <h2>Enrolled Students</h2>
              {data?.enrollments?.length > 0 ? (
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Enrolled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.enrollments.map(enrollment => (
                      <tr key={enrollment._id}>
                        <td>{enrollment.studentInfo?.firstName} {enrollment.studentInfo?.lastName}</td>
                        <td>{enrollment.studentInfo?.email}</td>
                        <td><span className={`status-badge ${enrollment.status}`}>{enrollment.status}</span></td>
                        <td>{new Date(enrollment.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <p>No students enrolled yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Lesson Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="large">
        <form className="lesson-form" onSubmit={handleSubmit}>
          <h2>{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</h2>

          <div className="form-group">
            <label>Lesson Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="video">Video</option>
                <option value="article">Article/Text</option>
                <option value="resource">Downloadable Resource</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>
            <div className="form-group">
              <label>Duration (minutes)</label>
              <input type="number" name="duration" value={formData.duration} onChange={handleChange} min="1" />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
          </div>

          {formData.type === 'video' && (
            <div className="form-group">
              <label>Video</label>
              <div className="upload-section">
                <input 
                  type="url" 
                  name="content.videoUrl" 
                  value={formData.content.videoUrl} 
                  onChange={handleChange}
                  placeholder="YouTube URL or paste video link"
                />
                <span className="or-divider">OR</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, 'video')}
                  style={{ display: 'none' }}
                />
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload Video'}
                </button>
              </div>
            </div>
          )}

          {formData.type === 'article' && (
            <div className="form-group">
              <label>Article Content *</label>
              <textarea 
                name="content.articleContent" 
                value={formData.content.articleContent} 
                onChange={handleChange} 
                rows="10"
                placeholder="Write your lesson content here..."
              />
            </div>
          )}

          {formData.type === 'resource' && (
            <div className="form-group">
              <label>Resource File</label>
              <div className="upload-section">
                <input 
                  type="url" 
                  name="content.resourceUrl" 
                  value={formData.content.resourceUrl} 
                  onChange={handleChange}
                  placeholder="Resource URL"
                />
                <span className="or-divider">OR</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
                  onChange={(e) => handleFileUpload(e, 'resource')}
                  style={{ display: 'none' }}
                  id="resource-upload"
                />
                <label htmlFor="resource-upload" className="btn btn-outline" style={{ cursor: 'pointer' }}>
                  {uploading ? 'Uploading...' : 'Upload File'}
                </label>
              </div>
            </div>
          )}

          <div className="form-row checkboxes">
            <label className="checkbox-label">
              <input type="checkbox" name="isFree" checked={formData.isFree} onChange={handleChange} />
              Free Preview (visible without enrollment)
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} />
              Published
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {editingLesson ? 'Update Lesson' : 'Create Lesson'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CourseManager;
