"""
AI Workout Suggestions
Rule-based system with optional xAI (Grok) integration when XAI_API_KEY is set.
"""
import json
import os
from typing import List, Dict, Any

import requests

def _call_xai_chat_completion(history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Call xAI's Chat Completions API to get a JSON suggestion.

    Expects env variables:
      - XAI_API_KEY: API key
      - XAI_BASE_URL (optional): defaults to https://api.x.ai
      - XAI_MODEL (optional): defaults to grok-beta
    Returns a suggestion dict with keys: exercise, reason, sets?, reps?, duration?
    Raises on HTTP errors; caller should handle and fallback.
    """
    api_key = os.environ.get('XAI_API_KEY')
    if not api_key:
        raise RuntimeError('XAI_API_KEY not set')

    base_url = os.environ.get('XAI_BASE_URL', 'https://api.x.ai')
    model = os.environ.get('XAI_MODEL', 'grok-beta')

    system_prompt = (
        "You are a functional training coach. Given the user's recent workouts, "
        "suggest ONE next exercise. Return STRICT JSON with keys: exercise (string), "
        "reason (string), and optionally sets (int), reps (int), duration (int seconds). "
        "Keep parameters realistic."
    )

    user_prompt = {
        'recent_workouts': history
    }

    payload = {
        'model': model,
        'messages': [
            { 'role': 'system', 'content': system_prompt },
            { 'role': 'user', 'content': json.dumps(user_prompt) }
        ],
        'temperature': 0.3,
        'response_format': { 'type': 'json_object' }
    }

    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }

    url = f"{base_url}/v1/chat/completions"
    resp = requests.post(url, headers=headers, data=json.dumps(payload), timeout=20)
    resp.raise_for_status()
    data = resp.json()

    content = data.get('choices', [{}])[0].get('message', {}).get('content', '{}')
    suggestion = json.loads(content)

    # Basic validation
    if 'exercise' not in suggestion or 'reason' not in suggestion:
        raise ValueError('xAI response missing required keys')

    # Coerce numeric fields if present
    for k in ['sets', 'reps', 'duration']:
        if k in suggestion:
            try:
                suggestion[k] = int(suggestion[k])
            except Exception:
                suggestion.pop(k, None)

    return suggestion

def get_next_suggestion(exercise: str, recent_workouts: List[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Returns next suggested exercise.
    - If XAI_API_KEY is set, queries xAI using recent workouts context.
    - Otherwise, uses rule-based fallback below.
    """
    # Try xAI if configured
    try:
        if os.environ.get('XAI_API_KEY') and recent_workouts is not None:
            return _call_xai_chat_completion(recent_workouts)
    except Exception:
        # Any failure falls back to rules
        pass

    # Rule-based fallback
    exercise_lower = (exercise or '').lower().strip()
    
    # Rule 1: Squats → Push-ups
    if 'squat' in exercise_lower:
        return {
            'exercise': 'Push-ups',
            'reason': 'Great leg work! Now balance with upper body strength training.',
            'sets': 3,
            'reps': 10
        }
    
    # Rule 2: Push-ups → Plank
    if 'push' in exercise_lower or 'pushup' in exercise_lower:
        return {
            'exercise': 'Plank',
            'reason': 'Core strength follows upper body work. Hold for 30-60 seconds.',
            'sets': 3,
            'duration': 45
        }
    
    # Rule 3: Plank → Lunges
    if 'plank' in exercise_lower:
        return {
            'exercise': 'Lunges',
            'reason': 'Core done! Now target your legs with lunges for balance and strength.',
            'sets': 3,
            'reps': 12
        }
    
    # Rule 4: Lunges → Burpees
    if 'lunge' in exercise_lower:
        return {
            'exercise': 'Burpees',
            'reason': 'Full-body explosive movement to boost your heart rate!',
            'sets': 3,
            'reps': 8
        }
    
    # Rule 5: Burpees → Mountain Climbers
    if 'burpee' in exercise_lower:
        return {
            'exercise': 'Mountain Climbers',
            'reason': 'Keep the cardio going with this core and cardio combo.',
            'sets': 3,
            'duration': 30
        }
    
    # Rule 6: Mountain Climbers → Deadlifts (bodyweight)
    if 'mountain' in exercise_lower or 'climber' in exercise_lower:
        return {
            'exercise': 'Romanian Deadlifts',
            'reason': 'Time for posterior chain strength. Focus on hamstrings and glutes.',
            'sets': 3,
            'reps': 10
        }
    
    # Rule 7: Deadlifts → Pull-ups / Rows
    if 'deadlift' in exercise_lower:
        return {
            'exercise': 'Pull-ups or Rows',
            'reason': 'Balance that pull movement! Target your back muscles.',
            'sets': 3,
            'reps': 8
        }
    
    # Rule 8: Pull-ups/Rows → Dips
    if 'pull' in exercise_lower or 'row' in exercise_lower:
        return {
            'exercise': 'Dips',
            'reason': 'Complement your pull with a push. Target triceps and chest.',
            'sets': 3,
            'reps': 10
        }
    
    # Rule 9: Dips → Jumping Jacks
    if 'dip' in exercise_lower:
        return {
            'exercise': 'Jumping Jacks',
            'reason': 'Cardio finisher! Get your heart rate up with this classic move.',
            'sets': 3,
            'reps': 20
        }
    
    # Rule 10: Jumping Jacks → Squats (cycle back)
    if 'jumping' in exercise_lower or 'jack' in exercise_lower:
        return {
            'exercise': 'Squats',
            'reason': 'Cycle complete! Start fresh with squats for lower body strength.',
            'sets': 3,
            'reps': 15
        }
    
    # Default suggestion if exercise doesn't match any rule
    return {
        'exercise': 'Squats',
        'reason': 'Try squats to build lower body strength and mobility!',
        'sets': 3,
        'reps': 12
    }

