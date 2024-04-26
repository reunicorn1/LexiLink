import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'));

  // After trial and error I found that bc of the nature of js aync functions, the only thing that can control updating the access token is useEffect
  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken', refreshToken)

    }
  }, [authToken]);

  const login = (token, refresh) => {
    setAuthToken(token);
    setRefreshToken (refresh);
    
    // It doesn't make sense to me why these two down there don't work while the setting functions work normally when you login
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const logout = () => {
    setAuthToken(null);
    setRefreshToken (null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  };

  const refresh = () => {
    (async ()=>{
      try {
        const result = await axios.post("http://127.0.0.1:5000/auth/refresh", { headers: {Authorization: "Bearer " + refreshToken} });
        setAuthToken(result.data.access_token);
      } catch (error) {
        console.log("Error occured while refreshing the access token");
      }
    })
  }

  return (
    <AuthContext.Provider value={{ authToken, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};