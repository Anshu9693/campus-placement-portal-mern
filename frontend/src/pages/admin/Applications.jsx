import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import applicationService from '../../services/applicationService';
import Loader from '../../components/common/Loader';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

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
      fetchApplications();
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update application');
    }
  };

  const filteredApplications = filter === 'all'
    ? applications
    : applications.filter((app) => app.status.toLowerCase() === filter.toLowerCase());

  const statusColors = {
    Applied: 'bg-blue-100 text-blue-800',
    Shortlisted: 'bg-purple-100 text-purple-800',
    'Interview Scheduled': 'bg-orange-100 text-orange-800',
    Interviewed: 'bg-amber-100 text-amber-800',
    Selected: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };

  if (loading) return <Loader />;

  return (
    <AdminLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-6 font-[Montserrat]">
        <div className="max-w-7xl">
          <h1 className="text-4xl font-bold text-[#7B4F1D] mb-8">Applications</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-8 flex flex-wrap gap-2">
            {['all', 'Applied', 'Shortlisted', 'Interviewed', 'Selected', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  filter === status
                    ? 'bg-[#B08B5E] text-white'
                    : 'bg-white text-[#7B4F1D] hover:bg-[#F8EFE2]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#7B4F1D] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Student</th>
                    <th className="px-6 py-4 text-left font-bold">Company</th>
                    <th className="px-6 py-4 text-left font-bold">Role</th>
                    <th className="px-6 py-4 text-left font-bold">Status</th>
                    <th className="px-6 py-4 text-left font-bold">Applied On</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app._id} className="border-t border-gray-200 hover:bg-[#F8EFE2] transition-colors">
                      <td className="px-6 py-4 font-semibold text-[#7B4F1D]">{app.student?.name}</td>
                      <td className="px-6 py-4">{app.company?.name}</td>
                      <td className="px-6 py-4 text-gray-700">{app.drive?.jobRole}</td>
                      <td className="px-6 py-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-bold cursor-pointer ${statusColors[app.status] || 'bg-gray-100'}`}
                        >
                          {['Applied', 'Shortlisted', 'Interview Scheduled', 'Interviewed', 'Selected', 'Rejected'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{new Date(app.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
