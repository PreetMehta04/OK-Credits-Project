import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 30000,
});

// Attach JWT token from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Product API
export const productApi = {
  list: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  search: (params) => api.get('/products', { params }),   // same endpoint, supports all filter params
  trending: () => api.get('/products/trending'),
};

// Recommendation / Chat API
export const recommendApi = {
  chat: (data) => api.post('/recommend/chat', data),
  trending: () => api.get('/recommend/trending'),
};

// Try-On API
export const tryonApi = {
  upload: (formData) =>
    api.post('/tryon/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  generate: (product_id, input_image_url) =>
    api.post('/tryon/generate', null, { params: { product_id, input_image_url } }),
  status: (job_id) => api.get(`/tryon/status/${job_id}`),
};

// Auth API
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

// Analytics API
export const analyticsApi = {
  sales: (days) => api.get('/analytics/sales', { params: { days } }),
  aiUsage: (days) => api.get('/analytics/ai-usage', { params: { days } }),
};

export default api;
