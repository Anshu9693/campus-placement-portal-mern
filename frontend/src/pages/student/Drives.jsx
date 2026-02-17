import React, { useState, useEffect } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../../components/common/Loader';

export default function StudentDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appliedDrives, setAppliedDrives] = useState(new Set());

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchDrives(), fetchAppliedDrives()]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await axiosInstance.get('/students/drives');
      setDrives(res.data || []);
    } catch (err) {
      setError('Failed to load drives');
    }
  };

  const fetchAppliedDrives = async () => {
    try {
      const res = await axiosInstance.get('/students/applications');

      // Convert all IDs to string to avoid ObjectId mismatch
      const driveIds = new Set(
        (res.data || []).map(app =>
          app?.drive?._id?.toString()
        )
      );

      setAppliedDrives(driveIds);
    } catch (err) {
      console.error('Failed to load applied drives');
    }
  };

  const handleApply = async (driveId) => {
    try {
      await axiosInstance.post(`/students/apply/${driveId}`, {});
      
      // Update state immediately after applying
      setAppliedDrives(prev =>
        new Set([...prev, driveId.toString()])
      );

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply');
    }
  };

  // Helper function for safe ID check
  const hasApplied = (id) => {
    return appliedDrives.has(id?.toString());
  };

  if (loading) return <Loader />;

  return (
    <StudentLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-6 font-[Montserrat]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-[#7B4F1D] mb-8">
            Available Drives
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="grid gap-6">
            {drives.length > 0 ? (
              drives.map((drive) => (
                <div
                  key={drive._id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-[#7B4F1D]">
                          {drive.jobRole}
                        </h3>

                        {drive.company?.logo?.url && (
                          <img
                            src={drive.company.logo.url}
                            alt="Company"
                            className="w-12 h-12 rounded-lg"
                          />
                        )}
                      </div>

                      <p className="text-[#B08B5E] font-semibold mb-2">
                        {drive.company?.name}
                      </p>

                      <p className="text-gray-700 mb-3">
                        {drive.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-[#B08B5E] font-bold">Location</p>
                          <p className="text-gray-700">{drive.location}</p>
                        </div>

                        <div>
                          <p className="text-[#B08B5E] font-bold">Vacancies</p>
                          <p className="text-gray-700">{drive.vacancies}</p>
                        </div>

                        <div>
                          <p className="text-[#B08B5E] font-bold">Deadline</p>
                          <p className="text-gray-700">
                            {new Date(drive.deadline).toLocaleDateString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-[#B08B5E] font-bold">Status</p>
                          <p
                            className={`font-semibold ${
                              drive.isActive
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {drive.isActive ? 'Active' : 'Closed'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApply(drive._id)}
                      disabled={hasApplied(drive._id) || !drive.isActive}
                      className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
                        hasApplied(drive._id)
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : drive.isActive
                          ? 'bg-[#B08B5E] text-white hover:bg-[#7B4F1D]'
                          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      {hasApplied(drive._id)
                        ? 'Applied'
                        : drive.isActive
                        ? 'Apply Now'
                        : 'Closed'}
                    </button>

                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl">
                <p className="text-gray-500 text-lg">
                  No drives available at the moment
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}