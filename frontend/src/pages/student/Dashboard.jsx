import React, { useState, useEffect } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import axiosInstance from '../../services/axiosInstance';
import dashboardService from '../../services/dashboardService';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader'; // Added Loader

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
      setLoading(true);
      // Fetch both simultaneously for efficiency
      const [statsRes, drivesRes] = await Promise.all([
        dashboardService.getStudentDashboardStats(),
        axiosInstance.get('/drives')
      ]);

      setStats({
        applicationsCount: statsRes.data?.totalApplied || 0,
        selectedCount: statsRes.data?.selected || 0,
        drivesCount: drivesRes.data?.length || 0,
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to sync dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowResume = async () => {
    try {
      const res = await axiosInstance.get('/students/profile');
      const url = res.data?.resume?.url;

      if (url) {
        setResumeUrl(url);
        setShowResumeModal(true);
      } else {
        setError('Resume not found. Please upload it in your profile.');
        setTimeout(() => setError(''), 4000);
      }
    } catch (err) {
      setError('Could not load resume. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) return <Loader />;

  return (
    <StudentLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-6 font-[Montserrat]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-[#7B4F1D]">Dashboard</h1>
            <button 
              onClick={fetchStats}
              className="text-sm font-semibold text-[#B08B5E] hover:text-[#7B4F1D]"
            >
              ↻ Refresh Data
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded-lg animate-pulse">
              <p className="text-red-700 font-medium">{error}</p>
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
                className={`bg-gradient-to-br ${stat.color} to-black/20 rounded-2xl p-6 text-white shadow-lg transition-transform hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold opacity-80 mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold">{stat.value}</p>
                  </div>
                  <div className="text-5xl opacity-30">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Navigation */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-[#EADCC8]">
            <h2 className="text-2xl font-bold text-[#7B4F1D] mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'View Drives', icon: '📋', action: () => navigate('/student/drives') },
                { label: 'My Applications', icon: '📝', action: () => navigate('/student/applications') },
                { label: 'My Profile', icon: '👤', action: () => navigate('/student/profile') },
                { label: 'Show Resume', icon: '📄', action: handleShowResume },
              ].map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.action}
                  className="p-6 rounded-xl text-center font-bold transition-all bg-[#F8EFE2] text-[#7B4F1D] hover:bg-[#7B4F1D] hover:text-white shadow-sm hover:shadow-md"
                >
                  <div className="text-3xl mb-3">{action.icon}</div>
                  <div className="text-sm uppercase tracking-wider">{action.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Resume Modal */}
          {showResumeModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col z-50 animate-in fade-in duration-300">
              <div className="flex justify-between items-center p-5 bg-white border-b border-gray-200">
                <h2 className="text-2xl font-bold text-[#7B4F1D]">Professional Resume</h2>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="text-gray-400 hover:text-red-500 text-3xl transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 bg-gray-100 overflow-hidden">
                <iframe
                  src={`${resumeUrl}#toolbar=1`}
                  className="w-full h-full border-0"
                  title="Resume Viewer"
                />
              </div>

              <div className="flex gap-4 p-5 bg-white border-t border-gray-200">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-bold shadow-lg"
                >
                  📥 Download Copy
                </a>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="flex-1 px-6 py-3 bg-[#F8EFE2] text-[#7B4F1D] rounded-xl hover:bg-[#B08B5E] hover:text-white transition-all font-bold"
                >
                  Close Preview
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}