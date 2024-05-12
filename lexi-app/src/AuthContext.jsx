import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { createAuthProvider } from 'react-token-auth';
import { API_URL } from './utils/config';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'));
  const [user, setUser] = useState({});
  const [role, setRole] = useState(() => localStorage.getItem('role'));
  const [reload, setReload] = useState(false);

  // After trial and error I found that bc of the nature of js aync functions, the only thing that can control updating the access token is useEffect
  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken', refreshToken);
      localStorage.removeItem('role', role);
    }
  }, [authToken]);

  // I tried to think of a way to update the access token whenever we ask for it, so it requests never fail, I'm not sure if this will fix the issue tho
  const getAccess = () => {
    refresh();
    return authToken;
  }

  const login = (token, refresh) => {
    setAuthToken(token);
    setRefreshToken(refresh);
    
    // It doesn't make sense to me why these two down there don't work while the setting functions work normally when you login
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('role', role);
  };

  const logout = () => {
    setAuthToken(null);
    setRefreshToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role', role);
  };

  const refresh = () => {
    return (async () => {
      try {
        const result = await axios.get(`${API_URL}/auth/refresh`, { headers: {Authorization: "Bearer " + refreshToken} } );
        setAuthToken(result.data.access_token);
        console.log("refresh token");
        return (result.data.access_token);
      } catch(error) {
        console.log(error.response.data);
      }
    })();
  }

  return (
    <AuthContext.Provider value={{ authToken, refreshToken, getAccess, user, setUser, role, setRole, login, logout, refresh, reload, setReload }}>
      {children}
    </AuthContext.Provider>
  );
};