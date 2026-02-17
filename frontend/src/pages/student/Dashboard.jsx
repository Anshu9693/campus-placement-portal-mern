import React, { useState, useEffect } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import axiosInstance from '../../services/axiosInstance';
import dashboardService from '../../services/dashboardService';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    applicationsCount: 0,
    drivesCount: 0,
    selectedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await dashboardService.getStudentDashboardStats();
      
      // Also fetch total drives for display
      const drivesRes = await axiosInstance.get('/drives');
      
      setStats({
        applicationsCount: res.data.totalApplied || 0,
        selectedCount: res.data.selected || 0,
        drivesCount: drivesRes.data.length || 0,
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const handleShowResume = async () => {
    try {
      const res = await axiosInstance.get('/students/profile');
      
      if (res.data.resume?.url) {
        setResumeUrl(res.data.resume.url);
        setShowResumeModal(true);
      } else {
        setError('Resume not found. Please upload it in your profile.');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load resume');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <StudentLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-6 font-[Montserrat]">
        <div className="max-w-7xl">
          <h1 className="text-4xl font-bold text-[#7B4F1D] mb-8">Dashboard</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: 'Applications', value: stats.applicationsCount, icon: '📝', color: 'from-[#B08B5E]' },
              { label: 'Available Drives', value: stats.drivesCount, icon: '📋', color: 'from-[#7B4F1D]' },
              { label: 'Selected', value: stats.selectedCount, icon: '✅', color: 'from-green-500' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${stat.color} to-opacity-80 rounded-2xl p-6 text-white shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold opacity-80 mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold">{stat.value}</p>
                  </div>
                  <div className="text-5xl opacity-50">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Navigation */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-[#7B4F1D] mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'View Drives', icon: '📋', action: () => navigate('/student/drives') },
                { label: 'My Applications', icon: '📝', action: () => navigate('/student/applications') },
                { label: 'My Profile', icon: '👤', action: () => navigate('/student/profile') },
                { label: '� Show Resume', icon: '', action: handleShowResume },
              ].map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.action}
                  className="p-4 rounded-xl text-center font-semibold transition-all bg-[#F8EFE2] text-[#7B4F1D] hover:bg-[#B08B5E] hover:text-white"
                >
                  <div className="text-2xl mb-2">{action.icon || ''}</div>
                  <div>{action.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Resume Modal */}
          {showResumeModal && (
            <div className="fixed inset-0 bg-white flex flex-col z-50 font-[Montserrat]">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
                <h2 className="text-2xl font-bold text-[#7B4F1D]">My Resume</h2>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="text-gray-600 hover:text-gray-900 text-4xl font-light leading-none"
                >
                  ×
                </button>
              </div>

              {/* Modal Body - PDF Viewer (Full Screen) */}
              <div className="flex-1 overflow-hidden w-full">
                <iframe
                  src={`${resumeUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                  className="w-full h-full border-0"
                  title="Resume"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold"
                >
                  📥 Download Resume
                </a>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="flex-1 px-6 py-3 bg-[#F8EFE2] text-[#7B4F1D] rounded-xl hover:bg-[#B08B5E] hover:text-white transition-all font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
