import axiosInstance from './axiosInstance';

export const dashboardService = {
  getAdminDashboardStats: () => axiosInstance.get('/dashboard/admin'),
  getStudentDashboardStats: () => axiosInstance.get('/dashboard/student'),
  getRecruiterDashboardStats: () => axiosInstance.get('/dashboard/recruiter'),
  getDashboardCharts: (timeframe) => axiosInstance.get(`/dashboard/charts?timeframe=${timeframe}`),
};

export default dashboardService;
