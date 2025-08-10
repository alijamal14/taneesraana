// Service Worker for Auto-Update
// Service Worker for Dr. Tanees Raana Website
const CACHE_NAME = 'dr-tanees-raana-v1.0.8';
const VERSION_CHECK_INTERVAL = 30000; // Check for updates every 30 seconds

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/version.json',
  '/manifest.webmanifest'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim all clients immediately
  self.clients.claim();
});

// Fetch event - Network first strategy for version.json, cache first for others
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('version.json')) {
    // Always fetch version.json from network to check for updates
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response before caching
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request);
        })
    );
  } else {
    // Cache first strategy for other resources
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch from network
          return response || fetch(event.request);
        })
    );
  }
});

// Listen for messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Check for updates periodically
setInterval(() => {
  checkForUpdates();
}, VERSION_CHECK_INTERVAL);

async function checkForUpdates() {
  try {
    const response = await fetch('/version.json?' + Date.now());
    const newVersion = await response.json();
    
    // Get current version from cache
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match('/version.json');
    
    if (cachedResponse) {
      const currentVersion = await cachedResponse.json();
      
      if (newVersion.version !== currentVersion.version) {
        // New version available, notify all clients
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'UPDATE_AVAILABLE',
            version: newVersion.version
          });
        });
      }
    }
  } catch (error) {
    console.log('Failed to check for updates:', error);
  }
}
