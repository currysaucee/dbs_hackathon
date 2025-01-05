// src/utils/auth.js
import * as jwtDecode from 'jwt-decode';

export const isAuthenticated = () => {
  console.log("Checking if user is authenticated")
  const token = localStorage.getItem('jwtToken')
  if (!token) return false

  try {
    const { exp } = jwtDecode(token)
    if (Date.now() >= exp * 1000) {
      // Token has expired
      localStorage.removeItem('jwtToken')
      return false
    }
    return true
  } catch (error) {
    // Invalid token
    localStorage.removeItem('jwtToken')
    return false
  }
}
