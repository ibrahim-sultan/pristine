import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { studentService, lessonService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import VideoPlayer from '../../components/student/VideoPlayer';
import './Learn.css';

const Learn = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchProgram();
  }, [programId]);

  const fetchProgram = async () => {
    try {
      const response = await studentService.getProgram(programId);
      setData(response.data);
      
      // Expand all modules by default
      const expanded = {};
      response.data.modules?.forEach((_, i) => expanded[i] = true);
      setExpandedModules(expanded);
      
      // Set initial lesson
      if (response.data.modules?.length > 0) {
        const firstModule = response.data.modules[0];
        if (firstModule.lessons?.length > 0) {
          const progressLesson = response.data.progress?.currentLesson;
          const allLessons = response.data.modules.flatMap(m => m.lessons);
          const resumeLesson = allLessons.find(l => l._id === progressLesson) || firstModule.lessons[0];
          setCurrentLesson(resumeLesson);
        }
      }
    } catch (error) {
      console.error('Error fetching program:', error);
      if (error.response?.status === 403) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
    setActiveTab('overview');
  };

  const handleLessonComplete = async (lessonId, watchTime = 0) => {
    try {
      await lessonService.complete(lessonId, { watchTime });
      fetchProgram();
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  const toggleModule = (index) => {
    setExpandedModules(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const isLessonCompleted = (lessonId) => {
    return data?.progress?.completedLessons?.some(cl => cl.lesson === lessonId);
  };

  const getModuleProgress = (moduleIndex) => {
    const moduleLessons = data?.modules?.[moduleIndex]?.lessons || [];
    if (moduleLessons.length === 0) return 0;
    const completed = moduleLessons.filter(l => isLessonCompleted(l._id)).length;
    return Math.round((completed / moduleLessons.length) * 100);
  };

  const getNextLesson = () => {
    if (!currentLesson || !data?.modules) return null;
    const allLessons = data.modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l._id === currentLesson._id);
    return allLessons[currentIndex + 1] || null;
  };

  const getPrevLesson = () => {
    if (!currentLesson || !data?.modules) return null;
    const allLessons = data.modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l._id === currentLesson._id);
    return allLessons[currentIndex - 1] || null;
  };

  const getTotalLessons = () => {
    return data?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  };

  const getCompletedLessons = () => {
    return data?.progress?.completedLessons?.length || 0;
  };

  if (loading) {
    return <div className="learn-loading"><div className="spinner"></div><p>Loading course...</p></div>;
  }

  if (!data) {
    return <div className="learn-error"><p>Program not found or access denied.</p><Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link></div>;
  }

  return (
    <div className={`learn-layout ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      {/* Top Navigation Bar */}
      <header className="learn-topbar">
        <div className="topbar-left">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span></span><span></span><span></span>
          </button>
          <Link to="/dashboard" className="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div className="course-title-bar">
            <h1>{data.program?.title}</h1>
          </div>
        </div>
        <div className="topbar-right">
          <div className="progress-indicator">
            <div className="progress-circle">
              <svg viewBox="0 0 36 36">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <path className="circle-progress" strokeDasharray={`${data.progress?.overallProgress || 0}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              </svg>
              <span>{data.progress?.overallProgress || 0}%</span>
            </div>
            <span className="progress-text">{getCompletedLessons()} of {getTotalLessons()} complete</span>
          </div>
        </div>
      </header>

      <div className="learn-body">
        {/* Course Sidebar */}
        <aside className={`course-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2>Course content</h2>
            <span className="lesson-count">{getTotalLessons()} lessons</span>
          </div>

          <div className="modules-list">
            {data.modules?.map((module, mi) => (
              <div key={mi} className={`module-item ${expandedModules[mi] ? 'expanded' : ''}`}>
                <button className="module-header" onClick={() => toggleModule(mi)}>
                  <div className="module-info">
                    <span className="module-number">Section {mi + 1}</span>
                    <h3>{module.moduleInfo?.title || `Module ${mi + 1}`}</h3>
                    <span className="module-meta">
                      {module.lessons?.length || 0} lessons • {getModuleProgress(mi)}% done
                    </span>
                  </div>
                  <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                
                {expandedModules[mi] && (
                  <ul className="lessons-list">
                    {module.lessons?.map((lesson) => (
                      <li 
                        key={lesson._id}
                        className={`lesson-item ${currentLesson?._id === lesson._id ? 'active' : ''} ${isLessonCompleted(lesson._id) ? 'completed' : ''}`}
                        onClick={() => handleLessonSelect(lesson)}
                      >
                        <div className="lesson-checkbox">
                          {isLessonCompleted(lesson._id) ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                          ) : (
                            <span className="checkbox-empty"></span>
                          )}
                        </div>
                        <div className="lesson-info">
                          <span className="lesson-title">{lesson.title}</span>
                          <span className="lesson-meta">
                            {lesson.type === 'video' && <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}
                            {lesson.type === 'article' && <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>}
                            {lesson.type === 'quiz' && <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>}
                            <span>{lesson.duration}min</span>
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="learn-main">
          {currentLesson ? (
            <>
              {/* Video/Content Area */}
              <div className="content-area">
                {currentLesson.type === 'video' && (
                  <div className="video-container">
                    <VideoPlayer 
                      videoUrl={currentLesson.content?.videoUrl}
                      onComplete={() => handleLessonComplete(currentLesson._id)}
                    />
                  </div>
                )}

                {currentLesson.type === 'article' && (
                  <div className="article-container">
                    <div className="article-content" dangerouslySetInnerHTML={{ __html: currentLesson.content?.articleContent?.replace(/\n/g, '<br>') }} />
                  </div>
                )}

                {currentLesson.type === 'resource' && (
                  <div className="resource-container">
                    <div className="resource-icon">📁</div>
                    <h2>{currentLesson.title}</h2>
                    <p>{currentLesson.description}</p>
                    <a href={currentLesson.content?.resourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                      Download Resource
                    </a>
                  </div>
                )}
              </div>

              {/* Lesson Info Tabs */}
              <div className="lesson-tabs-container">
                <div className="lesson-tabs">
                  <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
                  <button className={`tab ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>Notes</button>
                  <button className={`tab ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>Resources</button>
                </div>

                <div className="tab-content">
                  {activeTab === 'overview' && (
                    <div className="tab-pane overview-pane">
                      <div className="lesson-header-info">
                        <h2>{currentLesson.title}</h2>
                        <div className="lesson-actions">
                          {!isLessonCompleted(currentLesson._id) && (
                            <button className="btn btn-primary" onClick={() => handleLessonComplete(currentLesson._id)}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                              Mark as complete
                            </button>
                          )}
                          {isLessonCompleted(currentLesson._id) && (
                            <span className="completed-badge">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {currentLesson.description && (
                        <div className="lesson-description">
                          <h3>About this lesson</h3>
                          <p>{currentLesson.description}</p>
                        </div>
                      )}

                      <div className="lesson-navigation">
                        {getPrevLesson() && (
                          <button className="nav-btn prev" onClick={() => handleLessonSelect(getPrevLesson())}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                            <div>
                              <span>Previous</span>
                              <strong>{getPrevLesson().title}</strong>
                            </div>
                          </button>
                        )}
                        {getNextLesson() && (
                          <button className="nav-btn next" onClick={() => handleLessonSelect(getNextLesson())}>
                            <div>
                              <span>Next</span>
                              <strong>{getNextLesson().title}</strong>
                            </div>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div className="tab-pane notes-pane">
                      <h3>Your Notes</h3>
                      <p className="notes-hint">Take notes while watching. Your notes are saved automatically.</p>
                      <textarea 
                        className="notes-textarea"
                        placeholder="Start typing your notes here..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  )}

                  {activeTab === 'resources' && (
                    <div className="tab-pane resources-pane">
                      <h3>Lesson Resources</h3>
                      {currentLesson.content?.resourceUrl ? (
                        <div className="resource-item">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
                          <span>Downloadable Resource</span>
                          <a href={currentLesson.content.resourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">Download</a>
                        </div>
                      ) : (
                        <p className="no-resources">No resources available for this lesson.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="no-lesson">
              <div className="no-lesson-icon">📚</div>
              <h2>Select a lesson to begin</h2>
              <p>Choose a lesson from the course content on the left to start learning.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Learn;
