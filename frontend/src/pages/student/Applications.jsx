import React, { useState, useEffect } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import axiosInstance from '../../services/axiosInstance';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';

export default function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get('/students/applications');
      setApplications(res.data);
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter((app) => app.status.toLowerCase() === filter.toLowerCase());

  if (loading) return <Loader />;

  const statuses = ['all', 'Applied', 'Shortlisted', 'Interviewed', 'Selected', 'Rejected'];
  const statusColors = {
    Applied: 'bg-blue-100 text-blue-800',
    Shortlisted: 'bg-purple-100 text-purple-800',
    'Interview Scheduled': 'bg-orange-100 text-orange-800',
    Interviewed: 'bg-amber-100 text-amber-800',
    Selected: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
    'On Hold': 'bg-gray-100 text-gray-800',
  };

  return (
    <StudentLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-6 font-[Montserrat]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-[#7B4F1D] mb-8">My Applications</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="mb-8 flex flex-wrap gap-2">
            {statuses.map((status) => (
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

          <div className="space-y-4">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <Link
                  key={app._id}
                  to={`/student/applications/${app._id}`}
                  className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-[1.01]"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-[#7B4F1D]">{app.drive?.jobRole}</h3>
                        {app.company?.logo?.url && (
                          <img src={app.company.logo.url} alt="Company" className="w-10 h-10 rounded" />
                        )}
                      </div>
                      <p className="text-[#B08B5E] font-semibold">{app.company?.name}</p>
                      <p className="text-gray-600 text-sm mt-1">
                        Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Current Status</p>
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${statusColors[app.status] || 'bg-gray-100'}`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="text-[#B08B5E] text-2xl">→</div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl">
                <p className="text-gray-500 text-lg">No applications found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
