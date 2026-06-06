#!/bin/sh

# Start the FastAPI backend in the background
echo "Starting FastAPI backend on port 8000..."
cd /app/backend/src && uvicorn main:app --host 0.0.0.0 --port 8000 &

# Start the Next.js frontend in the foreground
# Cloud Run provides the PORT environment variable (usually 8080)
echo "Starting Next.js frontend on port ${PORT:-8080}..."
cd /app/frontend && npm start -- -p ${PORT:-8080}
