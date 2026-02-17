import React, { useState, useEffect } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../../components/common/Loader';

export default function ApplicationDetails() {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const res = await axiosInstance.get(`/applications/${id}`);
      setApplication(res.data);
    } catch (err) {
      setError('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!application) return <div className="text-center p-8">Application not found</div>;

  const statusColors = {
    Applied: 'bg-blue-100 text-blue-800',
    Shortlisted: 'bg-purple-100 text-purple-800',
    'Interview Scheduled': 'bg-orange-100 text-orange-800',
    Interviewed: 'bg-amber-100 text-amber-800',
    Selected: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };

  return (
    <StudentLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-6 font-[Montserrat]">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/student/applications')}
            className="mb-6 text-[#B08B5E] hover:text-[#7B4F1D] font-semibold flex items-center gap-2"
          >
            ← Back to Applications
          </button>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-[#7B4F1D] mb-2">
                  {application.drive?.jobRole}
                </h1>
                <p className="text-[#B08B5E] text-lg font-semibold">
                  {application.company?.name}
                </p>
              </div>
              <span className={`px-6 py-3 rounded-full text-lg font-bold ${statusColors[application.status]}`}>
                {application.status}
              </span>
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-[#F8EFE2] rounded-2xl">
              <div>
                <p className="text-[#B08B5E] font-bold mb-1">Location</p>
                <p className="text-gray-700">{application.drive?.location}</p>
              </div>
              <div>
                <p className="text-[#B08B5E] font-bold mb-1">Vacancies</p>
                <p className="text-gray-700">{application.drive?.vacancies}</p>
              </div>
              <div>
                <p className="text-[#B08B5E] font-bold mb-1">Applied On</p>
                <p className="text-gray-700">{new Date(application.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[#B08B5E] font-bold mb-1">Current Round</p>
                <p className="text-gray-700">{application.currentRound || 'Not Started'}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#7B4F1D] mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed">{application.drive?.description}</p>
            </div>

            {/* Qualification */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#7B4F1D] mb-4">Qualifications Required</h2>
              <p className="text-gray-700 leading-relaxed">{application.drive?.qualification}</p>
            </div>

            {/* Rounds Section */}
            {application.rounds && application.rounds.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#7B4F1D] mb-4">Interview Rounds</h2>
                <div className="space-y-4">
                  {application.rounds.map((round, idx) => (
                    <div key={idx} className="border-l-4 border-[#B08B5E] p-4 bg-[#F8EFE2] rounded-lg">
                      <h3 className="font-bold text-[#7B4F1D] mb-2">{round.name}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-[#B08B5E] font-semibold">Attendance</p>
                          <p>{round.attendance || 'Not Scheduled'}</p>
                        </div>
                        <div>
                          <p className="text-[#B08B5E] font-semibold">Status</p>
                          <p>{round.status || 'Pending'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
