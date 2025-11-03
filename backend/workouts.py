"""
Workouts Blueprint
Endpoints for workout CRUD operations with AI suggestions
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Workout
from ai_suggestions import get_next_suggestion

workouts_bp = Blueprint('workouts', __name__)

@workouts_bp.route('', methods=['POST'])
@jwt_required()
def create_workout():
    """Create a new workout and get AI suggestion"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        # Extract workout data
        exercise = data.get('exercise')
        sets = data.get('sets', 1)
        reps = data.get('reps', 0)
        duration = data.get('duration', 0)
        
        if not exercise:
            return jsonify({'error': 'Exercise name is required'}), 400
        
        # Create workout
        new_workout = Workout(
            user_id=user_id,
            exercise=exercise,
            sets=sets,
            reps=reps,
            duration=duration
        )
        
        db.session.add(new_workout)
        db.session.commit()
        
        # Prepare recent history (most recent first, limited)
        recent = Workout.query.filter_by(user_id=user_id).order_by(Workout.timestamp.desc()).limit(5).all()
        recent_payload = [w.to_dict() for w in recent]

        # Get AI suggestion (xAI if configured, else rule-based)
        suggestion = get_next_suggestion(exercise, recent_workouts=recent_payload)
        
        return jsonify({
            'workout': new_workout.to_dict(),
            'suggestion': suggestion,
            'message': 'Workout logged successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@workouts_bp.route('', methods=['GET'])
@jwt_required()
def get_workouts():
    """Get all workouts for the current user"""
    try:
        user_id = int(get_jwt_identity())
        
        # Get workouts ordered by most recent first
        workouts = Workout.query.filter_by(user_id=user_id).order_by(Workout.timestamp.desc()).all()
        
        return jsonify({
            'workouts': [workout.to_dict() for workout in workouts]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@workouts_bp.route('/<int:workout_id>/complete', methods=['PUT'])
@jwt_required()
def mark_complete(workout_id):
    """Mark a workout as completed"""
    try:
        user_id = int(get_jwt_identity())
        
        workout = Workout.query.filter_by(id=workout_id, user_id=user_id).first()
        
        if not workout:
            return jsonify({'error': 'Workout not found'}), 404
        
        workout.completed = True
        db.session.commit()
        
        return jsonify({
            'workout': workout.to_dict(),
            'message': 'Workout marked as completed'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@workouts_bp.route('/<int:workout_id>', methods=['DELETE'])
@jwt_required()
def delete_workout(workout_id):
    """Delete a workout"""
    try:
        user_id = get_jwt_identity()
        
        workout = Workout.query.filter_by(id=workout_id, user_id=user_id).first()
        
        if not workout:
            return jsonify({'error': 'Workout not found'}), 404
        
        db.session.delete(workout)
        db.session.commit()
        
        return jsonify({'message': 'Workout deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@workouts_bp.route('/suggestion', methods=['GET'])
@jwt_required()
def get_latest_suggestion():
    """Get AI suggestion based on latest workout"""
    try:
        user_id = get_jwt_identity()
        
        # Get latest workout
        latest_workout = Workout.query.filter_by(user_id=user_id).order_by(Workout.timestamp.desc()).first()
        
        if not latest_workout:
            return jsonify({
                'suggestion': {
                    'exercise': 'Start with squats',
                    'reason': 'No workouts logged yet. Great starting exercise!'
                }
            }), 200
        
        # Prepare recent history
        recent = Workout.query.filter_by(user_id=user_id).order_by(Workout.timestamp.desc()).limit(5).all()
        recent_payload = [w.to_dict() for w in recent]

        # Get suggestion based on latest workout (xAI if configured)
        suggestion = get_next_suggestion(latest_workout.exercise, recent_workouts=recent_payload)
        
        return jsonify({'suggestion': suggestion}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

