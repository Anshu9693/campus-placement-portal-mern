import axiosInstance from './axiosInstance';

export const authService = {
  login: (email, password) => axiosInstance.post('/auth/login', { email, password }),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  logout: () => axiosInstance.post('/auth/logout'),
  getCurrentUser: () => axiosInstance.get('/auth/me'),
};

export default authService;
