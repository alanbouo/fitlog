#!/bin/bash
# Startup script for FitLog backend

echo "Starting FitLog backend..."
echo "Installing dependencies..."
pip install -r requirements.txt

echo "Starting gunicorn server..."
gunicorn -w 4 -b 0.0.0.0:${PORT:-5000} app:app
