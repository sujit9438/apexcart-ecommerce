import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT Access Token
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

// Response interceptor to handle token expiry & auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const res = await axios.post('/api/v1/auth/refresh-token', { refreshToken });
          if (res.data?.data?.accessToken) {
            localStorage.setItem('token', res.data.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshErr) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
