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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [driveId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let data = [];
      
      if (driveId) {
        const res = await axiosInstance.get(`/applications/drive/${driveId}`);
        data = res.data;
      } else {
        const drivesRes = await axiosInstance.get('/drives/my/drives');
        const driveIds = drivesRes.data.map(drive => drive._id);
        
        if (driveIds.length > 0) {
          // Parallel fetching is much faster than sequential loops
          const requests = driveIds.map(id => axiosInstance.get(`/applications/drive/${id}`));
          const responses = await Promise.all(requests);
          data = responses.flatMap(res => res.data);
        }
      }

      setApplications(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sync applications');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    Applied: 'bg-blue-100 text-blue-800 border-blue-200',
    Shortlisted: 'bg-purple-100 text-purple-800 border-purple-200',
    'Interview Scheduled': 'bg-orange-100 text-orange-800 border-orange-200',
    Interviewed: 'bg-amber-100 text-amber-800 border-amber-200',
    Selected: 'bg-green-100 text-green-800 border-green-200',
    Rejected: 'bg-red-100 text-red-800 border-red-200',
  };

  const filteredApplications = applications.filter((app) => {
    const matchesFilter = filter === 'all' || app.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = app.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.drive?.jobRole?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <Loader />;

  return (
    <RecruiterLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-4 sm:p-8 font-[Montserrat]">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <button
                onClick={() => navigate('/recruiter/drives')}
                className="text-[#B08B5E] hover:text-[#7B4F1D] font-bold text-sm mb-2 flex items-center gap-2 transition-colors"
              >
                ← Return to Drives
              </button>
              <h1 className="text-3xl md:text-4xl font-black text-[#7B4F1D]">
                {driveId ? 'Review Candidates' : 'Global Applications'}
              </h1>
            </div>
            
            <div className="bg-white/50 px-4 py-2 rounded-2xl border border-[#EADCC8] text-[#7B4F1D] font-bold text-sm">
              Total Found: {filteredApplications.length}
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm mb-8 border border-[#EADCC8]/50">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
                <input 
                  type="text"
                  placeholder="Search by student name or role..."
                  className="w-full pl-12 pr-4 py-3 bg-[#F8EFE2]/50 rounded-2xl border-none focus:ring-2 focus:ring-[#B08B5E] outline-none font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {['all', 'Applied', 'Shortlisted', 'Selected', 'Rejected'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      filter === s 
                        ? 'bg-[#7B4F1D] text-white shadow-lg shadow-[#7B4F1D]/20' 
                        : 'bg-white text-[#7B4F1D] hover:bg-[#F8EFE2] border border-[#EADCC8]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-xl font-bold">
              {error}
            </div>
          )}

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <Link
                  key={app._id}
                  to={`/recruiter/applications/${app._id}`}
                  className="group block bg-white rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-[#B08B5E]/30"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-6">
                      {/* Avatar Placeholder */}
                      <div className="hidden sm:flex w-14 h-14 bg-[#F8EFE2] rounded-2xl items-center justify-center text-[#B08B5E] text-xl font-black">
                        {app.student?.name?.charAt(0)}
                      </div>
                      
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-[#7B4F1D] group-hover:text-[#B08B5E] transition-colors line-clamp-1">
                          {app.student?.name}
                        </h3>
                        <p className="text-[#B08B5E] font-bold text-sm uppercase tracking-tight">
                          {app.drive?.jobRole}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400 font-medium italic">
                            {new Date(app.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                      <span className={`px-4 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest border ${statusColors[app.status] || 'bg-gray-100'}`}>
                        {app.status}
                      </span>
                      <div className="hidden sm:block text-[#EADCC8] group-hover:text-[#B08B5E] transition-all transform group-hover:translate-x-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-[#EADCC8]">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-black text-[#7B4F1D]">No matches found</h3>
                <p className="text-gray-400 font-medium mb-6">Try adjusting your filters or search keywords</p>
                <button 
                  onClick={() => {setFilter('all'); setSearchTerm('');}}
                  className="px-6 py-2 bg-[#F8EFE2] text-[#7B4F1D] rounded-xl font-bold hover:bg-[#B08B5E] hover:text-white transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}