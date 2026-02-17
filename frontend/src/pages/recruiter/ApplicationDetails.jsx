import React, { useState, useEffect } from 'react';
import RecruiterLayout from '../../layouts/RecruiterLayout';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../../components/common/Loader';

export default function ApplicationDetails() {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const res = await axiosInstance.get(`/applications/${id}`);
      setApplication(res.data);
      setNewStatus(res.data.status);
    } catch (err) {
      setError('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (newStatus === application.status) {
      setError('Please select a different status');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await axiosInstance.put(`/applications/${id}/status`, { status: newStatus });
      
      setSuccess('Status updated successfully!');
      fetchApplication();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setSaving(false);
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
    'On Hold': 'bg-gray-100 text-gray-800',
  };

  const statuses = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Interviewed', 'Selected', 'Rejected', 'On Hold'];

  return (
    <RecruiterLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-6 font-[Montserrat]">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-[#B08B5E] hover:text-[#7B4F1D] font-semibold flex items-center gap-2 transition-all"
          >
            ← Back
          </button>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-600 font-semibold">{success}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* MAIN CONTENT */}
            <div className="lg:col-span-2">
              {/* JOB & COMPANY HEADER */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-[#7B4F1D] mb-2">
                      {application.drive?.jobRole}
                    </h1>
                    <p className="text-[#B08B5E] text-lg font-semibold">
                      {application.company?.name}
                    </p>
                  </div>
                  <span className={`px-6 py-3 rounded-full text-lg font-bold whitespace-nowrap ${statusColors[application.status]}`}>
                    {application.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#F8EFE2] rounded-xl">
                  <div>
                    <p className="text-[#B08B5E] font-bold text-sm">Location</p>
                    <p className="text-gray-700 font-semibold">{application.drive?.location}</p>
                  </div>
                  <div>
                    <p className="text-[#B08B5E] font-bold text-sm">Vacancies</p>
                    <p className="text-gray-700 font-semibold">{application.drive?.vacancies}</p>
                  </div>
                  <div>
                    <p className="text-[#B08B5E] font-bold text-sm">Package</p>
                    <p className="text-gray-700 font-semibold">{application.drive?.package || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[#B08B5E] font-bold text-sm">Applied On</p>
                    <p className="text-gray-700 font-semibold">{new Date(application.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* JOB DESCRIPTION */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-[#7B4F1D] mb-4">Job Details</h2>
                
                <div className="mb-6">
                  <h3 className="font-bold text-[#B08B5E] mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{application.drive?.description}</p>
                </div>

                <div>
                  <h3 className="font-bold text-[#B08B5E] mb-2">Qualifications Required</h3>
                  <p className="text-gray-700 leading-relaxed">{application.drive?.qualification}</p>
                </div>
              </div>
            </div>

            {/* SIDEBAR - STUDENT PROFILE & STATUS */}
            <div className="lg:col-span-1">
              {/* STUDENT PROFILE */}
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                <h2 className="text-xl font-bold text-[#7B4F1D] mb-4">Student Profile</h2>
                
                <div className="flex flex-col items-center mb-6">
                  {application.student?.profile?.image?.url ? (
                    <img
                      src={application.student.profile.image.url}
                      alt={application.student?.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-[#B08B5E] mb-3"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-[#B08B5E] text-white rounded-full flex items-center justify-center text-3xl font-bold mb-3">
                      {application.student?.name?.charAt(0)}
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-[#7B4F1D] text-center">{application.student?.name}</h3>
                </div>

                <div className="space-y-4 mb-6 border-t border-gray-200 pt-4">
                  <div>
                    <p className="text-[#B08B5E] font-bold text-sm">Email</p>
                    <p className="text-gray-700 break-all">{application.student?.email}</p>
                  </div>
                  <div>
                    <p className="text-[#B08B5E] font-bold text-sm">Phone</p>
                    <p className="text-gray-700">{application.student?.profile?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-[#B08B5E] font-bold text-sm">Roll Number</p>
                    <p className="text-gray-700">{application.student?.profile?.rollNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-[#B08B5E] font-bold text-sm">Registration ID</p>
                    <p className="text-gray-700">{application.student?.profile?.registrationId || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-[#B08B5E] font-bold text-sm">College</p>
                    <p className="text-gray-700">{application.student?.profile?.college || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-[#B08B5E] font-bold text-sm">Year</p>
                    <p className="text-gray-700">Year {application.student?.profile?.year || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[#B08B5E] font-bold text-sm">Course</p>
                    <p className="text-gray-700">{application.student?.profile?.course || 'Not provided'}</p>
                  </div>
                </div>

                {/* SKILLS */}
                {application.student?.profile?.skills && application.student.profile.skills.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <p className="text-[#B08B5E] font-bold text-sm mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {application.student.profile.skills.map((skill, idx) => (
                        <span key={idx} className="bg-[#F8EFE2] text-[#7B4F1D] px-3 py-1 rounded-full text-xs font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* RESUME DOWNLOAD */}
                {application.student?.profile?.resume?.url ? (
                  <a
                    href={application.student.profile.resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block text-center px-4 py-3 bg-[#B08B5E] text-white rounded-xl hover:bg-[#7B4F1D] transition-all font-bold mb-4"
                  >
                    📄 Download Resume
                  </a>
                ) : (
                  <div className="w-full text-center px-4 py-3 bg-gray-200 text-gray-600 rounded-xl font-bold mb-4">
                    📄 No Resume
                  </div>
                )}

                <a
  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${application.student?.email}`}
  target="_blank"
  rel="noopener noreferrer"
  className="w-full text-center px-4 py-3 bg-[#F8EFE2] text-[#7B4F1D] rounded-xl hover:bg-[#B08B5E] hover:text-white transition-all font-bold"
>
  ✉️ Contact via Gmail
</a>
              </div>

              {/* STATUS UPDATE */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-[#7B4F1D] mb-4">Update Status</h2>
                
                <div className="mb-4">
                  <label className="block text-[#B08B5E] font-bold text-sm mb-2">Select New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleStatusUpdate}
                  disabled={saving || newStatus === application.status}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    saving || newStatus === application.status
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-[#B08B5E] text-white hover:bg-[#7B4F1D]'
                  }`}
                >
                  {saving ? 'Updating...' : 'Update Status'}
                </button>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  Current: <span className="font-bold text-[#B08B5E]">{application.status}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}
