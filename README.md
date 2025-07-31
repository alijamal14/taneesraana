# Auto-Update System for Dr. Tanees Raana Website

This website includes an automated update system that ensures clients always see the latest version without manually clearing their cache.

## How It Works

### 1. Service Worker
- Automatically caches website resources
- Checks for updates every 30 seconds
- Notifies users when new versions are available

### 2. Version Management
- `version.json` tracks the current version
- Cache busting parameters (`?v=1.0.0`) ensure fresh resources
- Automatic version bumping script

### 3. User Experience
- Users see a notification when updates are available
- One-click update with automatic page reload
- No manual cache clearing required

## For Developers

### Making Updates

1. **Make your changes** to HTML, CSS, or JavaScript files

2. **Bump the version** using one of these commands:
   ```bash
   # For small fixes/changes
   npm run update-patch
   
   # For new features
   npm run update-minor
   
   # For major changes
   npm run update-major
   ```

3. **Deploy the files** to your web server

4. **Clients will automatically see** the update notification within 30-60 seconds

### Manual Version Update
If you prefer to update versions manually:
```bash
node update-version.js patch
```

### Testing Locally
Start a local server to test:
```bash
# Using Python
npm run serve

# Using PHP
npm run serve-php
```

## Files Overview

- `version.json` - Version tracking
- `sw.js` - Service Worker for caching and update detection
- `update-version.js` - Automated version bumping script
- `script.js` - Enhanced with auto-update functionality
- `index.html` - Updated with cache busting and update notifications

## Features

✅ **Automatic Updates** - No manual cache clearing needed
✅ **Version Notifications** - Users see when updates are available  
✅ **Cache Busting** - Fresh resources every time
✅ **Service Worker** - Offline support and update management
✅ **Easy Version Management** - Simple commands to bump versions
✅ **Mobile Friendly** - Update notifications work on all devices

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support (iOS 11.3+)
- Internet Explorer: Basic support (no service worker)

## Configuration

You can modify update check intervals in:
- `sw.js` - `VERSION_CHECK_INTERVAL` (Service Worker checks)
- `script.js` - `AUTO_UPDATE.VERSION_CHECK_INTERVAL` (Page-level checks)

## Troubleshooting

**Updates not showing?**
- Check browser console for errors
- Verify `version.json` is accessible
- Ensure service worker is registered

**Service worker not working?**
- Must be served over HTTPS in production
- localhost works for development
- Check browser developer tools → Application → Service Workers

## Deployment to IIS

This website uses a **separate development and production deployment** structure for security and best practices.

### Directory Structure
```
📁 Development:  C:\Users\Administrator\source\repos\Websites\MK\TaneesRaana\
📁 Production:   D:\iis\TaneesRaana\
🌐 IIS Site:     http://taneesraana.mk313.com
```

### Production Deployment

#### Quick Deployment (Recommended)
```batch
# Run the deployment batch file
deploy.bat
```

#### PowerShell Deployment
```powershell
# Deploy with version update
.\deploy.ps1 patch

# Deploy with minor version update
.\deploy.ps1 minor

# Deploy with major version update  
.\deploy.ps1 major
```

#### Manual Deployment Steps
1. **Update Version:**
   ```bash
   node update-version.js patch
   ```

2. **Copy Files to Production:**
   ```powershell
   # Copy production files only
   Copy-Item "index.html" "D:\iis\TaneesRaana\" -Force
   Copy-Item "styles.css" "D:\iis\TaneesRaana\" -Force
   Copy-Item "script.js" "D:\iis\TaneesRaana\" -Force
   Copy-Item "sw.js" "D:\iis\TaneesRaana\" -Force
   Copy-Item "version.json" "D:\iis\TaneesRaana\" -Force
   ```

### IIS Configuration

#### Current Hosting Setup
- **Website Name:** TaneesRaana
- **Hostname:** taneesraana.mk313.com
- **Port:** 80 (HTTP)
- **Physical Path:** D:\iis\TaneesRaana
- **Application Pool:** DefaultAppPool

#### Access URLs
- **Public:** http://taneesraana.mk313.com
- **Local:** http://localhost (with host header: taneesraana.mk313.com)

### Security Features

✅ **Development files excluded** from production deployment
✅ **Source code protection** - .git, node_modules, scripts not accessible
✅ **Clean production environment** - Only necessary files deployed
✅ **Proper MIME types** - JavaScript and JSON served correctly
✅ **Service Worker support** - Proper headers for PWA functionality

### Files Deployed to Production
- `index.html` - Main website
- `styles.css` - Styling
- `script.js` - JavaScript functionality
- `sw.js` - Service Worker
- `version.json` - Version tracking

### Files Excluded from Production
- `package.json` - Development dependencies
- `update-version.js` - Version management script
- `deploy.ps1` / `deploy.bat` - Deployment scripts
- `README.md` - Documentation
- `.gitignore` - Git configuration
- `.git/` - Git repository

### Deployment Verification

After deployment, the system automatically:
1. ✅ Verifies website accessibility
2. ✅ Checks Service Worker functionality
3. ✅ Confirms version.json is accessible
4. ✅ Tests auto-update system

### Troubleshooting

**Common Issues:**
- **500 Error:** Remove web.config if MIME type conflicts occur
- **404 Not Found:** Verify IIS site physical path points to D:\iis\TaneesRaana
- **Service Worker Not Loading:** Ensure proper MIME types are configured in IIS
- **Updates Not Working:** Check version.json is accessible and not cached

**Logs Location:**
- IIS Logs: `C:\inetpub\logs\LogFiles\W3SVC*\`
- Event Viewer: Windows Logs > Application
