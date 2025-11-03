/**
 * Dashboard Page Component
 * Main app interface showing workouts, log form, and AI suggestions
 */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import WorkoutForm from '../components/WorkoutForm'
import WorkoutList from '../components/WorkoutList'
import AISuggestion from '../components/AISuggestion'

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [workouts, setWorkouts] = useState([])
  const [suggestion, setSuggestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch workouts and latest suggestion on mount
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [workoutsResponse, suggestionResponse] = await Promise.all([
        api.get('/workouts'),
        api.get('/workouts/suggestion')
      ])
      
      setWorkouts(workoutsResponse.data.workouts)
      setSuggestion(suggestionResponse.data.suggestion)
    } catch (err) {
      setError('Failed to load data')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleWorkoutAdded = (newWorkout, newSuggestion) => {
    // Add new workout to list
    setWorkouts([newWorkout, ...workouts])
    // Update suggestion
    setSuggestion(newSuggestion)
  }

  const handleWorkoutUpdated = (updatedWorkout) => {
    // Update workout in list
    setWorkouts(workouts.map(w => w.id === updatedWorkout.id ? updatedWorkout : w))
  }

  const handleWorkoutDeleted = (workoutId) => {
    // Remove workout from list
    setWorkouts(workouts.filter(w => w.id !== workoutId))
    // Refresh suggestion after deletion
    fetchData()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">FitLog</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Workout Form and AI Suggestion */}
          <div className="lg:col-span-1 space-y-6">
            <WorkoutForm onWorkoutAdded={handleWorkoutAdded} />
            <AISuggestion suggestion={suggestion} />
          </div>

          {/* Right Column: Workout List */}
          <div className="lg:col-span-2">
            <WorkoutList
              workouts={workouts}
              onWorkoutUpdated={handleWorkoutUpdated}
              onWorkoutDeleted={handleWorkoutDeleted}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

