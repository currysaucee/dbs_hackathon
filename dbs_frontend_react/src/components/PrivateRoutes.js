import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import config from '../config';

const PrivateRoutes = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; 
    }
  };

  const refreshAccessToken = async () => {
    try {
      if (!refreshToken || isTokenExpired(refreshToken)) {
        console.error('Refresh token expired or missing.');
        setIsAuthenticated(false); 
        return false;
      }

      const response = await fetch(`${config.API_BASE_URL}/${config.REFRESH_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('New access token:', data.access_token);
        localStorage.setItem('access_token', data.access_token); 
        return true;
      } else {
        console.error('Failed to refresh token.');
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('Error during token refresh:', error);
      setIsAuthenticated(false);
      return false;
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (accessToken && isTokenExpired(accessToken)) {
        console.log('Access token expired. Attempting to refresh...');
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          console.log('Refresh token invalid or expired. Logging out...');
          setIsAuthenticated(false);
        }
      }
    }, config.ACCESS_TOKEN_REFRESH_INTERVAL); 

    return () => clearInterval(interval); 
  }, [accessToken, refreshToken]); 

  useEffect(() => {
    if (!accessToken || isTokenExpired(accessToken)) {
      if (!refreshToken || isTokenExpired(refreshToken)) {
        console.log('Refresh token expired or missing. Logging out...');
        setIsAuthenticated(false);
      } else {
        refreshAccessToken();
      }
    }
  }, [accessToken, refreshToken]);

  if (!isAuthenticated) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoutes;
