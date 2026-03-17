import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('AuthContext: Initial check - token exists:', !!token);
    
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []); // Empty dependency array - only run once

  const fetchUserProfile = async () => {
    try {
      console.log('AuthContext: Fetching user profile...');
      const response = await axiosInstance.get('/user/profile');
      console.log('AuthContext: Profile fetched successfully:', response.data.data);
      setUser(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('AuthContext: Failed to fetch user profile:', error);
      
      // Only clear token if it's actually invalid (401/422)
      if (error.response?.status === 401 || error.response?.status === 422) {
        console.log('AuthContext: Token invalid, clearing...');
        localStorage.removeItem('token');
        setUser(null);
      }
      // For other errors, keep the token and let user retry
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    console.log('AuthContext: Login called with token:', token ? 'Yes' : 'No');
    console.log('AuthContext: User data:', userData);
    localStorage.setItem('token', token);
    setUser(userData);
    setLoading(false); // Ensure loading is false after login
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
