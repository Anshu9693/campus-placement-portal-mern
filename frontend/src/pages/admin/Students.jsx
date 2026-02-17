import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../../components/common/Loader';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axiosInstance.get('/students');
      setStudents(res.data);
    } catch (err) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const toggleActiveStatus = async (studentId, currentStatus) => {
    const confirmation = window.prompt(
      `You are about to change the status to ${currentStatus ? 'Inactive' : 'Active'}. Please confirm by typing 'yes':`
    );

    if (confirmation?.toLowerCase() !== 'yes') {
      alert('Status change cancelled.');
      return;
    }

    try {
      await axiosInstance.put(`/students/${studentId}/status`, {
        isActive: !currentStatus,
      });
      setStudents((prev) =>
        prev.map((student) =>
          student._id === studentId ? { ...student, isActive: !currentStatus } : student
        )
      );
      alert('Status updated successfully!');
    } catch (err) {
      alert('Failed to update status. Please try again.');
    }
  };

  const filteredStudents = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <AdminLayout>
      <div className="bg-[#F8EFE2] min-h-screen p-6 font-[Montserrat]">
        <div className="max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-[#7B4F1D]">Students</h1>
            <div className="text-lg font-bold text-[#B08B5E]">Total: {students.length}</div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-6 px-4 py-3 border border-[#B08B5E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B08B5E]"
          />

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#7B4F1D] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Name</th>
                    <th className="px-6 py-4 text-left font-bold">Email</th>
                    <th className="px-6 py-4 text-left font-bold">College</th>
                    <th className="px-6 py-4 text-left font-bold">Year</th>
                    <th className="px-6 py-4 text-left font-bold">Registration ID</th>
                    <th className="px-6 py-4 text-left font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student._id} className="border-t border-gray-200 hover:bg-[#F8EFE2] transition-colors">
                      <td className="px-6 py-4 font-semibold text-[#7B4F1D]">{student.name}</td>
                      <td className="px-6 py-4 text-gray-700">{student.email}</td>
                      <td className="px-6 py-4 text-gray-700">{student.profile?.college || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-700">{student.profile?.year || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-700">{student.profile?.registrationId || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActiveStatus(student._id, student.isActive)}
                          className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${
                            student.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {student.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
