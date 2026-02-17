import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../../components/common/Loader';

export default function Recruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const res = await axiosInstance.get('/students/recruiters/list');
      console.log('API Response:', res.data); // Log the API response
      setRecruiters(res.data);
      setError('');
    } catch (err) {
      console.error('Error loading recruiters:', err);
      setError('Failed to load recruiters');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecruiter = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) return setError('Name is required');
    if (!formData.email.trim()) return setError('Email is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return setError('Invalid email format');
    if (formData.password.length < 6)
      return setError('Password must be at least 6 characters');

    try {
      await axiosInstance.post('/auth/create-recruiter', formData);

      setFormData({
        name: '',
        email: '',
        password: '',
      });
      setShowForm(false);
      setError('');
      fetchRecruiters();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create recruiter');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredRecruiters = recruiters.filter((recruiter) =>
    recruiter.name?.toLowerCase().includes(search.toLowerCase()) ||
    recruiter.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <AdminLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-6 font-[Montserrat]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-[#7B4F1D]">
              Recruiters
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-[#B08B5E] text-white rounded-xl hover:bg-[#7B4F1D] transition-all font-bold"
            >
              {showForm ? '✕ Close' : '+ Create Recruiter'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* CREATE RECRUITER FORM */}
          {showForm && (
            <form
              onSubmit={handleCreateRecruiter}
              className="mb-8 bg-white rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-[#7B4F1D] mb-6">
                Create New Recruiter
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-[#7B4F1D] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., John Doe"
                    required
                    className="w-full px-4 py-3 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#7B4F1D] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="recruiter@company.com"
                    required
                    className="w-full px-4 py-3 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#7B4F1D] mb-2">
                    Password (min 6 chars) *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#B08B5E] text-white rounded-xl hover:bg-[#7B4F1D] transition-all font-bold"
                >
                  Create Recruiter
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-all font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* SEARCH */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
            />
          </div>

          {/* RECRUITERS TABLE */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#7B4F1D] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Name</th>
                    <th className="px-6 py-4 text-left font-bold">Email</th>
                    <th className="px-6 py-4 text-left font-bold">Status</th>
                    <th className="px-6 py-4 text-left font-bold">Created Date</th>
                    <th className="px-6 py-4 text-left font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecruiters.length > 0 ? (
                    filteredRecruiters.map((recruiter) => (
                      <tr key={recruiter._id} className="border-t border-gray-200 hover:bg-[#F8EFE2] transition-colors">
                        <td className="px-6 py-4 font-semibold text-[#7B4F1D]">
                          {recruiter.name}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{recruiter.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-bold ${
                              recruiter.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {recruiter.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {new Date(recruiter.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {/* Removed Delete button */}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        No recruiters found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="mt-6 text-right">
            <p className="text-lg font-bold text-[#B08B5E]">
              Total Recruiters: {recruiters.length}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
