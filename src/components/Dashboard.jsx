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
import { getExerciseData, ExerciseSVGIcon, ExerciseCard, ExerciseBadge } from '../utils/exerciseImages.jsx'

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 mb-8">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
          <div className="relative p-8 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-5xl">🏋️‍♀️</span>
                <h1 className="text-4xl font-bold text-white">FitLog</h1>
              </div>
              <p className="text-white/90 text-lg">Welcome back, <span className="font-semibold">{user.username || 'User'}</span>! 💪</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 font-semibold shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Workout Form and List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Workout Log Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                  <span className="text-2xl">📝</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Log Workout</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="exercise" className="block text-sm font-semibold text-gray-700 mb-2">
                    Exercise Name *
                  </label>
                  <input
                    id="exercise"
                    name="exercise"
                    type="text"
                    required
                    value={formData.exercise}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Squats, Push-ups, Plank"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="sets" className="block text-sm font-semibold text-gray-700 mb-2">
                      Sets
                    </label>
                    <input
                      id="sets"
                      name="sets"
                      type="number"
                      min="1"
                      value={formData.sets}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="reps" className="block text-sm font-semibold text-gray-700 mb-2">
                      Reps
                    </label>
                    <input
                      id="reps"
                      name="reps"
                      type="number"
                      min="0"
                      value={formData.reps}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration (sec)
                    </label>
                    <input
                      id="duration"
                      name="duration"
                      type="number"
                      min="0"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  {loading ? '⏳ Logging...' : '✨ Log Workout'}
                </button>
              </form>
            </div>

            {/* Workout List */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                  <span className="text-2xl">📊</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">My Workouts</h2>
              </div>
              {workouts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏃‍♂️</div>
                  <p className="text-gray-500 text-lg">No workouts logged yet. Start logging your exercises!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workouts.map((workout) => {
                    const exerciseData = getExerciseData(workout.exercise)
                    return (
                      <div
                        key={workout.id}
                        className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                          workout.completed 
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
                            : 'bg-white border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                          <div className={`w-full h-full rounded-full bg-gradient-to-br ${exerciseData.color} opacity-10`}></div>
                        </div>
                        <div className="relative p-5">
                          <div className="flex items-start gap-4">
                            <ExerciseSVGIcon exercise={workout.exercise} size="w-14 h-14" />
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h3 className="font-bold text-xl text-gray-900 mb-1">{workout.exercise}</h3>
                                  <ExerciseBadge exercise={workout.exercise} />
                                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                                    {workout.sets > 0 && (
                                      <div className="flex items-center gap-1">
                                        <span className="font-semibold">Sets:</span>
                                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md font-medium">{workout.sets}</span>
                                      </div>
                                    )}
                                    {workout.reps > 0 && (
                                      <div className="flex items-center gap-1">
                                        <span className="font-semibold">Reps:</span>
                                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md font-medium">{workout.reps}</span>
                                      </div>
                                    )}
                                    {workout.duration > 0 && (
                                      <div className="flex items-center gap-1">
                                        <span className="font-semibold">Duration:</span>
                                        <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-md font-medium">{workout.duration}s</span>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                    <span>🕒</span>
                                    {formatDate(workout.timestamp)}
                                  </p>
                                  {workout.completed && (
                                    <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 bg-green-500 text-white text-sm rounded-full font-semibold">
                                      <span>✓</span> Completed
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-col gap-2">
                                  {!workout.completed && (
                                    <button
                                      onClick={() => handleComplete(workout.id)}
                                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
                                    >
                                      ✓ Complete
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDelete(workout.id)}
                                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
                                  >
                                    🗑️ Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - AI Suggestion */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md">
                  <span className="text-2xl">🤖</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">AI Suggestion</h2>
              </div>
              {suggestion ? (
                <div className="space-y-4">
                  <ExerciseCard exercise={suggestion.exercise} className="shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <div>
                      <h3 className="font-bold text-2xl text-gray-900 mb-2">{suggestion.exercise}</h3>
                      <ExerciseBadge exercise={suggestion.exercise} />
                      <p className="text-sm text-gray-700 mt-3 leading-relaxed">{suggestion.reason}</p>
                    </div>
                  </ExerciseCard>
                  
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 space-y-3 border border-gray-200">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <span>📋</span>
                      <span>Suggested Parameters</span>
                    </h4>
                    {suggestion.sets && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Sets:</span>
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg font-bold text-lg">{suggestion.sets}</span>
                      </div>
                    )}
                    {suggestion.reps && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Reps:</span>
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg font-bold text-lg">{suggestion.reps}</span>
                      </div>
                    )}
                    {suggestion.duration && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Duration:</span>
                        <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-lg font-bold text-lg">{suggestion.duration}s</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-xs text-blue-900 font-medium flex items-center gap-2">
                      <span>💡</span>
                      <span>Tip: Follow the AI suggestion for optimal workout progression!</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-gray-500">Log a workout to get AI suggestions!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
