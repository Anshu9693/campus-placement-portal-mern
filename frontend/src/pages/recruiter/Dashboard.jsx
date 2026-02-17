import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      setError('');
    } catch (err) {
      console.error('Recruiter dashboard error:', err);
      if (err.response?.status === 404) {
        setError('Assignment Pending: You are not yet linked to a company. Please contact the administrator.');
      } else {
        setError('System Error: Unable to sync dashboard data.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Derived Analytics
  const totalProcessed = stats.selected + stats.rejected + stats.shortlisted;
  const pendingReview = stats.totalApplicants - totalProcessed;
  const hiringEfficiency = stats.totalApplicants > 0 
    ? ((stats.selected / stats.totalApplicants) * 100).toFixed(1) 
    : 0;

  if (loading) return <Loader />;

  return (
    <RecruiterLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-4 sm:p-8 font-[Montserrat]">
        <div className="max-w-7xl mx-auto">
          
          {/* Header & Status Indicator */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-black text-[#7B4F1D]">Recruitment Hub</h1>
              <p className="text-[#B08B5E] font-bold tracking-wide uppercase text-xs mt-1">
                Company Partner Portal • Live Statistics
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-2xl shadow-sm border border-[#EADCC8]">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[#7B4F1D] font-bold text-sm">System Live</span>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-white border-l-4 border-orange-500 rounded-xl shadow-md flex items-center gap-4">
              <span className="text-3xl">⚠️</span>
              <p className="text-[#7B4F1D] font-bold">{error}</p>
            </div>
          )}

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Total Applicants', value: stats.totalApplicants, icon: '📝', color: 'bg-blue-50 text-blue-600' },
              { label: 'Shortlisted', value: stats.shortlisted, icon: '⭐', color: 'bg-purple-50 text-purple-600' },
              { label: 'Hired', value: stats.selected, icon: '✅', color: 'bg-green-50 text-green-600' },
              { label: 'Rejected', value: stats.rejected, icon: '❌', color: 'bg-red-50 text-red-600' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-[#EADCC8]/50 hover:shadow-md transition-shadow">
                <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4`}>
                  {stat.icon}
                </div>
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black text-[#7B4F1D]">{stat.value.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Pipeline Visualization */}
            <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-lg">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-[#7B4F1D]">Hiring Pipeline</h2>
                <div className="text-right">
                  <p className="text-[10px] font-black text-[#B08B5E] uppercase tracking-tighter">Selection Ratio</p>
                  <p className="text-xl font-black text-[#7B4F1D]">{hiringEfficiency}%</p>
                </div>
              </div>

              

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-black uppercase mb-2 text-gray-500">
                    <span>In-Review Process</span>
                    <span>{pendingReview > 0 ? pendingReview : 0} Candidates</span>
                  </div>
                  <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#B08B5E] h-full transition-all duration-1000" 
                      style={{ width: `${(pendingReview / (stats.totalApplicants || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F8EFE2]/50 rounded-2xl border border-[#EADCC8]">
                    <p className="text-[10px] font-black text-[#B08B5E] uppercase">Successes</p>
                    <p className="text-2xl font-black text-green-600">{stats.selected}</p>
                  </div>
                  <div className="p-4 bg-[#F8EFE2]/50 rounded-2xl border border-[#EADCC8]">
                    <p className="text-[10px] font-black text-[#B08B5E] uppercase">Rejected</p>
                    <p className="text-2xl font-black text-red-400">{stats.rejected}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="bg-[#7B4F1D] rounded-[2rem] p-8 shadow-xl text-white">
              <h2 className="text-2xl font-black mb-6">Operations</h2>
              <div className="space-y-3">
                {[
                  { label: 'Manage My Drives', path: '/recruiter/drives', icon: '📋', sub: 'Active hiring events' },
                  { label: 'Evaluate Candidates', path: '/recruiter/applications', icon: '📝', sub: 'Review pending resumes' },
                  { label: 'Selection Results', path: '/recruiter/applications', icon: '⭐', sub: 'Finalize student status' },
                ].map((action, idx) => (
                  <Link
                    key={idx}
                    to={action.path}
                    className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl hover:bg-white hover:text-[#7B4F1D] transition-all group"
                  >
                    <span className="text-2xl">{action.icon}</span>
                    <div className="flex-1 text-left">
                      <p className="font-black text-sm">{action.label}</p>
                      <p className="text-[10px] font-medium opacity-60 uppercase">{action.sub}</p>
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                ))}
              </div>
              
              <div className="mt-12 p-5 bg-white/5 rounded-3xl border border-white/10">
                 <p className="text-xs font-bold text-white/60 mb-1 italic text-center">Need help? Contact the University Placement Cell.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}