# PowerShell script to start both frontend and backend
Write-Host "Starting Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd aegis-gpt/backend/src; uvicorn main:app --reload --port 8000"

Write-Host "Starting Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd aegis-gpt/frontend; pnpm dev"

Write-Host "Both services are starting in new windows!" -ForegroundColor Yellow
