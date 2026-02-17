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
    // Restore scroll position if available
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
      console.error('Error loading drives:', err);
      setError('Failed to load drives');
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
    
    if (!formData.company || !formData.jobRole.trim() || !formData.description.trim() || !formData.qualification.trim() || !formData.deadline) {
      setError('Please fill in all required fields');
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
        // Update
        await axiosInstance.put(`/drives/${editingId}`, driveData);
      } else {
        // Create
        await axiosInstance.post('/drives', driveData);
      }

      setFormData({
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
      setShowForm(false);
      setEditingId(null);
      setError('');
      fetchDrives();
    } catch (err) {
      console.error('Error saving drive:', err);
      setError(err.response?.data?.message || 'Failed to save drive');
    }
  };

  const handleEditDrive = (drive) => {
    // Ask for confirmation before editing
    const confirmEdit = window.confirm('Do you want to edit this drive?');
    if (!confirmEdit) return;

    // Save current scroll position
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

    // Scroll to the top of the screen
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteDrive = async (id) => {
    if (window.confirm('Are you sure you want to delete this drive?')) {
      try {
        await axiosInstance.delete(`/drives/${id}`);
        fetchDrives();
      } catch (err) {
        console.error('Error deleting drive:', err);
        setError('Failed to delete drive');
      }
    }
  };

  const handleToggleDrive = async (driveId, isActive) => {
    const action = isActive ? 'inactivate' : 'activate';
    const confirmToggle = window.confirm(`Are you sure you want to ${action} this drive?`);
    if (!confirmToggle) return;

    try {
      await axiosInstance.put(`/drives/${driveId}`, { isActive: !isActive });
      fetchDrives();
    } catch (err) {
      console.error('Error updating drive:', err);
      setError('Failed to update drive');
    }
  };

  const filteredDrives = drives.filter((d) =>
    d.jobRole?.toLowerCase().includes(search.toLowerCase()) ||
    d.company?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-6 font-[Montserrat]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-[#7B4F1D]">Drives</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setFormData({
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
            <div
              className="fixed top-0 left-0 w-full h-full bg-[#E8E1D6]/90 flex justify-center items-center z-50"
            >
              <form
                id="edit-form"
                onSubmit={handleCreateOrUpdateDrive}
                className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-2xl relative overflow-y-auto max-h-[90vh]"
              >
                <h2 className="text-2xl font-bold text-[#7B4F1D] mb-4">
                  {editingId ? 'Edit Drive' : 'Create New Drive'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <select
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
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

                <div className="sticky bottom-0 bg-white py-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#B08B5E] text-white rounded-xl hover:bg-[#7B4F1D] transition-all font-bold w-full"
                  >
                    Save
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="absolute top-4 right-4 text-white bg-red-600 px-4 py-2 rounded-full hover:bg-red-700"
                >
                  ✕ Close
                </button>
              </form>
            </div>
          )}

          {/* Search */}
          <input
            type="text"
            placeholder="Search drives..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-6 px-4 py-3 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
          />

          {/* Drives List */}
          {loading ? (
            <Loader />
          ) : (
            <div className="space-y-4">
              {filteredDrives.length > 0 ? (
                filteredDrives.map((drive) => (
                  <div
                    key={drive._id}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-[#7B4F1D] mb-2">{drive.jobRole}</h3>
                        <p className="text-[#B08B5E] font-semibold mb-3">{drive.company?.name}</p>
                        <p className="text-gray-700 mb-4">{drive.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-[#B08B5E] font-bold">Location</p>
                            <p>{drive.location || '-'}</p>
                          </div>
                          <div>
                            <p className="text-[#B08B5E] font-bold">Vacancies</p>
                            <p>{drive.vacancies || '-'}</p>
                          </div>
                          <div>
                            <p className="text-[#B08B5E] font-bold">Package</p>
                            <p>{drive.package || '-'}</p>
                          </div>
                          <div>
                            <p className="text-[#B08B5E] font-bold">Deadline</p>
                            <p>{new Date(drive.deadline).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => handleToggleDrive(drive._id, drive.isActive)}
                            className={`px-6 py-2 rounded-xl font-bold text-white transition-all ${
                              drive.isActive
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'
                            }`}
                          >
                            {drive.isActive ? '✓ Active' : '✕ Inactive'}
                          </button>
                          <button
                            onClick={(e) => handleEditDrive(drive, e.currentTarget.closest('div'))}
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
                  <p className="text-gray-500 text-lg">No drives found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
