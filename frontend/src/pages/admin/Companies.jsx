import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../../components/common/Loader';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [recruiters, setRecruiters] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedRecruiterId, setSelectedRecruiterId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    email: '',
    website: '',
    about: '',
    description: '',
  });

  useEffect(() => {
    fetchCompanies();
    fetchRecruiters();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axiosInstance.get('/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecruiters = async () => {
    try {
      const res = await axiosInstance.get('/students/recruiters/list');
      const recruiterUsers = res.data.filter(user => user.role === 'recruiter');
      setRecruiters(recruiterUsers);
    } catch (err) {
      console.error('Failed to fetch recruiters:', err);
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError('Company name is required');
    if (!formData.location.trim()) return setError('Location is required');
    if (!formData.email.trim()) return setError('Email is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return setError('Invalid email format');
    if (!formData.website.trim()) return setError('Website is required');
    if (!formData.about.trim()) return setError('About company is required');

    try {
      await axiosInstance.post('/companies', formData);
      setFormData({ name: '', location: '', email: '', website: '', about: '', description: '' });
      setShowForm(false);
      setError('');
      fetchCompanies();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add company');
    }
  };

  const handleDelete = async (id) => {
    const confirmText = window.prompt('Type "delete" to confirm company removal');
    if (confirmText !== 'delete') {
      alert('Deletion cancelled');
      return;
    }
    try {
      await axiosInstance.delete(`/companies/${id}`);
      fetchCompanies();
    } catch (err) {
      console.error(err);
      alert('Failed to delete company');
    }
  };

  const handleAssignRecruiter = async (companyId) => {
    if (!selectedRecruiterId) {
      setError('Please select a recruiter');
      return;
    }
    try {
      await axiosInstance.post(`/companies/${companyId}/assign-recruiter`, {
        recruiterId: selectedRecruiterId,
      });
      setSelectedRecruiterId('');
      setSelectedCompanyId(null);
      setError('');
      fetchCompanies();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign recruiter');
    }
  };

  const handleRemoveRecruiter = async (companyId, recruiterId) => {
    try {
      await axiosInstance.post(`/companies/${companyId}/remove-recruiter`, {
        recruiterId: recruiterId,
      });
      fetchCompanies();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove recruiter');
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <AdminLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-4 sm:p-6 font-[Montserrat]">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#7B4F1D]">
              Companies
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full sm:w-auto px-6 py-3 bg-[#B08B5E] text-white rounded-xl hover:bg-[#7B4F1D] transition-all font-bold shadow-md active:scale-95"
            >
              {showForm ? '✕ Cancel' : '+ Add Company'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-pulse">
              <p className="text-red-600 text-sm sm:text-base font-semibold">{error}</p>
            </div>
          )}

          {/* ADD COMPANY FORM */}
          {showForm && (
            <form
              onSubmit={handleAddCompany}
              className="mb-8 bg-white rounded-2xl p-5 sm:p-8 shadow-xl border border-[#EADCC8]"
            >
              <h2 className="text-xl font-bold text-[#7B4F1D] mb-4">New Company Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#B08B5E] ml-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Avani Enterprises"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-4 py-3 border border-[#B08B5E] rounded-xl focus:ring-2 focus:ring-[#7B4F1D] outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#B08B5E] ml-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. New Delhi, India"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="px-4 py-3 border border-[#B08B5E] rounded-xl focus:ring-2 focus:ring-[#7B4F1D] outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#B08B5E] ml-1">Contact Email</label>
                  <input
                    type="email"
                    placeholder="contact@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-4 py-3 border border-[#B08B5E] rounded-xl focus:ring-2 focus:ring-[#7B4F1D] outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#B08B5E] ml-1">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://company.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="px-4 py-3 border border-[#B08B5E] rounded-xl focus:ring-2 focus:ring-[#7B4F1D] outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 mb-6">
                <label className="text-xs font-bold text-[#B08B5E] ml-1">About the Company</label>
                <textarea
                  placeholder="Provide a brief overview..."
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-[#B08B5E] rounded-xl focus:ring-2 focus:ring-[#7B4F1D] outline-none transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-10 py-3 bg-[#7B4F1D] text-white rounded-xl hover:bg-[#5A3915] font-bold shadow-lg transition-colors"
              >
                Save Company
              </button>
            </form>
          )}

          {/* SEARCH BAR */}
          <div className="relative mb-8">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#B08B5E]">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by company name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-[#B08B5E] rounded-2xl shadow-sm focus:ring-2 focus:ring-[#B08B5E] outline-none transition-all"
            />
          </div>

          {/* COMPANY CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <div
                  key={company._id}
                  className="flex flex-col bg-white rounded-2xl p-5 shadow-md border border-[#EADCC8] hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-[#7B4F1D] truncate pr-2">
                      {company.name}
                    </h3>
                    <button
                      onClick={() => handleDelete(company._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete Company"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="space-y-2 mb-4 flex-grow">
                    <p className="text-sm flex items-center gap-2 text-gray-600">
                      <span className="grayscale">📍</span> {company.location}
                    </p>
                    <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
                      {company.about}
                    </p>
                    <div className="pt-2 space-y-1 text-xs sm:text-sm border-t border-gray-50">
                      <p className="truncate text-[#B08B5E]">✉️ {company.email}</p>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate block text-blue-600 hover:underline font-medium"
                      >
                        🌐 {company.website}
                      </a>
                    </div>
                  </div>

                  {/* RECRUITER MANAGEMENT SECTION */}
                  <div className="mt-auto border-t border-[#F8EFE2] pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#B08B5E]">
                        Recruiters ({company.recruiters?.length || 0})
                      </span>
                    </div>

                    {company.recruiters && company.recruiters.length > 0 && (
                      <div className="mb-4 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                        <div className="flex flex-wrap gap-2">
                          {company.recruiters.map((recruiter) => (
                            <div
                              key={recruiter._id}
                              className="flex items-center gap-2 bg-[#F8EFE2] pl-3 pr-1 py-1 rounded-full border border-[#EADCC8]"
                            >
                              <span className="text-[11px] font-semibold text-[#7B4F1D] truncate max-w-[100px]">
                                {recruiter.name}
                              </span>
                              <button
                                onClick={() => handleRemoveRecruiter(company._id, recruiter._id)}
                                className="w-5 h-5 flex items-center justify-center bg-white text-orange-600 rounded-full hover:bg-red-500 hover:text-white transition-all text-[10px]"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedCompanyId(selectedCompanyId === company._id ? null : company._id)}
                      className={`w-full px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        selectedCompanyId === company._id 
                        ? 'bg-gray-100 text-gray-600' 
                        : 'bg-[#B08B5E]/10 text-[#7B4F1D] hover:bg-[#B08B5E] hover:text-white'
                      }`}
                    >
                      {selectedCompanyId === company._id ? 'Close' : '+ Assign Recruiter'}
                    </button>

                    {selectedCompanyId === company._id && (
                      <div className="mt-3 p-3 bg-[#F8EFE2] rounded-xl border border-[#EADCC8] animate-fadeIn">
                        <select
                          value={selectedRecruiterId}
                          onChange={(e) => setSelectedRecruiterId(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#B08B5E] rounded-lg mb-2 text-sm outline-none"
                        >
                          <option value="">Choose Recruiter...</option>
                          {recruiters.map((recruiter) => (
                            <option key={recruiter._id} value={recruiter._id}>
                              {recruiter.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssignRecruiter(company._id)}
                          disabled={!selectedRecruiterId}
                          className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-bold transition-colors disabled:opacity-50"
                        >
                          Confirm Assignment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#B08B5E]">
                <span className="text-5xl mb-4 opacity-30">🏢</span>
                <p className="text-lg font-medium">No companies found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F8EFE2;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #B08B5E;
          border-radius: 10px;
        }
      `}</style>
    </AdminLayout>
  );
}