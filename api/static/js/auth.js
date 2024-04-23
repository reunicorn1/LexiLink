import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username: 'user1',
        password: 'password1'
      });
      console.log('Login response:', response.data);
      const accessToken = response.data.access_token;
      setToken(accessToken);
      // Store the token in local storage or in-memory
      localStorage.setItem('token', accessToken);
      console.log('Logged in as:', response.data.logged_in_as);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setToken('');
      localStorage.removeItem('token');
      console.log('Logged out');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const verifyToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/verify-token', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Logged in as:', response.data.logged_in_as);
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  };

  return (
    <div>
    <button onClick={handleLogin}>Login</button>
    <button onClick={handleLogout}>Logout</button>
    <button onClick={verifyToken}>Verify Token</button>
    </div>
  );
}

export default App;
