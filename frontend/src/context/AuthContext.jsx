import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted auth from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('cardiocare_token');
    const storedUser = localStorage.getItem('cardiocare_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('cardiocare_token');
        localStorage.removeItem('cardiocare_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password);
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('cardiocare_token', data.access_token);
    localStorage.setItem('cardiocare_user', JSON.stringify(data.user));
    return data;
  }, []);

  const register = useCallback(async (email, fullName, password) => {
    const data = await apiRegister(email, fullName, password);
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('cardiocare_token', data.access_token);
    localStorage.setItem('cardiocare_user', JSON.stringify(data.user));
    return data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('cardiocare_token');
    localStorage.removeItem('cardiocare_user');
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('cardiocare_user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
