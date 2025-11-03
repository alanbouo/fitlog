/**
 * Workouts API Client
 * Functions for making workout-related API calls
 */
import { getAuthHeader } from '../utils/auth'

const API_BASE = '/api'

/**
 * Create a new workout and get AI suggestion
 */
export const createWorkout = async (workoutData) => {
  const response = await fetch(`${API_BASE}/workouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(workoutData)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create workout')
  }
  
  return response.json()
}

/**
 * Get all workouts for current user
 */
export const getWorkouts = async () => {
  const response = await fetch(`${API_BASE}/workouts`, {
    headers: getAuthHeader()
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch workouts')
  }
  
  return response.json()
}

/**
 * Mark a workout as completed
 */
export const markWorkoutComplete = async (workoutId) => {
  const response = await fetch(`${API_BASE}/workouts/${workoutId}/complete`, {
    method: 'PUT',
    headers: getAuthHeader()
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to mark workout complete')
  }
  
  return response.json()
}

/**
 * Delete a workout
 */
export const deleteWorkout = async (workoutId) => {
  const response = await fetch(`${API_BASE}/workouts/${workoutId}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete workout')
  }
  
  return response.json()
}

/**
 * Get latest AI suggestion
 */
export const getLatestSuggestion = async () => {
  const response = await fetch(`${API_BASE}/workouts/suggestion`, {
    headers: getAuthHeader()
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to get suggestion')
  }
  
  return response.json()
}

