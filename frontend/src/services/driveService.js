import axiosInstance from './axiosInstance';

export const driveService = {
  getDrives: () => axiosInstance.get('/drives'),
  getDrive: (id) => axiosInstance.get(`/drives/${id}`),
  createDrive: (data) => axiosInstance.post('/drives', data),
  updateDrive: (id, data) => axiosInstance.put(`/drives/${id}`, data),
  deleteDrive: (id) => axiosInstance.delete(`/drives/${id}`),
};

export default driveService;
