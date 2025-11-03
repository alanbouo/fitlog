/**
 * Workout Form Component
 * Form for logging new workouts
 * Fields: exercise name, sets, reps, duration
 * Shows AI suggestion below form
 */
import React, { useState } from 'react'
import { workoutAPI } from '../services/api'

function WorkoutForm({ onAddWorkout, suggestion }) {
  const [formData, setFormData] = useState({
    exercise: '',
    sets: 1,
    reps: 0,
    duration: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const value =
      e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!formData.exercise.trim()) {
      setError('Exercise name is required')
      setLoading(false)
      return
    }

    try {
      await onAddWorkout(formData)
      
      // Reset form on success
      setFormData({
        exercise: '',
        sets: 1,
        reps: 0,
        duration: 0,
      })
      setSuccess('Workout logged successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to log workout. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Pre-fill form with suggestion if available
  const useSuggestion = () => {
    if (suggestion) {
      setFormData({
        exercise: suggestion.exercise,
        sets: suggestion.sets || 1,
        reps: suggestion.reps || 0,
        duration: suggestion.duration || 0,
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Log Workout
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm">
            {success}
          </div>
        )}

        {/* Exercise Name */}
        <div>
          <label htmlFor="exercise" className="block text-sm font-medium text-gray-700 mb-1">
            Exercise Name *
          </label>
          <div className="flex gap-2">
            <input
              id="exercise"
              name="exercise"
              type="text"
              required
              value={formData.exercise}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Squats, Push-ups"
            />
            {suggestion && (
              <button
                type="button"
                onClick={useSuggestion}
                className="px-3 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                title="Use AI suggestion"
              >
                Use AI
              </button>
            )}
          </div>
        </div>

        {/* Sets */}
        <div>
          <label htmlFor="sets" className="block text-sm font-medium text-gray-700 mb-1">
            Sets
          </label>
          <input
            id="sets"
            name="sets"
            type="number"
            min="1"
            value={formData.sets}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Reps */}
        <div>
          <label htmlFor="reps" className="block text-sm font-medium text-gray-700 mb-1">
            Reps
          </label>
          <input
            id="reps"
            name="reps"
            type="number"
            min="0"
            value={formData.reps}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0 if time-based"
          />
        </div>

        {/* Duration (seconds) */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Duration (seconds)
          </label>
          <input
            id="duration"
            name="duration"
            type="number"
            min="0"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0 if rep-based"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Logging...' : 'Log Workout'}
        </button>
      </form>
    </div>
  )
}

export default WorkoutForm
