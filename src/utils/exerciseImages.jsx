/**
 * Exercise Images and Visual Representations
 * Maps exercises to their visual representations (icons/emojis and colors)
 */

export const exerciseData = {
  'squats': {
    icon: '🏋️',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
    category: 'Lower Body',
    description: 'Build leg strength and core stability'
  },
  'push-ups': {
    icon: '💪',
    color: 'from-red-400 to-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-900',
    category: 'Upper Body',
    description: 'Strengthen chest, shoulders, and triceps'
  },
  'plank': {
    icon: '🧘',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-900',
    category: 'Core',
    description: 'Build core endurance and stability'
  },
  'lunges': {
    icon: '🦵',
    color: 'from-green-400 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-900',
    category: 'Lower Body',
    description: 'Target legs and improve balance'
  },
  'burpees': {
    icon: '🔥',
    color: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-900',
    category: 'Full Body',
    description: 'High-intensity full-body movement'
  },
  'mountain climbers': {
    icon: '⛰️',
    color: 'from-teal-400 to-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-900',
    category: 'Cardio',
    description: 'Core and cardio combination'
  },
  'romanian deadlifts': {
    icon: '🏋️‍♀️',
    color: 'from-yellow-400 to-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-900',
    category: 'Lower Body',
    description: 'Posterior chain strength'
  },
  'pull-ups or rows': {
    icon: '🤸',
    color: 'from-indigo-400 to-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-900',
    category: 'Upper Body',
    description: 'Back and bicep development'
  },
  'dips': {
    icon: '💪',
    color: 'from-pink-400 to-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-900',
    category: 'Upper Body',
    description: 'Triceps and chest strength'
  },
  'jumping jacks': {
    icon: '🤾',
    color: 'from-cyan-400 to-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-900',
    category: 'Cardio',
    description: 'Cardio warm-up or finisher'
  },
  'default': {
    icon: '✨',
    color: 'from-gray-400 to-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-900',
    category: 'General',
    description: 'Custom exercise'
  }
}

/**
 * Get exercise data by name
 * @param {string} exerciseName - Name of the exercise
 * @returns {object} Exercise data including icon, colors, and metadata
 */
export function getExerciseData(exerciseName) {
  if (!exerciseName) return exerciseData['default']
  
  const normalized = exerciseName.toLowerCase().trim()
  
  // Check for exact match first
  if (exerciseData[normalized]) {
    return exerciseData[normalized]
  }
  
  // Check for partial match
  for (const [key, data] of Object.entries(exerciseData)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return data
    }
  }
  
  return exerciseData['default']
}

/**
 * SVG Icons for exercises
 */
export const ExerciseSVGIcon = ({ exercise, size = 'w-12 h-12' }) => {
  const data = getExerciseData(exercise)
  
  return (
    <div className={`${size} flex items-center justify-center rounded-full bg-gradient-to-br ${data.color} shadow-lg`}>
      <span className="text-2xl">{data.icon}</span>
    </div>
  )
}

/**
 * Exercise Card Component
 */
export const ExerciseCard = ({ exercise, children, className = '' }) => {
  const data = getExerciseData(exercise)
  
  return (
    <div className={`relative overflow-hidden rounded-xl ${data.bgColor} ${data.borderColor} border-2 ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
        <div className={`w-full h-full rounded-full bg-gradient-to-br ${data.color} opacity-20`}></div>
      </div>
      <div className="relative p-4">
        <div className="flex items-start gap-3">
          <ExerciseSVGIcon exercise={exercise} size="w-10 h-10" />
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Exercise Badge Component
 */
export const ExerciseBadge = ({ exercise }) => {
  const data = getExerciseData(exercise)
  
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${data.bgColor} ${data.textColor}`}>
      <span>{data.icon}</span>
      <span>{data.category}</span>
    </span>
  )
}
