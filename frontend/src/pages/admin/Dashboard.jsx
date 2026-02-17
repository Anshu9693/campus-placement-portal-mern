import React, { useState, useEffect } from 'react';
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
    try {
      const res = await dashboardService.getAdminDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error('Admin dashboard error:', err);
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <AdminLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-6 font-[Montserrat]">
        <div className="max-w-7xl">
          <h1 className="text-4xl font-bold text-[#7B4F1D] mb-8">Admin Dashboard</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Students', value: stats.totalStudents, icon: '👥' },
              { label: 'Total Companies', value: stats.totalCompanies, icon: '🏢' },
              { label: 'Active Drives', value: stats.totalDrives, icon: '📋' },
              { label: 'Applications', value: stats.totalApplications, icon: '📝' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#B08B5E] text-sm font-semibold mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-[#7B4F1D]">{stat.value}</p>
                  </div>
                  <div className="text-4xl">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-[#7B4F1D] mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Manage Students', path: '/admin/students' },
                { label: 'Manage Companies', path: '/admin/companies' },
                { label: 'Manage Recruiters', path: '/admin/recruiters' },
                { label: 'Manage Drives', path: '/admin/drives' },
                { label: 'View Applications', path: '/admin/applications' },
              ].map((action, idx) => (
                <a
                  key={idx}
                  href={action.path}
                  className="p-4 bg-[#F8EFE2] rounded-xl text-center hover:bg-[#B08B5E] hover:text-white transition-all font-semibold text-[#7B4F1D]"
                >
                  {action.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
