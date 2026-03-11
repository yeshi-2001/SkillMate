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
    console.log('AuthContext: Checking token on mount:', token ? 'Found' : 'Not found');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      console.log('AuthContext: Fetching user profile...');
      const response = await axiosInstance.get('/user/profile');
      console.log('AuthContext: Profile fetched successfully:', response.data.data);
      setUser(response.data.data);
    } catch (error) {
      console.error('AuthContext: Failed to fetch user profile:', error);
      console.error('AuthContext: Error response:', error.response);
      // Don't remove token here, let axios interceptor handle it
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    console.log('AuthContext: Login called with token:', token ? 'Yes' : 'No');
    console.log('AuthContext: User data:', userData);
    localStorage.setItem('token', token);
    setUser(userData);
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
