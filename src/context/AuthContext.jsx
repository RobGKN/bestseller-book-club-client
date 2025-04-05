// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔐 Check for a saved token and fetch user profile
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (!token) return setLoading(false);

      try {
        const { data } = await authAPI.getProfile();
        setCurrentUser(data);
      } catch (err) {
        localStorage.removeItem('token');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // 🆕 Register
  const register = async (userData) => {
    setError(null);
    try {
      const { data } = await authAPI.register(userData);
      localStorage.setItem('token', data.token);
      setCurrentUser(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // 🔑 Login
  const login = async (credentials) => {
    setError(null);
    try {
      const { data } = await authAPI.login(credentials);
      localStorage.setItem('token', data.token);
      setCurrentUser(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
