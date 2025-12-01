import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear token, don't redirect (let components handle it)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if on a protected route (dashboard, admin, etc.)
      const protectedPaths = ['/dashboard', '/admin', '/instructor', '/learn', '/checkout'];
      const isProtectedPath = protectedPaths.some(path => window.location.pathname.startsWith(path));
      if (isProtectedPath) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API methods
export const programService = {
  getAll: (params) => api.get('/programs', { params }),
  getFeatured: () => api.get('/programs/featured'),
  getByCategory: (category) => api.get(`/programs/category/${category}`),
  getBySlug: (slug) => api.get(`/programs/${slug}`),
  getById: (id) => api.get(`/programs/id/${id}`),
  create: (data) => api.post('/programs', data),
  update: (id, data) => api.put(`/programs/${id}`, data),
  delete: (id) => api.delete(`/programs/${id}`)
};

export const enrollmentService = {
  create: (data) => api.post('/enrollments', data),
  getAll: (params) => api.get('/enrollments', { params }),
  getById: (id) => api.get(`/enrollments/${id}`),
  updateStatus: (id, data) => api.put(`/enrollments/${id}/status`, data),
  delete: (id) => api.delete(`/enrollments/${id}`)
};

export const contactService = {
  submit: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  update: (id, data) => api.put(`/contact/${id}`, data)
};

export const testimonialService = {
  getAll: (params) => api.get('/testimonials', { params }),
  getAllAdmin: () => api.get('/testimonials/all'),
  create: (data) => api.post('/testimonials', data),
  update: (id, data) => api.put(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`)
};

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  exportEmails: () => api.get('/admin/export/emails')
};

export const lessonService = {
  getByProgram: (programId) => api.get(`/lessons/program/${programId}`),
  getById: (id) => api.get(`/lessons/${id}`),
  create: (data) => api.post('/lessons', data),
  update: (id, data) => api.put(`/lessons/${id}`, data),
  delete: (id) => api.delete(`/lessons/${id}`),
  complete: (id, data) => api.post(`/lessons/${id}/complete`, data)
};

export const studentService = {
  getDashboard: () => api.get('/student/dashboard'),
  getProgram: (programId) => api.get(`/student/program/${programId}`),
  saveNote: (data) => api.post('/student/notes', data),
  getNotes: (programId) => api.get(`/student/notes/${programId}`),
  submitQuiz: (lessonId, answers) => api.post(`/student/quiz/${lessonId}/submit`, { answers })
};

export const instructorService = {
  getDashboard: () => api.get('/instructor/dashboard'),
  getPrograms: () => api.get('/instructor/programs'),
  getProgram: (programId) => api.get(`/instructor/programs/${programId}`),
  createLesson: (data) => api.post('/instructor/lessons', data),
  updateLesson: (id, data) => api.put(`/instructor/lessons/${id}`, data),
  deleteLesson: (id) => api.delete(`/instructor/lessons/${id}`),
  uploadVideo: (formData) => api.post('/instructor/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadResource: (formData) => api.post('/instructor/upload/resource', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getStudents: (programId) => api.get(`/instructor/students/${programId}`),
  updateProfile: (data) => api.put('/instructor/profile', data)
};

export const paymentService = {
  getConfig: () => api.get('/payments/config'),
  initialize: (programId, provider) => api.post('/payments/initialize', { programId, provider }),
  verifyPaystack: (reference, programId) => api.get(`/payments/verify/paystack/${reference}?programId=${programId}`),
  verifyStripe: (sessionId, programId) => api.post('/payments/verify/stripe', { sessionId, programId })
};

export default api;
