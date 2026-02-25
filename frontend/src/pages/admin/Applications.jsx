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
    pending: applications.filter(a => a.status === 'Applied' || a.status === 'Shortlisted').length
  };

  if (loading) return <Loader />;

  return (
    <AdminLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-4 sm:p-8 font-[Montserrat]">
        <div className="max-w-7xl mx-auto">
          
          {/* Header & Stats Dashboard */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-[#7B4F1D] mb-2">Student Applications</h1>
            <p className="text-[#B08B5E] font-medium italic mb-6">Hiring Pipeline Tracking</p>
            
            {/* DASHBOARD CARDS: Fixed 2-column grid for mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-8">
              <div className="bg-[#FDF8F1] p-4 sm:p-6 rounded-2xl shadow-sm border-t-4 border-[#B08B5E] col-span-2 lg:col-span-1 transition-transform hover:scale-[1.01]">
                <p className="text-[10px] sm:text-xs font-black text-[#B08B5E] uppercase tracking-widest mb-1">Total Applications</p>
                <div className="flex justify-between items-end">
                  <p className="text-2xl sm:text-4xl font-black text-[#7B4F1D]">{stats.total}</p>
                  <span className="text-xl opacity-20 hidden sm:block">📋</span>
                </div>
              </div>
              <div className="bg-[#FDF8F1] p-4 sm:p-6 rounded-2xl shadow-sm border-t-4 border-green-500 transition-transform hover:scale-[1.01]">
                <p className="text-[10px] sm:text-xs font-black text-[#B08B5E] uppercase tracking-widest mb-1">Total Selected</p>
                <div className="flex justify-between items-end">
                  <p className="text-2xl sm:text-4xl font-black text-green-600">{stats.selected}</p>
                  <span className="text-xl opacity-20 hidden sm:block">✅</span>
                </div>
              </div>
              <div className="bg-[#FDF8F1] p-4 sm:p-6 rounded-2xl shadow-sm border-t-4 border-blue-500 transition-transform hover:scale-[1.01]">
                <p className="text-[10px] sm:text-xs font-black text-[#B08B5E] uppercase tracking-widest mb-1">New/Pending</p>
                <div className="flex justify-between items-end">
                  <p className="text-2xl sm:text-4xl font-black text-blue-600">{stats.pending}</p>
                  <span className="text-xl opacity-20 hidden sm:block">⏳</span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-r-xl flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError('')} className="font-bold">✕</button>
            </div>
          )}

          {/* Controls Section: Reorganized Search and Filter Pills */}
          <div className="bg-[#FDF8F1] p-4 sm:p-6 rounded-[2rem] shadow-sm border border-[#EADCC8]/60 mb-8 flex flex-col gap-6">
            {/* Search */}
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40">🔍</span>
              <input 
                type="text"
                placeholder="Search student, company, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white border border-[#EADCC8] rounded-2xl focus:ring-2 focus:ring-[#B08B5E] outline-none transition-all text-sm sm:text-base"
              />
            </div>

            {/* Filter Tabs: Horizontal scrolling pills for a professional look */}
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-black text-[#B08B5E] uppercase tracking-widest ml-1">Filter by Pipeline Stage</p>
              <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2 no-scrollbar">
                <button
                  onClick={() => setFilter('all')}
                  className={`flex-none px-5 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                    filter === 'all'
                      ? 'bg-[#7B4F1D] text-white shadow-md'
                      : 'bg-[#F8EFE2] text-[#7B4F1D] hover:bg-[#EADCC8]'
                  }`}
                >
                  All
                </button>
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`flex-none px-5 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                      filter === status
                        ? 'bg-[#7B4F1D] text-white shadow-md'
                        : 'bg-[#F8EFE2] text-[#7B4F1D] hover:bg-[#EADCC8]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Applications Content */}
          <div className="bg-white rounded-[2rem] shadow-lg overflow-hidden border border-[#EADCC8]/50">
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
                      <td colSpan="4" className="px-6 py-20 text-center text-gray-400 italic font-medium">No applications found matching your criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-[#EADCC8]/30">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <div key={app._id} className="p-5 flex flex-col gap-3 bg-[#FDF8F1]/50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-2">
                        <h3 className="font-black text-[#7B4F1D] text-lg leading-tight">{app.student?.name}</h3>
                        <p className="text-sm font-bold text-gray-800 mt-1">{app.company?.name}</p>
                        <p className="text-xs text-[#B08B5E] font-medium uppercase tracking-tighter">{app.drive?.jobRole}</p>
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100 uppercase">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-[10px] font-black text-[#B08B5E] uppercase tracking-widest ml-1">Hiring Stage</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl text-xs font-black border-none outline-none ring-1 ring-black/5 shadow-sm ${statusColors[app.status]}`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-gray-400 italic text-sm">No results found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}