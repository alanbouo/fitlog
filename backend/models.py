"""
Database Models
SQLAlchemy models for User and Workout tables

User table: id, username, email, password_hash, created_at
Workout table: id, user_id, exercise, sets, reps, duration, completed, timestamp
"""
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# db instance - will be initialized in app.py using init_app()
db = SQLAlchemy()

class User(db.Model):
    """
    User Model
    Stores user authentication and profile information
    """
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship: One user can have many workouts
    workouts = db.relationship('Workout', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and store password securely"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verify password against hash"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user to dictionary (without password)"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Workout(db.Model):
    """
    Workout Model
    Stores individual workout logs with exercise details
    Fields: id, user_id, exercise, sets, reps, duration, completed, timestamp
    """
    __tablename__ = 'workouts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    exercise = db.Column(db.String(100), nullable=False)
    sets = db.Column(db.Integer, default=1)
    reps = db.Column(db.Integer, default=0)
    duration = db.Column(db.Integer, default=0)  # Duration in seconds
    completed = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        """Convert workout to dictionary for JSON response"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'exercise': self.exercise,
            'sets': self.sets,
            'reps': self.reps,
            'duration': self.duration,
            'completed': self.completed,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }
