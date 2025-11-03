/**
 * API Service
 * Centralized API communication with Flask backend
 * Handles authentication tokens and all HTTP requests
 */
import axios from 'axios'

const API_BASE_URL = '/api'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token management helpers
export const getToken = () => {
  return localStorage.getItem('token')
}

export const setToken = (token) => {
  localStorage.setItem('token', token)
}

export const removeToken = () => {
  localStorage.removeItem('token')
}

// Request interceptor: Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = getToken()
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
      // Token expired or invalid
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API endpoints
export const authAPI = {
  signup: async (username, email, password) => {
    const response = await api.post('/auth/signup', {
      username,
      email,
      password,
    })
    return response.data
  },

  login: async (username, password) => {
    const response = await api.post('/auth/login', {
      username,
      password,
    })
    return response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    removeToken()
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

// Workout API endpoints
export const workoutAPI = {
  createWorkout: async (workoutData) => {
    const response = await api.post('/workouts', workoutData)
    return response.data
  },

  getWorkouts: async () => {
    const response = await api.get('/workouts')
    return response.data
  },

  markComplete: async (workoutId) => {
    const response = await api.put(`/workouts/${workoutId}/complete`)
    return response.data
  },

  deleteWorkout: async (workoutId) => {
    const response = await api.delete(`/workouts/${workoutId}`)
    return response.data
  },

  getLatestSuggestion: async () => {
    const response = await api.get('/workouts/suggestion')
    return response.data
  },
}

export default api
