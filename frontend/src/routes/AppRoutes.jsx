import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard';
import Companies from '../pages/admin/Companies';
import Drives from '../pages/admin/Drives';
import AdminApplications from '../pages/admin/Applications';
import Students from '../pages/admin/Students';
import Recruiters from '../pages/admin/Recruiters';

// Student pages
import StudentDashboard from '../pages/student/Dashboard';
import StudentProfile from '../pages/student/Profile';
import StudentDrives from '../pages/student/Drives';
import StudentApplications from '../pages/student/Applications';
import StudentApplicationDetails from '../pages/student/ApplicationDetails';

// Recruiter pages
import RecruiterDashboard from '../pages/recruiter/Dashboard';
import MyDrives from '../pages/recruiter/MyDrives';
import DriveApplications from '../pages/recruiter/DriveApplications';
import RecruiterApplicationDetails from '../pages/recruiter/ApplicationDetails';

// Misc pages
import NotFound from '../pages/NotFound';
import Landing from '../pages/landing/Landing';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/companies" element={<Companies />} />
      <Route path="/admin/drives" element={<Drives />} />
      <Route path="/admin/applications" element={<AdminApplications />} />
      <Route path="/admin/students" element={<Students />} />
      <Route path="/admin/recruiters" element={<Recruiters />} />

      {/* Student routes */}
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/profile" element={<StudentProfile />} />
      <Route path="/student/drives" element={<StudentDrives />} />
      <Route path="/student/applications" element={<StudentApplications />} />
      <Route path="/student/applications/:id" element={<StudentApplicationDetails />} />

      {/* Recruiter routes */}
      <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
      <Route path="/recruiter/drives" element={<MyDrives />} />
      <Route path="/recruiter/applications" element={<DriveApplications />} />
      <Route path="/recruiter/drives/:id/applications" element={<DriveApplications />} />
      <Route path="/recruiter/applications/:id" element={<RecruiterApplicationDetails />} />

      {/* Landing page */}
      <Route path="/" element={<Landing />} />

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
