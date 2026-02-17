import axiosInstance from './axiosInstance';

export const applicationService = {
  getApplications: () => axiosInstance.get('/applications'),
  getApplication: (id) => axiosInstance.get(`/applications/${id}`),
  getDriveApplications: (driveId) => axiosInstance.get(`/applications/drive/${driveId}`),
  createApplication: (data) => axiosInstance.post('/applications', data),
  updateApplication: (id, data) => axiosInstance.put(`/applications/${id}`, data),
  deleteApplication: (id) => axiosInstance.delete(`/applications/${id}`),
  updateStatus: (id, status) => axiosInstance.put(`/applications/${id}/status`, { status }),
};

export default applicationService;
