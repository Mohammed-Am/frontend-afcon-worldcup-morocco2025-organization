
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Helper function to get the API base URL and remove trailing slash if present
const getApiBaseUrl = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  if (baseUrl && baseUrl.endsWith('/')) {
    return baseUrl.slice(0, -1);
  }
  return baseUrl;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${getApiBaseUrl()}/users/me`);
        setIsLoggedIn(true);
        setUser(res.data);
      } catch (err) {
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post(`${getApiBaseUrl()}/users/logout`);
      setIsLoggedIn(false);
      setUser(null);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
