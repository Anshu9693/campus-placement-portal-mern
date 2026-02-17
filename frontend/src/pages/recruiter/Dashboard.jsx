import React, { useState, useEffect } from 'react';
import RecruiterLayout from '../../layouts/RecruiterLayout';
import dashboardService from '../../services/dashboardService';
import Loader from '../../components/common/Loader';

export default function RecruiterDashboard() {
  const [stats, setStats] = useState({
    totalApplicants: 0,
    shortlisted: 0,
    selected: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await dashboardService.getRecruiterDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error('Recruiter dashboard error:', err);
      if (err.response?.status === 404) {
        setError('You are not assigned to any company yet. Please contact the admin to assign you to a company.');
      } else {
        setError('Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <RecruiterLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-6 font-[Montserrat]">
        <div className="max-w-7xl">
          <h1 className="text-4xl font-bold text-[#7B4F1D] mb-8">Recruiter Dashboard</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Total Applicants', value: stats.totalApplicants, icon: '📝' },
              { label: 'Shortlisted', value: stats.shortlisted, icon: '⭐' },
              { label: 'Selected', value: stats.selected, icon: '✅' },
              { label: 'Rejected', value: stats.rejected, icon: '❌' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#B08B5E] text-sm font-semibold mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold text-[#7B4F1D]">{stat.value}</p>
                  </div>
                  <div className="text-5xl opacity-50">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-[#7B4F1D] mb-6">Quick Navigation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'My Drives', path: '/recruiter/drives', icon: '📋' },
                { label: 'View Applications', path: '/recruiter/applications', icon: '📝' },
                { label: 'Update Candidate Status', path: '/recruiter/applications', icon: '⭐' },
              ].map((action, idx) => (
                <a
                  key={idx}
                  href={action.path}
                  className="p-6 bg-[#F8EFE2] rounded-xl text-center hover:bg-[#B08B5E] hover:text-white transition-all font-semibold text-[#7B4F1D] flex flex-col items-center gap-3"
                >
                  <span className="text-4xl">{action.icon}</span>
                  {action.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}
