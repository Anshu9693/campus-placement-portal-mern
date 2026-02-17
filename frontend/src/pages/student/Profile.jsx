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
      <div className="bg-[#F8EFE2] min-h-screen p-6 font-[Montserrat]">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-[#7B4F1D]">My Profile</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 bg-[#B08B5E] text-white rounded-xl hover:bg-[#7B4F1D] transition-all font-semibold"
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-600">{success}</p>
            </div>
          )}

          {/* VIEW MODE */}
          {!isEditing ? (
            <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
              {/* Profile Picture */}
              <div className="flex justify-center mb-6">
                {profile.image?.url ? (
                  <img
                    src={profile.image.url}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#B08B5E] shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-[#F8EFE2] border-4 border-[#B08B5E] flex items-center justify-center text-4xl font-bold text-[#7B4F1D]">
                    📷
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-[#B08B5E] font-bold text-sm mb-1">Phone</p>
                  <p className="text-gray-700 text-lg">{profile.phone || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-[#B08B5E] font-bold text-sm mb-1">Roll Number</p>
                  <p className="text-gray-700 text-lg">{profile.rollNumber || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-[#B08B5E] font-bold text-sm mb-1">Registration ID</p>
                  <p className="text-gray-700 text-lg">{profile.registrationId || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-[#B08B5E] font-bold text-sm mb-1">Course</p>
                  <p className="text-gray-700 text-lg">{profile.course || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-[#B08B5E] font-bold text-sm mb-1">College</p>
                  <p className="text-gray-700 text-lg">{profile.college || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-[#B08B5E] font-bold text-sm mb-1">Year</p>
                  <p className="text-gray-700 text-lg">Year {profile.year || 'N/A'}</p>
                </div>
              </div>

              {/* Skills Display */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-[#B08B5E] font-bold text-sm mb-3">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-[#F8EFE2] text-[#7B4F1D] px-4 py-2 rounded-full text-sm font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume Display */}
              <div className="border-t border-gray-200 pt-6">
                <p className="text-[#B08B5E] font-bold text-sm mb-3">Resume</p>
                {profile.resume?.url ? (
                  <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">📄</div>
                        <div>
                          <p className="font-bold text-[#7B4F1D]">Resume Uploaded</p>
                          <p className="text-sm text-green-700">Your resume is visible to recruiters</p>
                        </div>
                      </div>
                      <a
                        href={profile.resume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold"
                      >
                        📥 Download
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
                    <p className="text-red-700 font-semibold text-center">⚠️ No resume uploaded</p>
                    <p className="text-red-600 text-sm text-center mt-1">Click Edit to upload your resume</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* EDIT MODE */
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
              {/* Profile Picture Upload */}
              <div className="border-2 border-dashed border-[#B08B5E] rounded-xl p-8 text-center">
                <div className="flex justify-center mb-4">
                  {profile.image?.url ? (
                    <img
                      src={profile.image.url}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#B08B5E]"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-[#F8EFE2] border-4 border-[#B08B5E] flex items-center justify-center text-4xl font-bold text-[#7B4F1D]">
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
                <label htmlFor="image-upload" className={`cursor-pointer block ${saving ? 'opacity-50' : ''}`}>
                  <p className="text-[#7B4F1D] font-semibold">
                    {profile.image?.url ? 'Click to change profile picture' : 'Click to upload profile picture'}
                  </p>
                  <p className="text-[#B08B5E] text-sm">JPG, PNG, GIF (Max 5MB)</p>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#7B4F1D] mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#7B4F1D] mb-2">Roll Number</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={profile.rollNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
                  placeholder="e.g., 20CS101"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#7B4F1D] mb-2">Registration ID</label>
                <input
                  type="text"
                  name="registrationId"
                  value={profile.registrationId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
                  placeholder="e.g., REG123456"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#7B4F1D] mb-2">Course</label>
                <input
                  type="text"
                  name="course"
                  value={profile.course}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
                  placeholder="B.Tech (CSE)"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#7B4F1D] mb-2">College</label>
                <input
                  type="text"
                  name="college"
                  value={profile.college}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
                  placeholder="Your University Name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#7B4F1D] mb-2">Year</label>
                <select
                  name="year"
                  value={profile.year}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
                >
                  {[1, 2, 3, 4].map((y) => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <label className="block text-sm font-bold text-[#7B4F1D] mb-2">Skills</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
                  placeholder="Add skill..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-6 py-2.5 bg-[#B08B5E] text-white rounded-xl hover:bg-[#7B4F1D] transition-all font-semibold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-[#F8EFE2] text-[#7B4F1D] px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(idx)}
                      className="font-bold hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-bold text-[#7B4F1D] mb-2">Resume</label>
              
              {profile.resume?.url ? (
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">📄</div>
                      <div>
                        <p className="font-bold text-[#7B4F1D]">Resume Uploaded</p>
                        <p className="text-sm text-green-700">Your resume is visible to recruiters</p>
                      </div>
                    </div>
                    <a
                      href={profile.resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold"
                    >
                      📥 Download
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-4">
                  <p className="text-red-700 font-semibold text-center">⚠️ No resume uploaded yet</p>
                  <p className="text-red-600 text-sm text-center mt-1">Upload a resume to apply for drives</p>
                </div>
              )}

              <div className="border-2 border-dashed border-[#B08B5E] rounded-xl p-6 text-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                  id="resume-upload"
                  disabled={saving}
                />
                <label htmlFor="resume-upload" className={`cursor-pointer block ${saving ? 'opacity-50' : ''}`}>
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-[#7B4F1D] font-semibold">
                    {profile.resume?.url ? 'Click to replace resume' : 'Click to upload resume'}
                  </p>
                  <p className="text-[#B08B5E] text-sm">PDF, DOC, DOCX (Max 5MB)</p>
                </label>
              </div>
              {saving && (
                <p className="mt-2 text-blue-600 text-sm flex items-center gap-1">
                  ⏳ Uploading...
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className={`flex-1 py-3 rounded-xl font-bold text-white transition-all ${
                  saving
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#B08B5E] hover:bg-[#7B4F1D]'
                }`}
              >
                {saving ? 'Saving...' : '✅ Save Changes'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="flex-1 py-3 rounded-xl font-bold text-[#7B4F1D] bg-[#F8EFE2] hover:bg-gray-200 transition-all"
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
