import React, { useState, useEffect } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../../components/common/Loader';

export default function StudentProfile() {
  const [profile, setProfile] = useState({
    image: { url: '', fileId: '' },
    phone: '',
    rollNumber: '',
    registrationId: '',
    course: '',
    college: '',
    year: 1,
    skills: [],
    resume: { url: '', fileId: '' },
  });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get('/students/profile');
      setProfile(res.data);
      setOriginalProfile(res.data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (idx) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await axiosInstance.put('/students/profile', profile);
      
      setOriginalProfile(profile);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setProfile(originalProfile);
    setSkillInput('');
    setIsEditing(false);
    setError('');
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSaving(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await axiosInstance.post('/students/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setProfile((prev) => ({
        ...prev,
        resume: res.data.resume,
      }));
      setSuccess('Resume uploaded successfully!');
    } catch (err) {
      setError('Failed to upload resume');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSaving(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axiosInstance.post('/students/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setProfile((prev) => ({
        ...prev,
        image: res.data.image,
      }));
      setSuccess('Profile picture uploaded successfully!');
    } catch (err) {
      console.error('Image upload error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <StudentLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-4 md:p-6 lg:p-8 font-[Montserrat]">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#7B4F1D] text-center sm:text-left">My Profile</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#B08B5E] text-white rounded-xl hover:bg-[#7B4F1D] transition-all font-semibold shadow-md"
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-pulse">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-600 font-medium">{success}</p>
            </div>
          )}

          {/* VIEW MODE */}
          {!isEditing ? (
            <div className="bg-white rounded-2xl p-6 md:p-10 shadow-xl space-y-8">
              {/* Profile Picture */}
              <div className="flex justify-center mb-4">
                {profile.image?.url ? (
                  <img
                    src={profile.image.url}
                    alt="Profile"
                    className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-[#B08B5E] shadow-xl"
                  />
                ) : (
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#F8EFE2] border-4 border-[#B08B5E] flex items-center justify-center text-4xl md:text-5xl font-bold text-[#7B4F1D]">
                    📷
                  </div>
                )}
              </div>

              {/* Responsive Grid for Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-[#B08B5E]">
                  <p className="text-[#B08B5E] font-bold text-xs uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-gray-700 text-base md:text-lg break-all">{profile.phone || 'Not provided'}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-[#B08B5E]">
                  <p className="text-[#B08B5E] font-bold text-xs uppercase tracking-wider mb-1">Roll Number</p>
                  <p className="text-gray-700 text-base md:text-lg break-all">{profile.rollNumber || 'Not provided'}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-[#B08B5E]">
                  <p className="text-[#B08B5E] font-bold text-xs uppercase tracking-wider mb-1">Registration ID</p>
                  <p className="text-gray-700 text-base md:text-lg break-all">{profile.registrationId || 'Not provided'}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-[#B08B5E]">
                  <p className="text-[#B08B5E] font-bold text-xs uppercase tracking-wider mb-1">Course</p>
                  <p className="text-gray-700 text-base md:text-lg">{profile.course || 'Not provided'}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-[#B08B5E]">
                  <p className="text-[#B08B5E] font-bold text-xs uppercase tracking-wider mb-1">College</p>
                  <p className="text-gray-700 text-base md:text-lg">{profile.college || 'Not provided'}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-[#B08B5E]">
                  <p className="text-[#B08B5E] font-bold text-xs uppercase tracking-wider mb-1">Year</p>
                  <p className="text-gray-700 text-base md:text-lg">Year {profile.year || 'N/A'}</p>
                </div>
              </div>

              {/* Skills Display */}
              <div className="border-t border-gray-100 pt-8">
                <p className="text-[#B08B5E] font-bold text-sm mb-4">SKILLS & EXPERTISE</p>
                {profile.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {profile.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-[#F8EFE2] text-[#7B4F1D] px-4 py-2 rounded-lg text-sm font-semibold border border-[#B08B5E]/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No skills added yet.</p>
                )}
              </div>

              {/* Resume Display */}
              <div className="border-t border-gray-100 pt-8">
                <p className="text-[#B08B5E] font-bold text-sm mb-4">RESUME</p>
                {profile.resume?.url ? (
                  <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4 text-center sm:text-left">
                        <div className="text-4xl md:text-5xl">📄</div>
                        <div>
                          <p className="font-bold text-[#7B4F1D] text-lg">Resume Uploaded</p>
                          <p className="text-sm text-green-700">Ready for recruitment drives</p>
                        </div>
                      </div>
                      <a
                        href={profile.resume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto text-center px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold shadow-md"
                      >
                        📥 Download
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                    <p className="text-red-700 font-bold text-center">⚠️ No resume uploaded</p>
                    <p className="text-red-600 text-sm text-center mt-1">Upload your latest resume to apply for jobs</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* EDIT MODE */
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-10 shadow-xl space-y-8 animate-fadeIn">
              {/* Profile Picture Upload */}
              <div className="border-2 border-dashed border-[#B08B5E]/50 rounded-2xl p-6 md:p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex justify-center mb-4">
                  {profile.image?.url ? (
                    <img
                      src={profile.image.url}
                      alt="Profile"
                      className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-[#B08B5E]"
                    />
                  ) : (
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-[#F8EFE2] border-4 border-[#B08B5E] flex items-center justify-center text-4xl font-bold text-[#7B4F1D]">
                      📷
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={saving}
                />
                <label htmlFor="image-upload" className={`cursor-pointer block group ${saving ? 'opacity-50 pointer-events-none' : ''}`}>
                  <p className="text-[#7B4F1D] font-bold group-hover:underline">
                    {profile.image?.url ? 'Change Photo' : 'Upload Photo'}
                  </p>
                  <p className="text-[#B08B5E] text-xs mt-1">Maximum size 5MB (JPG, PNG)</p>
                </label>
              </div>

              {/* Responsive Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#7B4F1D]">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-[#B08B5E]/30 rounded-xl focus:outline-none focus:border-[#B08B5E] transition-all bg-white"
                    placeholder="+91 00000 00000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#7B4F1D]">Roll Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={profile.rollNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-[#B08B5E]/30 rounded-xl focus:outline-none focus:border-[#B08B5E] transition-all bg-white"
                    placeholder="e.g., 20CS101"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#7B4F1D]">Registration ID</label>
                  <input
                    type="text"
                    name="registrationId"
                    value={profile.registrationId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-[#B08B5E]/30 rounded-xl focus:outline-none focus:border-[#B08B5E] transition-all bg-white"
                    placeholder="e.g., REG123456"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#7B4F1D]">Course</label>
                  <input
                    type="text"
                    name="course"
                    value={profile.course}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-[#B08B5E]/30 rounded-xl focus:outline-none focus:border-[#B08B5E] transition-all bg-white"
                    placeholder="e.g., B.Tech CSE"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#7B4F1D]">College/University</label>
                  <input
                    type="text"
                    name="college"
                    value={profile.college}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-[#B08B5E]/30 rounded-xl focus:outline-none focus:border-[#B08B5E] transition-all bg-white"
                    placeholder="University Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#7B4F1D]">Academic Year</label>
                  <select
                    name="year"
                    value={profile.year}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-[#B08B5E]/30 rounded-xl focus:outline-none focus:border-[#B08B5E] transition-all bg-white appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4].map((y) => (
                      <option key={y} value={y}>Year {y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Skills Editor */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-[#7B4F1D]">Skills</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-[#B08B5E]/30 rounded-xl focus:outline-none focus:border-[#B08B5E] bg-white"
                    placeholder="Add a skill (e.g., React, Java)..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="w-full sm:w-auto px-8 py-3 bg-[#B08B5E] text-white rounded-xl hover:bg-[#7B4F1D] font-bold shadow-md active:scale-95 transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F8EFE2] text-[#7B4F1D] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-[#B08B5E]/40"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(idx)}
                        className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Resume Section in Edit Mode */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-[#7B4F1D]">Upload Resume</label>
                
                {profile.resume?.url && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-green-700 font-medium text-sm sm:text-base truncate mr-2">
                      ✅ Current: {profile.resume.url.split('/').pop()}
                    </span>
                    <div className="text-xl">📄</div>
                  </div>
                )}

                <div className="border-2 border-dashed border-[#B08B5E]/50 rounded-2xl p-6 text-center hover:bg-gray-50 transition-all">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                    id="resume-upload"
                    disabled={saving}
                  />
                  <label htmlFor="resume-upload" className={`cursor-pointer block ${saving ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="text-4xl mb-3">📁</div>
                    <p className="text-[#7B4F1D] font-bold">
                      {profile.resume?.url ? 'Replace Document' : 'Select Resume File'}
                    </p>
                    <p className="text-[#B08B5E] text-xs mt-1">PDF or Word (Max 5MB)</p>
                  </label>
                </div>
                {saving && (
                  <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold animate-pulse">
                    <span>⏳ Uploading file...</span>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={saving}
                  className={`flex-1 py-4 rounded-xl font-bold text-lg text-white transition-all shadow-lg active:scale-95 ${
                    saving
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#B08B5E] hover:bg-[#7B4F1D]'
                  }`}
                >
                  {saving ? 'Processing...' : '✅ Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={saving}
                  className="flex-1 py-4 rounded-xl font-bold text-lg text-[#7B4F1D] bg-[#F8EFE2] hover:bg-gray-200 transition-all border-2 border-[#B08B5E]/20"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}