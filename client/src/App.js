import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Bootcamps from './pages/Bootcamps';
import OlympiadPrep from './pages/OlympiadPrep';
import CorporateTraining from './pages/CorporateTraining';
import ClimatePrograms from './pages/ClimatePrograms';
import ProgramDetail from './pages/ProgramDetail';
import Contact from './pages/Contact';
import Admissions from './pages/Admissions';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPrograms from './pages/admin/Programs';
import AdminEnrollments from './pages/admin/Enrollments';
import AdminUsers from './pages/admin/Users';
import AdminContacts from './pages/admin/Contacts';
import AdminLessons from './pages/admin/LessonsManager';
import StudentDashboard from './pages/student/Dashboard';
import Learn from './pages/student/Learn';
import InstructorDashboard from './pages/instructor/Dashboard';
import CourseManager from './pages/instructor/CourseManager';
import Checkout from './pages/Checkout';
import { PaymentSuccess, PaymentCancel } from './pages/PaymentStatus';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';
import './styles/index.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="bootcamps" element={<Bootcamps />} />
          <Route path="olympiad-prep" element={<OlympiadPrep />} />
          <Route path="corporate-training" element={<CorporateTraining />} />
          <Route path="climate-programs" element={<ClimatePrograms />} />
          <Route path="programs/:slug" element={<ProgramDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/programs" element={<ProtectedRoute adminOnly><AdminPrograms /></ProtectedRoute>} />
        <Route path="/admin/programs/:programId/lessons" element={<ProtectedRoute adminOnly><AdminLessons /></ProtectedRoute>} />
        <Route path="/admin/enrollments" element={<ProtectedRoute adminOnly><AdminEnrollments /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/contacts" element={<ProtectedRoute adminOnly><AdminContacts /></ProtectedRoute>} />

        {/* Checkout & Payment Routes */}
        <Route path="/checkout/:programId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/verify" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />

        {/* Student Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/courses" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="/learn/:programId" element={<ProtectedRoute><Learn /></ProtectedRoute>} />

        {/* Instructor Routes */}
        <Route path="/instructor" element={<ProtectedRoute><InstructorDashboard /></ProtectedRoute>} />
        <Route path="/instructor/courses" element={<ProtectedRoute><InstructorDashboard /></ProtectedRoute>} />
        <Route path="/instructor/courses/:programId" element={<ProtectedRoute><CourseManager /></ProtectedRoute>} />
        
        {/* Catch all route for SPA */}
        <Route path="*" element={<Layout><Home /></Layout>} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
