"""
Flask Application Entry Point
Main app configuration, database setup, and route registration
"""
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db, User, Workout
from datetime import timedelta
import os
from dotenv import load_dotenv

# Import blueprints (must be after db initialization)
from auth import auth_bp
from workouts import workouts_bp

def create_app():
    """
    Application factory pattern
    Creates and configures Flask app instance
    """
    app = Flask(__name__)
    
    # Load environment variables from .env (support both project root and backend folder)
    basedir = os.path.abspath(os.path.dirname(__file__))
    load_dotenv(os.path.join(basedir, '.env'))
    load_dotenv(os.path.join(os.path.dirname(basedir), '.env'))
    
    # Enable CORS for React frontend (allows cross-origin requests)
    cors_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000')
    origins_list = [origin.strip() for origin in cors_origins.split(',')]
    CORS(app, origins=origins_list)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', f'sqlite:///{os.path.join(basedir, "fitlog.db")}')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    from datetime import timedelta
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)  # Tokens expire after 24 hours
    
    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(workouts_bp, url_prefix='/api/workouts')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 errors"""
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        """Handle 500 errors"""
        return jsonify({'error': 'Internal server error'}), 500
    
    # Initialize database tables
    with app.app_context():
        db.create_all()
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint for monitoring"""
        return jsonify({
            'status': 'healthy',
            'message': 'FitLog API is running'
        }), 200
    
    return app

# Create app instance for gunicorn
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
