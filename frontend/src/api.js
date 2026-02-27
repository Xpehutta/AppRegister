import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);

// Application endpoints
export const getApplications = () => api.get('/applications');
export const getApplication = (id) => api.get(`/applications/${id}`);
export const createApplication = (data) => api.post('/applications', { data });
export const submitApplication = (id) => api.post(`/applications/${id}/submit`);
export const uploadAttachment = (applicationId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/applications/${applicationId}/attachments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const downloadAttachment = (applicationId, attachmentId) =>
  api.get(`/applications/${applicationId}/attachments/${attachmentId}`, {
    responseType: 'blob',
  });

// Admin endpoints
export const getAllApplications = () => api.get('/admin/applications');
export const updateApplicationStatus = (id, status, comment) =>
  api.put(`/admin/applications/${id}/status`, { status, comment });

export default api;