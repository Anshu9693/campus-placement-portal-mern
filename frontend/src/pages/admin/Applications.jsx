import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import applicationService from '../../services/applicationService';
import Loader from '../../components/common/Loader';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await applicationService.getApplications();
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await applicationService.updateStatus(applicationId, newStatus);
      // Optimistic update to UI for smoother experience
      setApplications(prev => 
        prev.map(app => app._id === applicationId ? { ...app, status: newStatus } : app)
      );
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update application');
      fetchApplications(); // Revert on error
    }
  };

  const statusOptions = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Interviewed', 'Selected', 'Rejected'];

  const statusColors = {
    Applied: 'bg-blue-100 text-blue-800',
    Shortlisted: 'bg-purple-100 text-purple-800',
    'Interview Scheduled': 'bg-orange-100 text-orange-800',
    Interviewed: 'bg-amber-100 text-amber-800',
    Selected: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };

  const filteredApplications = applications.filter((app) => {
    const matchesFilter = filter === 'all' || app.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = 
      app.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.drive?.jobRole?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate stats for the dashboard
  const stats = {
    total: applications.length,
    selected: applications.filter(a => a.status === 'Selected').length,
    pending: applications.filter(a => a.status === 'Applied').length
  };

  if (loading) return <Loader />;

  return (
    <AdminLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-4 sm:p-8 font-[Montserrat]">
        <div className="max-w-7xl mx-auto">
          
          {/* Header & Stats Dashboard */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-[#7B4F1D] mb-6">Student Applications</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-[#B08B5E]">
                <p className="text-sm font-bold text-gray-500 uppercase">Total Applications</p>
                <p className="text-3xl font-black text-[#7B4F1D]">{stats.total}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-green-500">
                <p className="text-sm font-bold text-gray-500 uppercase">Total Selected</p>
                <p className="text-3xl font-black text-green-600">{stats.selected}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-blue-500">
                <p className="text-sm font-bold text-gray-500 uppercase">New/Pending</p>
                <p className="text-3xl font-black text-blue-600">{stats.pending}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-r-xl flex justify-between">
              <span>{error}</span>
              <button onClick={() => setError('')}>✕</button>
            </div>
          )}

          {/* Controls Section */}
          <div className="bg-white p-4 rounded-3xl shadow-sm mb-6 flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
              <input 
                type="text"
                placeholder="Search by student, company, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F8EFE2]/50 border border-[#B08B5E]/20 rounded-2xl focus:ring-2 focus:ring-[#B08B5E] outline-none"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {['all', ...statusOptions].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    filter === status
                      ? 'bg-[#7B4F1D] text-white shadow-md'
                      : 'bg-[#F8EFE2] text-[#7B4F1D] hover:bg-[#EADCC8]'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Applications Content */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-[#EADCC8]/50">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-[#7B4F1D] text-white">
                  <tr>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">Student</th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">Company & Role</th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">Current Status</th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">Applied Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => (
                      <tr key={app._id} className="hover:bg-[#F8EFE2]/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#7B4F1D]">{app.student?.name}</p>
                          <p className="text-xs text-gray-500">{app.student?.email || 'No email'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-800">{app.company?.name}</p>
                          <p className="text-sm text-[#B08B5E]">{app.drive?.jobRole}</p>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            className={`px-4 py-2 rounded-xl text-xs font-black border-none cursor-pointer outline-none ring-1 ring-black/5 shadow-sm transition-all ${statusColors[app.status] || 'bg-gray-100'}`}
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                          {new Date(app.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center text-gray-400 italic">No applications found matching your criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredApplications.map((app) => (
                <div key={app._id} className="p-5 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-[#7B4F1D]">{app.student?.name}</h3>
                      <p className="text-sm font-bold text-gray-800">{app.company?.name}</p>
                      <p className="text-xs text-[#B08B5E]">{app.drive?.jobRole}</p>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Status:</span>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className={`flex-1 px-4 py-2 rounded-xl text-xs font-black border-none outline-none ${statusColors[app.status]}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}