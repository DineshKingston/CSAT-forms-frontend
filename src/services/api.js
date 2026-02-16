import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public APIs
export const submitFeedback = async (formData) => {
  const response = await axios.post(`${API_URL}/api/feedback/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Admin APIs
export const adminLogin = async (credentials) => {
  const response = await axios.post(`${API_URL}/api/admin/login`, credentials);
  return response.data;
};

export const adminRegister = async (data) => {
  const response = await axios.post(`${API_URL}/api/admin/register`, data);
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/api/analytics/reports');
  return response.data;
};

export const downloadReport = async (format = 'csv') => {
  const response = await api.get(`/api/analytics/download?format=${format}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const checkHealth = async () => {
  const response = await axios.get(`${API_URL}/health`);
  return response.data;
};

export default api;
