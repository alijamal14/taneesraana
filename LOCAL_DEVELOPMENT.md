# 🚀 Local Development Guide

## Quick Start Server

### Option 1: Using the Batch File
```bash
# Double-click or run in terminal:
start-local-server.bat
```

### Option 2: Using Python (Recommended)
```bash
# Navigate to project folder
cd "C:\Users\alija\source\repos\taneesraana"

# Start Python server
python -m http.server 8000
# OR
python3 -m http.server 8000
```

### Option 3: Using npm
```bash
# Install dependencies first (one time)
npm install -g http-server

# Start server
npm run serve
# OR
npx http-server -p 8000
```

### Option 4: Using Node.js Live Server
```bash
# Install live-server globally
npm install -g live-server

# Start with auto-reload
npm run serve
```

## Access the Website
- **Local URL:** http://localhost:8000
- **Direct File:** Open `index.html` in browser

## Troubleshooting IIS Permission Issues

If you get HTTP 401.3 errors with IIS:

1. **Use Python/Node.js servers instead** (recommended for development)
2. **Or fix IIS permissions:**
   - Right-click project folder → Properties → Security
   - Add "IIS_IUSRS" with Read & Execute permissions
   - Add "Everyone" with Read permissions

## Project Structure
```
taneesraana/
├── index.html          # Main website file
├── styles.css          # Styling and layout
├── script.js           # JavaScript functionality
├── sw.js              # Service worker for PWA
├── start-local-server.bat  # Local server launcher
├── package.json       # npm configuration
└── README.md         # Project documentation
```

## Development Tips
- Use Python HTTP server for quick testing
- Use Live Server for auto-reload during development
- All styles are in `styles.css` - fully responsive
- Website works offline (PWA enabled)
