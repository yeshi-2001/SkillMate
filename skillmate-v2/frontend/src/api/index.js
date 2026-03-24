import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Users
export const getMe = () => api.get('/users/me');
export const updateMe = (data) => api.put('/users/me', data);
export const updateAvatar = (avatarUrl) => api.post('/users/me/avatar', { avatarUrl });
export const getUserById = (id) => api.get(`/users/${id}`);
export const searchUsers = (skill) => api.get(`/users/search?skill=${skill}`);

// Skills
export const getSkills = () => api.get('/skills');
export const addSkill = (data) => api.post('/skills', data);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);

// Matches
export const getMatches = () => api.get('/matches');

// Connections
export const sendConnectionRequest = (userId) => api.post(`/connections/request/${userId}`);
export const acceptRequest = (id) => api.put(`/connections/request/${id}/accept`);
export const rejectRequest = (id) => api.put(`/connections/request/${id}/reject`);
export const getConnections = () => api.get('/connections');

// Chat
export const getChatHistory = (userId) => api.get(`/chat/messages/${userId}`);
export const sendMessage = (data) => api.post('/chat/messages', data);

// Notifications
export const getNotifications = () => api.get('/notifications');
export const markNotifRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllNotifsRead = () => api.put('/notifications/read-all');

export default api;
