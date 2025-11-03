# FitLog - AI Functional Training App

A secure full-stack workout logging application with AI-powered exercise suggestions.

## Features

- 🔐 **JWT Authentication**: Secure signup/login/logout
- 📝 **Workout Logging**: Track exercises with sets, reps, and duration
- 🤖 **AI Suggestions**: Rule-based next exercise recommendations
- ✅ **Progress Tracking**: Mark workouts as complete
- 🗑️ **Workout Management**: Delete unwanted entries
- 📊 **Dashboard**: View all workouts and latest AI suggestion

## Tech Stack

### Backend
- **Flask**: Python web framework
- **SQLite**: Lightweight database
- **Flask-JWT-Extended**: JWT authentication
- **Flask-SQLAlchemy**: ORM for database operations
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls

## Installation

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create an environment file (optional, recommended):
```bash
copy backend\.env.example backend\.env   # Windows
```
Then edit `backend/.env` and set at least `SECRET_KEY`, `JWT_SECRET_KEY`, and optionally `XAI_API_KEY`.

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Run Flask server:
```bash
flask run
# Or directly:
python app.py
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Install dependencies (from project root):
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Usage

1. **Sign Up**: Create a new account with username, email, and password
2. **Login**: Authenticate with your credentials
3. **Log Workout**: Fill in exercise name, sets, reps, and/or duration
4. **View Suggestions**: See AI-recommended next exercise based on your latest workout
5. **Mark Complete**: Check off completed workouts
6. **Delete**: Remove unwanted workout entries

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Workouts
- `POST /api/workouts` - Create workout (returns AI suggestion)
- `GET /api/workouts` - Get all user workouts
- `PUT /api/workouts/<id>/complete` - Mark workout as complete
- `DELETE /api/workouts/<id>` - Delete workout
- `GET /api/workouts/suggestion` - Get latest AI suggestion

## AI Suggestions: Rules and optional xAI

By default, the app uses 10 rule-based suggestions. You can optionally enable xAI (Grok) so suggestions are generated dynamically from your recent workout history. When xAI is enabled, the backend will use xAI and gracefully fall back to rules on any error.

### Enable xAI (optional)

1. Set your xAI API key before starting the backend:
```bash
# Windows PowerShell
$env:XAI_API_KEY="your_key_here"
# (Optional) customize model and base URL
$env:XAI_MODEL="grok-beta"
$env:XAI_BASE_URL="https://api.x.ai"
```

2. Ensure backend deps are installed (adds `requests`):
```bash
cd backend
pip install -r requirements.txt
```

3. Start Flask normally. If `XAI_API_KEY` is set, suggestions will use xAI.

### Rule set

The app uses 10 rule-based suggestions:

1. Squats → Push-ups
2. Push-ups → Plank
3. Plank → Lunges
4. Lunges → Burpees
5. Burpees → Mountain Climbers
6. Mountain Climbers → Romanian Deadlifts
7. Deadlifts → Pull-ups/Rows
8. Pull-ups/Rows → Dips
9. Dips → Jumping Jacks
10. Jumping Jacks → Squats (cycles back)

## Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password_hash`
- `created_at`

### Workouts Table
- `id` (Primary Key)
- `user_id` (Foreign Key to Users)
- `exercise` (Exercise name)
- `sets`
- `reps`
- `duration` (seconds)
- `completed` (boolean)
- `timestamp`

## Development Notes

- Backend uses SQLite database stored in `backend/fitlog.db`
- JWT tokens expire after 24 hours
- All API endpoints except auth require JWT token in `Authorization: Bearer <token>` header
- Frontend automatically handles token storage and refresh

## Security

- Passwords are hashed using Werkzeug's password hashing
- JWT tokens for secure authentication
- CORS enabled for React frontend only
- Input validation on all endpoints

---

Built for builder's backlog - A complete full-stack training application!
