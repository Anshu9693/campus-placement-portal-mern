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
        setError('Assignment Pending: You are not yet linked to a company.');
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
              <h1 className="text-3xl sm:text-4xl font-black text-[#7B4F1D]">Recruitment Hub</h1>
              <p className="text-[#B08B5E] font-medium italic">Partner Portal • Real-time Stats</p>
            </div>
            <div className="flex items-center gap-3 bg-[#FDF8F1] p-2 px-4 rounded-2xl shadow-sm border border-[#EADCC8]">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[#7B4F1D] font-bold text-xs uppercase tracking-widest">Live Sync</span>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-white border-l-4 border-orange-500 rounded-xl shadow-md flex items-center gap-4">
              <p className="text-[#7B4F1D] font-bold text-sm">{error}</p>
            </div>
          )}

          {/* Metric Cards - Fixed 2x2 on Mobile, 4 columns on Desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
            {[
              { 
                label: 'Total Applied', 
                value: stats.totalApplicants, 
                img: "https://cdn-icons-png.flaticon.com/512/5836/5836611.png", 
                color: 'border-blue-400' 
              },
              { 
                label: 'Shortlisted', 
                value: stats.shortlisted, 
                img: "https://cdn-icons-png.flaticon.com/512/2666/2666505.png", 
                color: 'border-purple-400' 
              },
              { 
                label: 'Hired', 
                value: stats.selected, 
                img: "https://cdn-icons-png.flaticon.com/512/3449/3449692.png", 
                color: 'border-green-400' 
              },
              { 
                label: 'Rejected', 
                value: stats.rejected, 
                img: "https://cdn-icons-png.flaticon.com/512/4300/4300058.png", 
                color: 'border-red-400' 
              },
            ].map((stat, idx) => (
              <div key={idx} className={`bg-[#FDF8F1] rounded-2xl p-4 sm:p-6 shadow-sm border-t-4 ${stat.color} transition-transform hover:scale-[1.02]`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-[#B08B5E] text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-black text-[#7B4F1D]">{stat.value.toLocaleString()}</p>
                  </div>
                  <img src={stat.img} alt={stat.label} className="w-8 h-8 sm:w-10 sm:h-10 object-contain opacity-80" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Pipeline Visualization */}
            <div className="lg:col-span-2 bg-[#FDF8F1] rounded-[2rem] p-6 sm:p-8 shadow-sm border border-[#EADCC8]/50">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-black text-[#7B4F1D]">Hiring Pipeline</h2>
                <div className="text-right">
                  <p className="text-[10px] font-black text-[#B08B5E] uppercase tracking-widest">Selection Ratio</p>
                  <p className="text-xl font-black text-green-600">{hiringEfficiency}%</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2 text-[#B08B5E]">
                    <span>In-Review Process</span>
                    <span>{pendingReview > 0 ? pendingReview : 0} Candidates</span>
                  </div>
                  <div className="w-full bg-[#EADCC8]/30 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#B08B5E] h-full transition-all duration-1000" 
                      style={{ width: `${(pendingReview / (stats.totalApplicants || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F8EFE2]/60 rounded-2xl border border-[#EADCC8]/40">
                    <p className="text-[10px] font-black text-[#B08B5E] uppercase mb-1">Successes</p>
                    <p className="text-2xl font-black text-green-600">{stats.selected}</p>
                  </div>
                  <div className="p-4 bg-[#F8EFE2]/60 rounded-2xl border border-[#EADCC8]/40">
                    <p className="text-[10px] font-black text-[#B08B5E] uppercase mb-1">Rejected</p>
                    <p className="text-2xl font-black text-red-400">{stats.rejected}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="bg-[#7B4F1D] rounded-[2rem] p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-5 text-8xl font-black select-none pointer-events-none translate-y-1/4 translate-x-1/4">
                PORTAL
              </div>
              
              <h2 className="text-xl font-black mb-6 uppercase tracking-tight">Quick Actions</h2>
              <div className="space-y-3 relative z-10">
                {[
                  { label: 'Manage My Drives', path: '/recruiter/drives', icon: '📋', sub: 'Active events' },
                  { label: 'Evaluate Candidates', path: '/recruiter/applications', icon: '📝', sub: 'Resume review' },
                  { label: 'Selection Results', path: '/recruiter/applications', icon: '⭐', sub: 'Finalize status' },
                ].map((action, idx) => (
                  <Link
                    key={idx}
                    to={action.path}
                    className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl hover:bg-[#FDF8F1] hover:text-[#7B4F1D] transition-all group border border-white/5"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
                    <div className="flex-1 text-left">
                      <p className="font-black text-xs uppercase tracking-tight">{action.label}</p>
                      <p className="text-[9px] font-medium opacity-60 uppercase tracking-widest">{action.sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-12 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-bold text-white/50 mb-1 italic text-center leading-relaxed">
                    Need support? Reach out to the <br/>University Placement Cell.
                  </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}