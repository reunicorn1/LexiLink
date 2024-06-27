import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './utils/config';

// Create the AuthContext
const AuthContext = createContext();

/**
 * Custom hook to use the AuthContext
 * @returns {object} The context value
 */
export const useAuth = () => useContext(AuthContext);

/**
 * AuthProvider component to provide authentication context to its children
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The AuthProvider component
 */
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // State variables for authentication tokens, user, role, and reload flag
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'));
  const [user, setUser] = useState({});
  const [role, setRole] = useState(() => localStorage.getItem('role'));
  const [reload, setReload] = useState(false);

  // Update local storage when authToken changes
  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
    }
  }, [authToken, refreshToken, role]);

  /**
   * Get access token and refresh it if needed
   * @returns {string} The access token
   */
  const getAccess = () => {
    refresh();
    return authToken;
  };

  /**
   * Login function to set tokens and update local storage
   * @param {string} token - Access token
   * @param {string} refresh - Refresh token
   */
  const login = (token, refresh) => {
    setAuthToken(token);
    setRefreshToken(refresh);
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('role', role);
  };

  /**
   * Logout function to clear tokens and local storage
   */
  const logout = () => {
    setAuthToken(null);
    setRefreshToken(null);
    setRole(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
  };

  /**
   * Handle logout and navigation
   */
  const followup = () => {
    logout();
    navigate('/');
    handleToast();
  };

  /**
   * Logout from the server
   */
  const handleLogOut = async () => {
    try {
      await axios.delete(`${API_URL}/auth/logout`, {
        data: { refresh_token: refreshToken },
        headers: { Authorization: "Bearer " + refreshToken }
      });
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Refresh the access token
   * @returns {string|null} The new access token
   */
  const refresh = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/refresh`, {
        headers: { Authorization: "Bearer " + refreshToken },
        withCredentials: true
      });
      setAuthToken(response.data.access_token);
      return response.data.access_token;
    } catch (err) {
      if (err.response?.status === 410) {
        logout();
        handleLogOut();
        navigate('/');
      } else {
        console.log({ err });
      }
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, refreshToken, getAccess, user, setUser, role, setRole, login, logout, refresh, reload, setReload }}>
      {children}
    </AuthContext.Provider>
  );
};