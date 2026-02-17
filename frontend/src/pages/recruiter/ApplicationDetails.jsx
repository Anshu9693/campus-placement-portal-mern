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
    if (newStatus === application.status) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await axiosInstance.put(`/applications/${id}/status`, { status: newStatus });
      setSuccess('Candidate status updated successfully!');
      fetchApplication();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (!application) return <div className="text-center py-20 font-bold text-[#7B4F1D]">Application not found</div>;

  const statusColors = {
    Applied: 'bg-blue-50 text-blue-700 border-blue-200',
    Shortlisted: 'bg-purple-50 text-purple-700 border-purple-200',
    'Interview Scheduled': 'bg-orange-50 text-orange-700 border-orange-200',
    Interviewed: 'bg-amber-50 text-amber-700 border-amber-200',
    Selected: 'bg-green-50 text-green-700 border-green-200',
    Rejected: 'bg-red-50 text-red-700 border-red-200',
    'On Hold': 'bg-gray-50 text-gray-700 border-gray-200',
  };

  const statuses = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Interviewed', 'Selected', 'Rejected', 'On Hold'];

  return (
    <RecruiterLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-4 sm:p-8 font-[Montserrat]">
        <div className="max-w-6xl mx-auto">
          
          {/* Top Navigation */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-white rounded-xl text-[#B08B5E] hover:text-[#7B4F1D] font-bold shadow-sm transition-all flex items-center gap-2"
            >
              ← Back to List
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-[#B08B5E] uppercase tracking-widest">Application ID</p>
              <p className="text-sm font-mono text-gray-500">{id}</p>
            </div>
          </div>

          {/* Feedback Toasts */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-r-xl animate-bounce">
              <p className="font-bold">Error: {error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-r-xl animate-pulse">
              <p className="font-bold">✨ {success}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Job & Experience Details */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Header Card */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#EADCC8]/50">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-[#7B4F1D] leading-tight">
                      {application.drive?.jobRole}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xl">🏢</span>
                      <p className="text-[#B08B5E] text-lg font-black uppercase tracking-tighter">
                        {application.company?.name}
                      </p>
                    </div>
                  </div>
                  <div className={`px-6 py-3 rounded-2xl border-2 text-center ${statusColors[application.status]}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Current Status</p>
                    <p className="text-lg font-black">{application.status}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                  {[
                    { label: 'Location', val: application.drive?.location, icon: '📍' },
                    { label: 'Vacancies', val: application.drive?.vacancies, icon: '👥' },
                    { label: 'Package', val: application.drive?.package, icon: '💰' },
                    { label: 'Applied On', val: new Date(application.createdAt).toLocaleDateString(), icon: '📅' },
                  ].map((item, i) => (
                    <div key={i} className="bg-[#F8EFE2]/50 p-4 rounded-2xl border border-[#EADCC8]/30">
                      <p className="text-[10px] font-black text-[#B08B5E] uppercase mb-1">{item.label}</p>
                      <p className="text-gray-800 font-bold truncate">{item.val || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements & Description */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm">
                <h2 className="text-2xl font-black text-[#7B4F1D] mb-6 flex items-center gap-3">
                  <span className="bg-[#F8EFE2] p-2 rounded-lg text-lg">📝</span> Job Description
                </h2>
                <div className="prose prose-brown max-w-none text-gray-700 font-medium leading-relaxed">
                  <div className="mb-8">
                    <h3 className="text-[#B08B5E] font-black uppercase text-sm mb-3 tracking-widest">About the Role</h3>
                    <p>{application.drive?.description}</p>
                  </div>
                  <div>
                    <h3 className="text-[#B08B5E] font-black uppercase text-sm mb-3 tracking-widest">Eligibility Criteria</h3>
                    <p className="bg-gray-50 p-4 rounded-xl border-l-4 border-[#B08B5E]">{application.drive?.qualification}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Candidate Profile & Decision */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Candidate Info Card */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-t-8 border-[#7B4F1D]">
                <div className="flex flex-col items-center mb-8">
                  <div className="relative group">
                    {application.student?.profile?.image?.url ? (
                      <img
                        src={application.student.profile.image.url}
                        alt="Profile"
                        className="w-32 h-32 rounded-[2rem] object-cover shadow-lg border-4 border-white transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-[#7B4F1D] text-white rounded-[2rem] flex items-center justify-center text-5xl font-black shadow-lg">
                        {application.student?.name?.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white shadow-sm"></div>
                  </div>
                  <h3 className="mt-6 text-2xl font-black text-[#7B4F1D] text-center">{application.student?.name}</h3>
                  <p className="text-[#B08B5E] font-bold text-sm uppercase tracking-widest">{application.student?.profile?.course}</p>
                </div>

                <div className="space-y-5 py-6 border-y border-gray-100">
                  {[
                    { label: 'Email Address', val: application.student?.email, sub: 'Primary Contact' },
                    { label: 'Mobile Number', val: application.student?.profile?.phone },
                    { label: 'Roll & Reg ID', val: `${application.student?.profile?.rollNumber || '-'} / ${application.student?.profile?.registrationId || '-'}` },
                    { label: 'Academic Year', val: `Year ${application.student?.profile?.year || 'N/A'}` },
                  ].map((info, i) => (
                    <div key={i}>
                      <p className="text-[10px] font-black text-[#B08B5E] uppercase">{info.label}</p>
                      <p className="text-gray-800 font-bold break-all">{info.val || 'Not Provided'}</p>
                    </div>
                  ))}
                </div>

                {/* Candidate Skills */}
                <div className="mt-6 mb-8">
                  <p className="text-[10px] font-black text-[#B08B5E] uppercase mb-3">Professional Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {application.student?.profile?.skills?.map((skill, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                        {skill}
                      </span>
                    )) || <span className="text-gray-400 text-xs italic">No skills listed</span>}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {application.student?.profile?.resume?.url ? (
                    <a
                      href={application.student.profile.resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-4 bg-[#7B4F1D] text-white rounded-2xl hover:bg-[#5a3a15] transition-all font-black shadow-lg shadow-brown-200"
                    >
                      📄 View Resume
                    </a>
                  ) : (
                    <div className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl text-center font-black cursor-not-allowed">
                      🚫 No Resume Uploaded
                    </div>
                  )}
                  
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${application.student?.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white text-[#7B4F1D] border-2 border-[#7B4F1D] rounded-2xl hover:bg-[#F8EFE2] transition-all font-black"
                  >
                    ✉️ Contact via Email
                  </a>
                </div>
              </div>

              {/* Status Update Card */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#EADCC8]">
                <h2 className="text-xl font-black text-[#7B4F1D] mb-6">Decision Center</h2>
                
                <div className="space-y-4">
                  <div className="relative">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full appearance-none px-5 py-4 bg-[#F8EFE2] rounded-2xl border-none focus:ring-2 focus:ring-[#B08B5E] font-black text-[#7B4F1D] cursor-pointer"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#B08B5E]">▼</div>
                  </div>

                  <button
                    onClick={handleStatusUpdate}
                    disabled={saving || newStatus === application.status}
                    className={`w-full py-4 rounded-2xl font-black transition-all shadow-md ${
                      saving || newStatus === application.status
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#B08B5E] text-white hover:bg-[#7B4F1D] active:scale-95'
                    }`}
                  >
                    {saving ? 'Processing...' : 'Confirm Status Change'}
                  </button>
                  
                  <div className="text-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Audit Trail: Last change detected just now</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}