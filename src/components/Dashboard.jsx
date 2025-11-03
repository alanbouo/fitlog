/**
 * Dashboard Component
 * Main app interface with workout logging and AI suggestions
 * Features:
 * - Workout log form (exercise, sets, reps, duration)
 * - List of logged workouts with complete/delete actions
 * - Display latest AI suggestion
 * - User logout functionality
 */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { workoutsAPI, authAPI } from '../api/client'

function Dashboard({ onLogout }) {
  const [workouts, setWorkouts] = useState([])
  const [suggestion, setSuggestion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    exercise: '',
    sets: 1,
    reps: 0,
    duration: 0,
  })
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // Load workouts and suggestion on mount
  useEffect(() => {
    loadWorkouts()
    loadSuggestion()
  }, [])

  const loadWorkouts = async () => {
    try {
      const response = await workoutsAPI.getAll()
      setWorkouts(response.data.workouts || [])
    } catch (err) {
      console.error('Failed to load workouts:', err)
    }
  }

  const loadSuggestion = async () => {
    try {
      const response = await workoutsAPI.getSuggestion()
      setSuggestion(response.data.suggestion)
    } catch (err) {
      console.error('Failed to load suggestion:', err)
    }
  }

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.exercise.trim()) {
      alert('Please enter an exercise name')
      return
    }

    setLoading(true)
    try {
      const response = await workoutsAPI.create(formData)
      
      // Add new workout to list
      setWorkouts([response.data.workout, ...workouts])
      
      // Update AI suggestion from response
      if (response.data.suggestion) {
        setSuggestion(response.data.suggestion)
      }
      
      // Reset form
      setFormData({ exercise: '', sets: 1, reps: 0, duration: 0 })
      
      // Reload to get updated list
      await loadWorkouts()
      await loadSuggestion()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to log workout')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (id) => {
    try {
      await workoutsAPI.markComplete(id)
      await loadWorkouts()
      await loadSuggestion()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to mark workout as complete')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return
    }

    try {
      await workoutsAPI.delete(id)
      await loadWorkouts()
      await loadSuggestion()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete workout')
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      onLogout()
      navigate('/login')
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FitLog</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.username || 'User'}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Workout Form and List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Workout Log Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Log Workout</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="exercise" className="block text-sm font-medium text-gray-700 mb-1">
                    Exercise Name *
                  </label>
                  <input
                    id="exercise"
                    name="exercise"
                    type="text"
                    required
                    value={formData.exercise}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Squats, Push-ups, Plank"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (sec)
                    </label>
                    <input
                      id="duration"
                      name="duration"
                      type="number"
                      min="0"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging...' : 'Log Workout'}
                </button>
              </form>
            </div>

            {/* Workout List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">My Workouts</h2>
              {workouts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No workouts logged yet. Start logging your exercises!</p>
              ) : (
                <div className="space-y-3">
                  {workouts.map((workout) => (
                    <div
                      key={workout.id}
                      className={`border rounded-lg p-4 ${
                        workout.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900">{workout.exercise}</h3>
                          <div className="mt-2 text-sm text-gray-600 space-x-4">
                            {workout.sets > 0 && <span>Sets: {workout.sets}</span>}
                            {workout.reps > 0 && <span>Reps: {workout.reps}</span>}
                            {workout.duration > 0 && <span>Duration: {workout.duration}s</span>}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(workout.timestamp)}</p>
                          {workout.completed && (
                            <span className="inline-block mt-2 px-2 py-1 bg-green-200 text-green-800 text-xs rounded">
                              ✓ Completed
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          {!workout.completed && (
                            <button
                              onClick={() => handleComplete(workout.id)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(workout.id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - AI Suggestion */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Suggestion</h2>
              {suggestion ? (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                  <h3 className="font-bold text-lg text-indigo-900 mb-2">{suggestion.exercise}</h3>
                  <p className="text-sm text-gray-700 mb-3">{suggestion.reason}</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    {suggestion.sets && <p>Suggested Sets: {suggestion.sets}</p>}
                    {suggestion.reps && <p>Suggested Reps: {suggestion.reps}</p>}
                    {suggestion.duration && <p>Suggested Duration: {suggestion.duration}s</p>}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Log a workout to get AI suggestions!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
