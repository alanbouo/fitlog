/**
 * AI Suggestion Component
 * Displays the latest AI workout suggestion
 */
import React from 'react'
import { getExerciseImage } from '../assets/exercises'

function AISuggestion({ suggestion }) {
  if (!suggestion) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">AI Suggestion</h2>
        <div className="text-center py-4 text-gray-500">
          <p>No suggestion available yet.</p>
        </div>
      </div>
    )
  }

  const img = getExerciseImage(suggestion.exercise)
  return (
    <div className="overflow-hidden rounded-xl shadow-md border border-indigo-100 bg-white">
      <div className="relative h-40 w-full">
        <img src={img} alt={suggestion.exercise} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-4 text-white">
          <div className="text-xs uppercase tracking-wider opacity-90">AI Suggestion</div>
          <h3 className="text-2xl font-bold">{suggestion.exercise}</h3>
        </div>
      </div>
      <div className="p-5">
        <p className="text-gray-700">{suggestion.reason}</p>
        {(suggestion.sets || suggestion.reps || suggestion.duration) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestion.sets && (
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                {suggestion.sets} sets
              </span>
            )}
            {suggestion.reps && (
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                {suggestion.reps} reps
              </span>
            )}
            {suggestion.duration && (
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                {suggestion.duration}s
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AISuggestion

