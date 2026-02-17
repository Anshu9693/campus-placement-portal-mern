import axiosInstance from './axiosInstance';

export const studentService = {
  getStudents: () => axiosInstance.get('/students'),
  getStudent: (id) => axiosInstance.get(`/students/${id}`),
  createStudent: (data) => axiosInstance.post('/students', data),
  updateStudent: (id, data) => axiosInstance.put(`/students/${id}`, data),
  deleteStudent: (id) => axiosInstance.delete(`/students/${id}`),
};

export default studentService;
