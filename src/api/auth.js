/**
 * Authentication API Client
 * Functions for making auth-related API calls
 */
const API_BASE = '/api'

/**
 * User signup
 */
export const signup = async (userData) => {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to sign up')
  }
  
  return response.json()
}

/**
 * User login
 */
export const login = async (credentials) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to login')
  }
  
  return response.json()
}

/**
 * User logout
 */
export const logout = async () => {
  const token = localStorage.getItem('fitlog_token')
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  // Always resolve, even if backend call fails
  return response.ok
}

