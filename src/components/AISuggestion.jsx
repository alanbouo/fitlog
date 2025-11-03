/**
 * AI Suggestion Component
 * Displays the latest AI workout suggestion
 */
import React from 'react'

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

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md p-6 border border-indigo-200">
      <div className="flex items-center mb-3">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 ml-2">AI Suggestion</h2>
      </div>
      
      <div className="space-y-3">
        <div>
          <h3 className="text-2xl font-bold text-indigo-700 mb-1">
            {suggestion.exercise}
          </h3>
          <p className="text-gray-700">{suggestion.reason}</p>
        </div>
        
        {(suggestion.sets || suggestion.reps || suggestion.duration) && (
          <div className="mt-4 pt-4 border-t border-indigo-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Suggested parameters:</p>
            <div className="flex flex-wrap gap-3 text-sm">
              {suggestion.sets && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                  {suggestion.sets} sets
                </span>
              )}
              {suggestion.reps && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                  {suggestion.reps} reps
                </span>
              )}
              {suggestion.duration && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                  {suggestion.duration}s
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AISuggestion

