/**
 * API Client Configuration
 * Axios instance with JWT token management
 * Handles authentication headers and error responses
 */
import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor: Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API methods
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
}

// Workouts API methods
export const workoutsAPI = {
  create: (data) => api.post('/workouts', data),
  getAll: () => api.get('/workouts'),
  markComplete: (id) => api.put(`/workouts/${id}/complete`),
  delete: (id) => api.delete(`/workouts/${id}`),
  getSuggestion: () => api.get('/workouts/suggestion'),
}

export default api

