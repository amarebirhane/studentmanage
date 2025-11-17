'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      setUser(data);
      // Store user in localStorage for quick access (not token)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data));
      }
    } catch (error) {
      // Not logged in or token expired
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data));
      }
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      setUser(data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data));
      }
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAdmin: user?.role === 'admin',
    isTeacher: user?.role === 'teacher' || user?.role === 'admin',
    refreshUser: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

