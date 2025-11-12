// Exercise image helper
// Maps common exercise keywords to illustrative images (royalty-free sources)

const sources = {
  squats: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop',
  pushups: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1200&auto=format&fit=crop',
  plank: 'https://images.unsplash.com/photo-1599050751795-5cda78f3e5ed?q=80&w=1200&auto=format&fit=crop',
  lunges: 'https://images.unsplash.com/photo-1594385208970-3f93c021d2d0?q=80&w=1200&auto=format&fit=crop',
  burpees: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop',
  climbers: 'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop',
  deadlifts: 'https://images.unsplash.com/photo-1517963628607-235ccdd5476b?q=80&w=1200&auto=format&fit=crop',
  pullups: 'https://images.unsplash.com/photo-1534367610401-9f85e6b58e2a?q=80&w=1200&auto=format&fit=crop',
  rows: 'https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=1200&auto=format&fit=crop',
  dips: 'https://images.unsplash.com/photo-1578874691127-6b7925f7b7d9?q=80&w=1200&auto=format&fit=crop',
  jacks: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=1200&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop'
}

export function getExerciseImage(exercise) {
  const name = (exercise || '').toLowerCase()
  if (name.includes('squat')) return sources.squats
  if (name.includes('push')) return sources.pushups
  if (name.includes('plank')) return sources.plank
  if (name.includes('lunge')) return sources.lunges
  if (name.includes('burpee')) return sources.burpees
  if (name.includes('mountain') || name.includes('climb')) return sources.climbers
  if (name.includes('deadlift')) return sources.deadlifts
  if (name.includes('pull')) return sources.pullups
  if (name.includes('row')) return sources.rows
  if (name.includes('dip')) return sources.dips
  if (name.includes('jack')) return sources.jacks
  return sources.default
}

export default getExerciseImage


