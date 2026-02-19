import React, { useState, useEffect, useContext } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../../components/common/Loader';
import { AuthContext } from '../../context/AuthContext';

export default function Recruiters() {
  const authContextValue = useContext(AuthContext);
  const user = authContextValue?.user;
  const isAdmin = user?.role === 'admin';
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

    if (!isAdmin) return setError('Only admin can create recruiters');
    if (!formData.name.trim()) return setError('Name is required');
    if (!formData.email.trim()) return setError('Email is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return setError('Invalid email format');
    if (formData.password.length < 6)
      return setError('Password must be at least 6 characters');

    try {
      await axiosInstance.post('/auth/create-recruiter', formData);
      setFormData({ name: '', email: '', password: '' });
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

  const handleDeleteRecruiter = async (recruiter) => {
    if (!isAdmin) return setError('Only admin can delete recruiters');

    const confirmation = window.prompt(
      `To delete recruiter "${recruiter.name}", type DELETE`
    );

    if (confirmation === null) return;
    if (confirmation.trim().toUpperCase() !== 'DELETE') {
      return setError('Delete cancelled: please type DELETE to confirm');
    }

    try {
      await axiosInstance.delete(`/students/recruiters/${recruiter._id}`);
      setError('');
      fetchRecruiters();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete recruiter');
    }
  };

  const filteredRecruiters = recruiters.filter((recruiter) =>
    recruiter.name?.toLowerCase().includes(search.toLowerCase()) ||
    recruiter.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <AdminLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-4 sm:p-6 font-[Montserrat]">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#7B4F1D]">
              Recruiters
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full sm:w-auto px-6 py-3 bg-[#B08B5E] text-white rounded-xl hover:bg-[#7B4F1D] transition-all font-bold shadow-md active:scale-95"
            >
              {showForm ? '✕ Close Form' : '+ Create Recruiter'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          )}

          {/* CREATE RECRUITER FORM */}
          {showForm && (
            <form
              onSubmit={handleCreateRecruiter}
              className="mb-8 bg-white rounded-2xl p-5 sm:p-8 shadow-lg border border-[#EADCC8] animate-in fade-in slide-in-from-top-4 duration-300"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-[#7B4F1D] mb-6">
                Create New Recruiter
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
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
                    className="w-full px-4 py-3 border border-[#B08B5E] rounded-xl focus:ring-2 focus:ring-[#B08B5E] outline-none"
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
                    className="w-full px-4 py-3 border border-[#B08B5E] rounded-xl focus:ring-2 focus:ring-[#B08B5E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#7B4F1D] mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-[#B08B5E] rounded-xl focus:ring-2 focus:ring-[#B08B5E] outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-[#B08B5E] text-white rounded-xl hover:bg-[#7B4F1D] transition-all font-bold shadow-sm"
                >
                  Create Recruiter
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-full sm:w-auto px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* SEARCH BAR */}
          <div className="relative mb-6">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#B08B5E]">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-[#B08B5E] rounded-2xl shadow-sm focus:ring-2 focus:ring-[#B08B5E] outline-none"
            />
          </div>

          {/* RECRUITERS DATA - Desktop Table / Mobile Cards */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#EADCC8]">
            {/* Desktop Table (Hidden on small screens) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#7B4F1D] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Name</th>
                    <th className="px-6 py-4 text-left font-bold">Email</th>
                    <th className="px-6 py-4 text-left font-bold">Status</th>
                    <th className="px-6 py-4 text-left font-bold">Joined</th>
                    <th className="px-6 py-4 text-left font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecruiters.length > 0 ? (
                    filteredRecruiters.map((recruiter) => (
                      <tr key={recruiter._id} className="border-t border-gray-100 hover:bg-[#F8EFE2]/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#7B4F1D]">
                          {recruiter.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{recruiter.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                            recruiter.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {recruiter.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {new Date(recruiter.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </td>
                        <td className="px-6 py-4">
                          {isAdmin ? (
                            <button
                              onClick={() => handleDeleteRecruiter(recruiter)}
                              className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-600 hover:text-white transition-all"
                            >
                              Delete
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium italic">
                        No recruiters found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (Hidden on desktop) */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredRecruiters.length > 0 ? (
                filteredRecruiters.map((recruiter) => (
                  <div key={recruiter._id} className="p-5 flex flex-col gap-3 hover:bg-[#F8EFE2]/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-[#7B4F1D] text-lg leading-tight">{recruiter.name}</h3>
                        <p className="text-gray-500 text-sm">{recruiter.email}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        recruiter.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {recruiter.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs font-bold text-[#B08B5E]">Joined:</span>
                      <span className="text-xs text-gray-500 font-medium">
                        {new Date(recruiter.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteRecruiter(recruiter)}
                        className="mt-2 w-full px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-600 hover:text-white transition-all"
                      >
                        Delete Recruiter
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-gray-400">No recruiters found.</div>
              )}
            </div>
          </div>

          {/* FOOTER SUMMARY */}
          <div className="mt-6 flex justify-end">
            <div className="bg-white px-5 py-2 rounded-full border border-[#EADCC8] shadow-sm">
              <p className="text-sm font-bold text-[#7B4F1D]">
                Total Count: <span className="text-[#B08B5E] ml-1">{recruiters.length}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
