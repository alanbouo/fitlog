/**
 * Authentication Utilities
 * Helper functions for managing JWT tokens in localStorage
 */

/**
 * Store JWT token in localStorage
 */
export const setToken = (token) => {
  localStorage.setItem('fitlog_token', token)
}

/**
 * Retrieve JWT token from localStorage
 */
export const getToken = () => {
  return localStorage.getItem('fitlog_token')
}

/**
 * Remove JWT token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('fitlog_token')
}

/**
 * Get authorization header for API requests
 */
export const getAuthHeader = () => {
  const token = getToken()
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

