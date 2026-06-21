@echo off
REM Try python, python3, then npx http-server
set PORT=8000
npython -m http.server %PORT% 2>nul || python3 -m http.server %PORT% 2>nul || npx http-server -p %PORT% || (
  echo No Python or npx found. Install Python or Node.js.
  echo Quick commands:
  echo   python -m http.server 8000
  echo   npx http-server -p 8000
)
