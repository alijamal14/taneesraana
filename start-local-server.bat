@echo off
echo Starting local HTTP server...
echo.
echo Open your browser and go to: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

REM Try Python 3 first
python -m http.server 8000 2>nul || (
    REM If Python 3 fails, try Python 2
    python -m SimpleHTTPServer 8000 2>nul || (
        REM If Python fails, try Node.js
        npx http-server -p 8000 2>nul || (
            echo ERROR: No suitable server found!
            echo Please install Python or Node.js to run a local server.
            echo.
            echo Alternative: Open index.html directly in your browser
            pause
        )
    )
)
