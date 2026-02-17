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
      // Filter only recruiters
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

      setFormData({
        name: '',
        location: '',
        email: '',
        website: '',
        about: '',
        description: '',
      });

      setShowForm(false);
      setError('');
      fetchCompanies();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add company');
    }
  };

  // ✅ DELETE FUNCTION
  const handleDelete = async (id) => {
    const confirmText = window.prompt(
      'Type "delete" to confirm company removal'
    );

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

  // ✅ ASSIGN RECRUITER TO COMPANY
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

  // ✅ REMOVE RECRUITER FROM COMPANY
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
      <div className="bg-[#F8EFE2] min-h-screen p-6 font-[Montserrat]">
        <div className="max-w-7xl mx-auto">

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-[#7B4F1D]">
              Companies
            </h1>

            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-[#B08B5E] text-white rounded-xl hover:bg-[#7B4F1D] transition-all font-bold"
            >
              + Add Company
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* FORM */}
          {showForm && (
            <form
              onSubmit={handleAddCompany}
              className="mb-8 bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Company Name *"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="px-4 py-3 border border-[#B08B5E] rounded-xl"
                />

                <input
                  type="text"
                  placeholder="Location *"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                  className="px-4 py-3 border border-[#B08B5E] rounded-xl"
                />

                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="px-4 py-3 border border-[#B08B5E] rounded-xl"
                />

                <input
                  type="url"
                  placeholder="Website *"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  required
                  className="px-4 py-3 border border-[#B08B5E] rounded-xl"
                />
              </div>

              <textarea
                placeholder="About Company *"
                value={formData.about}
                onChange={(e) =>
                  setFormData({ ...formData, about: e.target.value })
                }
                required
                rows={3}
                className="w-full px-4 py-3 border border-[#B08B5E] rounded-xl mb-4"
              />

              <button
                type="submit"
                className="px-6 py-3 bg-[#B08B5E] text-white rounded-xl hover:bg-[#7B4F1D] font-bold"
              >
                Save Company
              </button>
            </form>
          )}

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-6 px-4 py-3 border border-[#B08B5E] rounded-xl"
          />

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <div
                  key={company._id}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold text-[#7B4F1D] mb-2">
                    {company.name}
                  </h3>

                  <p className="text-sm mb-2">📍 {company.location}</p>

                  <p className="text-gray-700 text-sm mb-3">
                    {company.about}
                  </p>

                  <div className="text-sm text-gray-600 mb-3 space-y-1">
                    <p>✉️ {company.email}</p>

                    <p className="break-words">
                      🌐{' '}
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline break-words"
                      >
                        {company.website}
                      </a>
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t pt-3 mb-4">
                    <span className="text-sm font-semibold text-[#B08B5E]">
                      Recruiters: {company.recruiters?.length || 0}
                    </span>

                    <button
                      onClick={() => handleDelete(company._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>

                  {/* MANAGE RECRUITERS */}
                  <div className="border-t pt-4">
                    {company.recruiters && company.recruiters.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-bold text-[#7B4F1D] mb-2">Assigned Recruiters:</p>
                        <div className="space-y-2">
                          {company.recruiters.map((recruiter) => (
                            <div
                              key={recruiter._id}
                              className="flex justify-between items-center bg-[#F8EFE2] p-2 rounded-lg"
                            >
                              <span className="text-sm">{recruiter.name} ({recruiter.email})</span>
                              <button
                                onClick={() => handleRemoveRecruiter(company._id, recruiter._id)}
                                className="px-3 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-700"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedCompanyId(selectedCompanyId === company._id ? null : company._id)}
                      className="w-full px-3 py-2 bg-[#B08B5E] text-white rounded-lg hover:bg-[#7B4F1D] text-sm font-bold"
                    >
                      {selectedCompanyId === company._id ? '✕ Close' : '+ Assign Recruiter'}
                    </button>

                    {selectedCompanyId === company._id && (
                      <div className="mt-3 p-3 bg-[#F8EFE2] rounded-lg">
                        <select
                          value={selectedRecruiterId}
                          onChange={(e) => setSelectedRecruiterId(e.target.value)}
                          className="w-full px-3 py-2 border border-[#B08B5E] rounded-lg mb-2 text-sm"
                        >
                          <option value="">Select a recruiter...</option>
                          {recruiters.map((recruiter) => (
                            <option key={recruiter._id} value={recruiter._id}>
                              {recruiter.name} ({recruiter.email})
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssignRecruiter(company._id)}
                          className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-bold"
                        >
                          Assign Recruiter
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No companies found.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}