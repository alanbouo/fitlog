# FitLog - Quick Start Guide

## Prerequisites

1. **Python 3.8+** installed
2. **Node.js 16+** and npm installed
3. Terminal/Command Prompt access

## Setup Instructions

### Step 1: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Install Frontend Dependencies

From the project root:
```bash
npm install
```

### Step 3: Start Backend Server

In the `backend` directory:
```bash
python app.py
```

Or on Windows:
```bash
cd backend
python app.py
```

The backend will run on `http://localhost:5000`

### Step 4: Start Frontend Server

In a new terminal, from the project root:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Using the App

1. **Open Browser**: Navigate to `http://localhost:5173`
2. **Sign Up**: Create a new account
   - Username, email, and password required
   - Password must be at least 6 characters
3. **Login**: Use your credentials to sign in
4. **Log Workout**: 
   - Enter exercise name (required)
   - Add sets, reps, and/or duration
   - Click "Log Workout"
   - AI suggestion appears immediately
5. **View Workouts**: See all your logged exercises
6. **Mark Complete**: Click "Complete" button on any workout
7. **Delete**: Remove workouts you don't want

## Demo Account

A demo account is automatically created on first run:
- **Username**: `demo`
- **Password**: `demo123`

## Troubleshooting

### Backend Issues
- Ensure port 5000 is not in use
- Check that all Python dependencies are installed
- Verify SQLite database file is created in `backend/fitlog.db`

### Frontend Issues
- Ensure port 5173 is not in use
- Clear browser cache if seeing old version
- Check browser console for errors

### Database Reset
Delete `backend/fitlog.db` to reset the database and start fresh.

## API Testing

You can test the API directly using curl or Postman:

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

## Project Structure

```
fitlog/
├── backend/
│   ├── app.py              # Flask main application
│   ├── models.py           # Database models (User, Workout)
│   ├── auth.py             # Authentication endpoints
│   ├── workouts.py         # Workout CRUD endpoints
│   ├── ai_suggestions.py   # AI suggestion logic (10 rules)
│   ├── requirements.txt    # Python dependencies
│   └── fitlog.db           # SQLite database (created on first run)
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Main app component with routing
│   ├── components/
│   │   ├── Login.jsx       # Login page
│   │   ├── Signup.jsx      # Signup page
│   │   └── Dashboard.jsx   # Main dashboard
│   └── api/
│       └── client.js       # Axios API client
├── index.html              # HTML entry point
├── package.json            # Node dependencies
└── vite.config.js          # Vite configuration
```

---

**Ready to build your fitness journey! 🏋️‍♂️**

