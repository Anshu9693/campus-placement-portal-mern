import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../../components/common/Loader';

export default function Drives() {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    jobRole: '',
    description: '',
    qualification: '',
    vacancies: '',
    location: '',
    package: '',
    deadline: '',
    rounds: 1,
  });

  useEffect(() => {
    fetchDrives();
    fetchCompanies();
    const savedScrollPosition = sessionStorage.getItem('drivesScrollPosition');
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
      sessionStorage.removeItem('drivesScrollPosition');
    }
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await axiosInstance.get('/drives');
      setDrives(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load placement drives');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axiosInstance.get('/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    }
  };

  const handleCreateOrUpdateDrive = async (e) => {
    e.preventDefault();
    try {
      const driveData = {
        ...formData,
        vacancies: formData.vacancies ? Number(formData.vacancies) : 0,
        rounds: formData.rounds ? Number(formData.rounds) : 1,
      };

      if (editingId) {
        await axiosInstance.put(`/drives/${editingId}`, driveData);
      } else {
        await axiosInstance.post('/drives', driveData);
      }

      resetForm();
      fetchDrives();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save drive');
    }
  };

  const resetForm = () => {
    setFormData({
      company: '', jobRole: '', description: '', qualification: '',
      vacancies: '', location: '', package: '', deadline: '', rounds: 1,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEditDrive = (drive) => {
    sessionStorage.setItem('drivesScrollPosition', window.scrollY);
    setFormData({
      company: drive.company?._id || drive.company || '',
      jobRole: drive.jobRole || '',
      description: drive.description || '',
      qualification: drive.qualification || '',
      vacancies: drive.vacancies || '',
      location: drive.location || '',
      package: drive.package || '',
      deadline: drive.deadline?.split('T')[0] || '',
      rounds: drive.rounds || 1,
    });
    setEditingId(drive._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteDrive = async (id) => {
    if (window.confirm('Are you sure you want to delete this drive?')) {
      try {
        await axiosInstance.delete(`/drives/${id}`);
        fetchDrives();
      } catch (err) {
        setError('Failed to delete drive');
      }
    }
  };

  const handleToggleDrive = async (driveId, isActive) => {
    try {
      await axiosInstance.put(`/drives/${driveId}`, { isActive: !isActive });
      fetchDrives();
    } catch (err) {
      setError('Failed to update drive status');
    }
  };

  const filteredDrives = drives.filter((d) =>
    d.jobRole?.toLowerCase().includes(search.toLowerCase()) ||
    d.company?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-4 sm:p-8 font-[Montserrat]">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#7B4F1D]">Placement Drives</h1>
              <p className="text-[#B08B5E] font-medium">Manage and monitor active recruitment cycles</p>
            </div>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="w-full sm:w-auto px-8 py-3 bg-[#B08B5E] text-white rounded-2xl hover:bg-[#7B4F1D] transition-all font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <span className="text-xl">+</span> Add New Drive
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-r-xl flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError('')} className="font-bold">✕</button>
            </div>
          )}

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-[#3d2a15]/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
              <form
                onSubmit={handleCreateOrUpdateDrive}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-[#7B4F1D]">
                    {editingId ? 'Edit Drive Details' : 'Launch New Drive'}
                  </h2>
                  <button type="button" onClick={resetForm} className="text-gray-400 hover:text-red-500 text-xl">✕</button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#7B4F1D] uppercase ml-1">Company</label>
                    <select
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      required
                      className="px-4 py-3 bg-[#F8EFE2]/50 border border-[#B08B5E]/30 rounded-xl outline-none focus:ring-2 focus:ring-[#B08B5E]"
                    >
                      <option value="">Select Company</option>
                      {companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#7B4F1D] uppercase ml-1">Job Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Software Engineer"
                      value={formData.jobRole}
                      onChange={(e) => setFormData({...formData, jobRole: e.target.value})}
                      required
                      className="px-4 py-3 bg-[#F8EFE2]/50 border border-[#B08B5E]/30 rounded-xl outline-none focus:ring-2 focus:ring-[#B08B5E]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#7B4F1D] uppercase ml-1">Location</label>
                    <input
                      type="text"
                      placeholder="Remote / Bangalore"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="px-4 py-3 bg-[#F8EFE2]/50 border border-[#B08B5E]/30 rounded-xl outline-none focus:ring-2 focus:ring-[#B08B5E]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#7B4F1D] uppercase ml-1">Salary Package</label>
                    <input
                      type="text"
                      placeholder="e.g. 12 LPA"
                      value={formData.package}
                      onChange={(e) => setFormData({...formData, package: e.target.value})}
                      className="px-4 py-3 bg-[#F8EFE2]/50 border border-[#B08B5E]/30 rounded-xl outline-none focus:ring-2 focus:ring-[#B08B5E]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#7B4F1D] uppercase ml-1">Application Deadline</label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      required
                      className="px-4 py-3 bg-[#F8EFE2]/50 border border-[#B08B5E]/30 rounded-xl outline-none focus:ring-2 focus:ring-[#B08B5E]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#7B4F1D] uppercase ml-1">Vacancies</label>
                    <input
                      type="number"
                      value={formData.vacancies}
                      onChange={(e) => setFormData({...formData, vacancies: e.target.value})}
                      className="px-4 py-3 bg-[#F8EFE2]/50 border border-[#B08B5E]/30 rounded-xl outline-none focus:ring-2 focus:ring-[#B08B5E]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 mb-5">
                  <label className="text-xs font-bold text-[#7B4F1D] uppercase ml-1">Job Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    className="px-4 py-3 bg-[#F8EFE2]/50 border border-[#B08B5E]/30 rounded-xl outline-none focus:ring-2 focus:ring-[#B08B5E]"
                  />
                </div>

                <div className="flex flex-col gap-1 mb-8">
                  <label className="text-xs font-bold text-[#7B4F1D] uppercase ml-1">Qualifications</label>
                  <textarea
                    rows={2}
                    value={formData.qualification}
                    onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                    required
                    className="px-4 py-3 bg-[#F8EFE2]/50 border border-[#B08B5E]/30 rounded-xl outline-none focus:ring-2 focus:ring-[#B08B5E]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#7B4F1D] text-white rounded-2xl font-black text-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95"
                >
                  {editingId ? 'Update Drive' : 'Publish Drive'}
                </button>
              </form>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative mb-8 group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl group-focus-within:scale-110 transition-transform">🔍</span>
            <input
              type="text"
              placeholder="Filter by job role or company name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border-2 border-[#EADCC8] rounded-2xl focus:border-[#B08B5E] outline-none shadow-sm transition-all text-lg"
            />
          </div>

          {/* Drives List */}
          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredDrives.length > 0 ? (
                filteredDrives.map((drive) => (
                  <div
                    key={drive._id}
                    className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl border border-[#EADCC8]/50 transition-all flex flex-col md:flex-row gap-6 items-start"
                  >
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black text-[#7B4F1D]">{drive.jobRole}</h3>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${drive.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {drive.isActive ? 'Live' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-[#B08B5E] mb-4">{drive.company?.name}</p>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-[#F8EFE2]/50 p-3 rounded-2xl">
                          <p className="text-[10px] uppercase font-bold text-[#7B4F1D]/60 mb-1">📍 Location</p>
                          <p className="font-bold text-gray-700 truncate">{drive.location || 'Not Specified'}</p>
                        </div>
                        <div className="bg-[#F8EFE2]/50 p-3 rounded-2xl">
                          <p className="text-[10px] uppercase font-bold text-[#7B4F1D]/60 mb-1">💼 Package</p>
                          <p className="font-bold text-gray-700">{drive.package || 'N/A'}</p>
                        </div>
                        <div className="bg-[#F8EFE2]/50 p-3 rounded-2xl">
                          <p className="text-[10px] uppercase font-bold text-[#7B4F1D]/60 mb-1">👥 Vacancies</p>
                          <p className="font-bold text-gray-700">{drive.vacancies || '0'}</p>
                        </div>
                        <div className="bg-[#F8EFE2]/50 p-3 rounded-2xl">
                          <p className="text-[10px] uppercase font-bold text-[#7B4F1D]/60 mb-1">⏰ Deadline</p>
                          <p className="font-bold text-gray-700">{new Date(drive.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-6 flex flex-wrap gap-3">
                        <button
                          onClick={() => handleToggleDrive(drive._id, drive.isActive)}
                          className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold transition-all ${
                            drive.isActive 
                              ? 'bg-green-600 text-white hover:bg-green-700' 
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {drive.isActive ? '✓ Active' : '○ Disabled'}
                        </button>
                        <button
                          onClick={() => handleEditDrive(drive)}
                          className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDrive(drive._id)}
                          className="flex-1 sm:flex-none px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-[#EADCC8]">
                  <p className="text-gray-400 text-xl font-medium italic">No placement drives found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}