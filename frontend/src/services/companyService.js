import axiosInstance from './axiosInstance';

export const companyService = {
  getCompanies: () => axiosInstance.get('/companies'),
  getCompany: (id) => axiosInstance.get(`/companies/${id}`),
  createCompany: (data) => axiosInstance.post('/companies', data),
  updateCompany: (id, data) => axiosInstance.put(`/companies/${id}`, data),
  deleteCompany: (id) => axiosInstance.delete(`/companies/${id}`),
};

export default companyService;
