import React, { useState, useEffect } from 'react';
import RecruiterLayout from '../../layouts/RecruiterLayout';
import { Link } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../../components/common/Loader';

export default function MyDrives() {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
    initPageData();
  }, []);

  const getDefaultCompany = (list) => (list.length === 1 ? list[0]._id : '');

  const initPageData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchMyDrives(), fetchMyCompanies()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyDrives = async () => {
    try {
      const res = await axiosInstance.get('/drives/my/drives');
      setDrives(res.data);
      setError('');
    } catch (err) {
      console.error('Error loading drives:', err);
      setError('No drives assigned to your account yet ');
    }
  };

  const fetchMyCompanies = async () => {
    try {
      const res = await axiosInstance.get('/drives/my/companies');
      const recruiterCompanies = res.data || [];
      setCompanies(recruiterCompanies);

      setFormData((prev) => ({
        ...prev,
        company: prev.company || getDefaultCompany(recruiterCompanies),
      }));
    } catch (err) {
      console.error('Error loading companies:', err);
      setError(err.response?.data?.message || 'Failed to load assigned companies');
    }
  };

  const handleCreateOrUpdateDrive = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.jobRole.trim() || !formData.description.trim() || !formData.qualification.trim() || !formData.deadline) {
      setError('Please fill in all required fields');
      return;
    }
    if (!formData.company) {
      setError('Please select a company');
      return;
    }

    try {
      // Convert numeric fields to numbers
      const driveData = {
        ...formData,
        vacancies: formData.vacancies ? Number(formData.vacancies) : 0,
        rounds: formData.rounds ? Number(formData.rounds) : 1,
      };

      if (editingId) {
        // Update existing drive
        await axiosInstance.put(`/drives/${editingId}`, driveData);
      } else {
        // Create new drive
        await axiosInstance.post('/drives', driveData);
      }

      setFormData({
        company: getDefaultCompany(companies),
        jobRole: '',
        description: '',
        qualification: '',
        vacancies: '',
        location: '',
        package: '',
        deadline: '',
        rounds: 1,
      });
      setShowForm(false);
      setEditingId(null);
      setError('');
      fetchMyDrives();
    } catch (err) {
      console.error('Error saving drive:', err);
      setError(err.response?.data?.message || 'Failed to save drive');
    }
  };

  const handleEditDrive = (drive) => {
    setFormData({
      company: drive.company?._id || drive.company || getDefaultCompany(companies),
      jobRole: drive.jobRole,
      description: drive.description,
      qualification: drive.qualification,
      vacancies: drive.vacancies,
      location: drive.location,
      package: drive.package,
      deadline: drive.deadline?.split('T')[0], // Format date for input
      rounds: Array.isArray(drive.rounds) ? drive.rounds.length : (drive.rounds || 1),
    });
    setEditingId(drive._id);
    setShowForm(true);
  };

  const handleDeleteDrive = async (id) => {
    if (window.confirm('Are you sure you want to delete this drive?')) {
      try {
        await axiosInstance.delete(`/drives/${id}`);
        fetchMyDrives();
      } catch (err) {
        console.error('Error deleting drive:', err);
        setError('Failed to delete drive');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <RecruiterLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-6 font-[Montserrat]">
        <div className="max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-[#7B4F1D]">My Drives</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setFormData({
                  company: getDefaultCompany(companies),
                  jobRole: '',
                  description: '',
                  qualification: '',
                  vacancies: '',
                  location: '',
                  package: '',
                  deadline: '',
                  rounds: 1,
                });
              }}
              className="px-6 py-3 bg-[#B08B5E] text-white rounded-xl hover:bg-[#7B4F1D] transition-all font-bold"
            >
              {showForm ? '✕ Close' : '+ Add Drive'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Create/Edit Drive Form */}
          {showForm && (
            <form onSubmit={handleCreateOrUpdateDrive} className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-[#7B4F1D] mb-4">
                {editingId ? 'Edit Drive' : 'Create New Drive'}
              </h2>
              {companies.length === 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  No company is assigned to your account yet. Contact admin to assign at least one company.
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <select
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                  className="px-4 py-3 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
                >
                  <option value="">Select Company *</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Job Role *"
                  value={formData.jobRole}
                  onChange={(e) => setFormData({...formData, jobRole: e.target.value})}
                  required
                  className="px-4 py-3 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="px-4 py-3 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
                />
                <input
                  type="number"
                  placeholder="Vacancies"
                  value={formData.vacancies}
                  onChange={(e) => setFormData({...formData, vacancies: e.target.value})}
                  className="px-4 py-3 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
                />
                <input
                  type="text"
                  placeholder="Package (e.g., 12 LPA)"
                  value={formData.package}
                  onChange={(e) => setFormData({...formData, package: e.target.value})}
                  className="px-4 py-3 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
                />
                <input
                  type="date"
                  placeholder="Deadline *"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  required
                  className="px-4 py-3 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
                />
                <input
                  type="number"
                  placeholder="Number of Rounds"
                  value={formData.rounds}
                  onChange={(e) => setFormData({...formData, rounds: e.target.value})}
                  className="px-4 py-3 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
                />
              </div>

              <textarea
                placeholder="Job Description *"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                rows={3}
                className="w-full px-4 py-3 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E] mb-4"
              />

              <textarea
                placeholder="Required Qualification/Skills *"
                value={formData.qualification}
                onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                required
                rows={2}
                className="w-full px-4 py-3 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E] mb-4"
              />

              <button
                type="submit"
                disabled={companies.length === 0}
                className="px-6 py-3 bg-[#B08B5E] text-white rounded-xl hover:bg-[#7B4F1D] transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingId ? 'Update Drive' : 'Create Drive'}
              </button>
            </form>
          )}

          {loading ? (
            <Loader />
          ) : (
            <div className="space-y-4">
              {drives.length > 0 ? (
                drives.map((drive) => (
                  <div key={drive._id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-[#7B4F1D] mb-2">{drive.jobRole}</h3>
                        <p className="text-[#B08B5E] font-semibold mb-2">{drive.company?.name || '-'}</p>
                        <p className="text-gray-700 mb-4">{drive.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-[#B08B5E] font-bold">Vacancies</p>
                            <p className="text-gray-700">{drive.vacancies}</p>
                          </div>
                          <div>
                            <p className="text-[#B08B5E] font-bold">Location</p>
                            <p className="text-gray-700">{drive.location}</p>
                          </div>
                          <div>
                            <p className="text-[#B08B5E] font-bold">Deadline</p>
                            <p className="text-gray-700">{new Date(drive.deadline).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-[#B08B5E] font-bold">Package</p>
                            <p className="text-gray-700">{drive.package || '-'}</p>
                          </div>
                          <div>
                            <p className="text-[#B08B5E] font-bold">Status</p>
                            <p className={`font-semibold ${drive.isActive ? 'text-green-600' : 'text-red-600'}`}>
                              {drive.isActive ? 'Active' : 'Closed'}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-4">
                          <Link
                            to={`/recruiter/drives/${drive._id}/applications`}
                            className="px-6 py-2 bg-[#B08B5E] text-white font-semibold rounded-xl hover:bg-[#7B4F1D] transition-all"
                          >
                            View Applications →
                          </Link>
                          <button
                            onClick={() => handleEditDrive(drive)}
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDrive(drive._id)}
                            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl">
                  <p className="text-gray-500 text-lg">No drives assigned yet</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 px-6 py-2 bg-[#B08B5E] text-white rounded-xl hover:bg-[#7B4F1D] font-semibold"
                  >
                    Create Your First Drive
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
}
