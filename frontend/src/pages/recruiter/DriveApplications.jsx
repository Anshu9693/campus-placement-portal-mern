import React, { useState, useEffect } from 'react';
import RecruiterLayout from '../../layouts/RecruiterLayout';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../../components/common/Loader';

export default function DriveApplications() {
  const { id: driveId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, [driveId]);

  const fetchApplications = async () => {
    try {
      let res;
      
      if (driveId) {
        // Fetch applications for a specific drive
        res = await axiosInstance.get(`/applications/drive/${driveId}`);
      } else {
        // Fetch all applications for recruiter's company drives
        const drivesRes = await axiosInstance.get('/drives/my/drives');
        const driveIds = drivesRes.data.map(drive => drive._id);
        
        if (driveIds.length === 0) {
          setApplications([]);
          setLoading(false);
          return;
        }
        
        // Fetch applications for all drives
        const allApps = [];
        for (const id of driveIds) {
          const appRes = await axiosInstance.get(`/applications/drive/${id}`);
          allApps.push(...appRes.data);
        }
        res = { data: allApps };
      }

      setApplications(res.data);
      setError('');
    } catch (err) {
      console.error('Failed to load applications:', err);
      setError(err.response?.data?.message || 'Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
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
    <RecruiterLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-6 font-[Montserrat]">
        <div className="max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-[#7B4F1D]">
              {driveId ? 'Drive Applications' : 'All Applications'}
            </h1>
            {driveId && (
              <button
                onClick={() => navigate('/recruiter/drives')}
                className="text-[#B08B5E] hover:text-[#7B4F1D] font-semibold"
              >
                ← Back to Drives
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-8 flex flex-wrap gap-2">
            {['all', 'Applied', 'Shortlisted', 'Interview Scheduled', 'Interviewed', 'Selected', 'Rejected'].map((status) => (
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
                  to={`/recruiter/applications/${app._id}`}
                  className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-[1.01]"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#7B4F1D] mb-1">{app.student?.name}</h3>
                      <p className="text-[#B08B5E] font-semibold">{app.drive?.jobRole}</p>
                      <p className="text-gray-600 text-sm mt-1">
                        Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColors[app.status] || 'bg-gray-100'}`}>
                        {app.status}
                      </span>
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
    </RecruiterLayout>
  );
}
