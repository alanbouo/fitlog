/**
 * Workout List Component
 * Displays all logged workouts with complete/delete actions
 * Shows workout details: exercise, sets, reps, duration, timestamp
 */
import React from 'react'

function WorkoutList({ workouts, onMarkComplete, onDelete }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date'
    
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString()
  }

  if (workouts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 text-lg">No workouts logged yet</p>
        <p className="text-gray-400 text-sm mt-2">
          Start by logging your first workout using the form on the left!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        My Workouts ({workouts.length})
      </h2>

      <div className="space-y-3">
        {workouts.map((workout) => (
          <div
            key={workout.id}
            className={`border rounded-lg p-4 transition-all ${
              workout.completed
                ? 'bg-green-50 border-green-200'
                : 'bg-white border-gray-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {workout.exercise}
                  </h3>
                  {workout.completed && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                      ✓ Completed
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                  {workout.sets > 0 && (
                    <span>
                      <span className="font-medium">Sets:</span> {workout.sets}
                    </span>
                  )}
                  {workout.reps > 0 && (
                    <span>
                      <span className="font-medium">Reps:</span> {workout.reps}
                    </span>
                  )}
                  {workout.duration > 0 && (
                    <span>
                      <span className="font-medium">Duration:</span>{' '}
                      {workout.duration}s
                    </span>
                  )}
                  <span className="text-gray-400">
                    {formatDate(workout.timestamp)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                {!workout.completed && (
                  <button
                    onClick={() => onMarkComplete(workout.id)}
                    className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Complete
                  </button>
                )}
                <button
                  onClick={() => onDelete(workout.id)}
                  className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkoutList
