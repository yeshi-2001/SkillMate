import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const skillService = {
  getAllSkills: () => api.get('/skills'),
  createSkill: (data) => api.post('/skills', data),
  addTeachSkill: (userId, data) => api.post(`/skills/teach/${userId}`, data),
  addLearnSkill: (userId, data) => api.post(`/skills/learn/${userId}`, data),
  getUserTeachSkills: (userId) => api.get(`/skills/teach/${userId}`),
  getUserLearnSkills: (userId) => api.get(`/skills/learn/${userId}`),
  deleteTeachSkill: (id) => api.delete(`/skills/teach/${id}`),
  deleteLearnSkill: (id) => api.delete(`/skills/learn/${id}`),
};

export const matchService = {
  findMatches: (userId) => api.get(`/matches/${userId}`),
};

export const connectionService = {
  sendRequest: (data) => api.post('/connections/request', data),
  acceptRequest: (requestId) => api.post(`/connections/accept/${requestId}`),
  rejectRequest: (requestId) => api.post(`/connections/reject/${requestId}`),
  getPendingRequests: (userId) => api.get(`/connections/requests/${userId}`),
  getUserConnections: (userId) => api.get(`/connections/${userId}`),
};

export const messageService = {
  getMessages: (connectionId) => api.get(`/messages/${connectionId}`),
};

export default api;
