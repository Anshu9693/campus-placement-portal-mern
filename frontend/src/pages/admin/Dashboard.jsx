import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import dashboardService from '../../services/dashboardService';
import Loader from '../../components/common/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalDrives: 0,
    totalApplications: 0,
    selected: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getAdminDashboardStats();
      setStats(res.data);
      setError('');
    } catch (err) {
      setError('Unable to fetch the latest analytics.');
    } finally {
      setLoading(false);
    }
  };

  // Logic for the funnel - using 1 as fallback to prevent Divide-by-Zero errors
  const denominator = stats.totalApplications || 1;
  const pending = stats.totalApplications - (stats.selected + stats.rejected);
  const selectionRate = ((stats.selected / denominator) * 100).toFixed(1);

  if (loading) return <Loader />;

  return (
    <AdminLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-4 sm:p-8 font-[Montserrat]">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#7B4F1D]">System Overview</h1>
              <p className="text-[#B08B5E] font-medium italic">Placement Cell Analytics</p>
            </div>
            <button 
              onClick={fetchDashboardStats}
              className="p-3 bg-white text-[#7B4F1D] rounded-full shadow-sm hover:rotate-180 transition-all duration-500 border border-[#EADCC8]"
              title="Refresh Data"
            >
              🔄
            </button>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl">
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          {/* Core Analytics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Students', value: stats.totalStudents, icon: '👥', color: 'border-blue-400' },
              { label: 'Companies', value: stats.totalCompanies, icon: '🏢', color: 'border-purple-400' },
              { label: 'Live Drives', value: stats.totalDrives, icon: '📋', color: 'border-orange-400' },
              { label: 'Applications', value: stats.totalApplications, icon: '📝', color: 'border-green-400' },
            ].map((stat, idx) => (
              <div key={idx} className={`bg-white rounded-2xl p-6 shadow-sm border-t-4 ${stat.color}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#B08B5E] text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-black text-[#7B4F1D]">{stat.value}</p>
                  </div>
                  <span className="text-2xl opacity-50">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Placement Performance & Navigation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Functional Funnel Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-[#EADCC8]/50">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-[#7B4F1D]">Placement Progress</h2>
                <div className="text-right">
                  <p className="text-[10px] font-black text-[#B08B5E] uppercase">Success Rate</p>
                  <p className="text-xl font-black text-green-600">{stats.totalApplications > 0 ? selectionRate : 0}%</p>
                </div>
              </div>
              
              <div className="space-y-8">
                {/* Selected */}
                <div>
                  <div className="flex justify-between text-xs font-black uppercase mb-2 text-green-700">
                    <span>Selected</span>
                    <span>{stats.selected}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500 h-full transition-all duration-700" 
                      style={{ width: `${(stats.selected / denominator) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Pending */}
                <div>
                  <div className="flex justify-between text-xs font-black uppercase mb-2 text-blue-700">
                    <span>In Review</span>
                    <span>{pending > 0 ? pending : 0}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-700" 
                      style={{ width: `${(pending / denominator) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Rejected */}
                <div>
                  <div className="flex justify-between text-xs font-black uppercase mb-2 text-red-700">
                    <span>Rejected</span>
                    <span>{stats.rejected}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-red-400 h-full transition-all duration-700" 
                      style={{ width: `${(stats.rejected / denominator) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Quick Links */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-[#7B4F1D] px-2">Navigation</h2>
              {[
                { label: 'Manage Students', path: '/admin/students', icon: '🎓', desc: 'Verify and edit profiles' },
                { label: 'Placement Drives', path: '/admin/drives', icon: '🚀', desc: 'Create and track jobs' },
                { label: 'Student Applications', path: '/admin/applications', icon: '👁️', desc: 'Update hiring status' },
                { label: 'Company Directory', path: '/admin/companies', icon: '🤝', desc: 'Manage partners' },
                // { label: 'Recruiters', path: '/admin/recruiters', icon: '🧑‍💼', desc: 'Create and manage recruiters' },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  className="block p-4 bg-white border border-[#EADCC8]/60 rounded-2xl hover:bg-[#7B4F1D] hover:text-white transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{link.icon}</span>
                    <div>
                      <p className="font-black text-sm">{link.label}</p>
                      <p className="text-[10px] opacity-60 font-bold uppercase tracking-tighter">{link.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
