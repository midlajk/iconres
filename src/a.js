// const CACHE_NAME = 'restaurant-app-v1';
// const ASSETS = [
//   '/',
//   '/index.html',
//   '/static/js/bundle.js',
//   '/static/js/main.chunk.js',
//   '/static/js/1.chunk.js',
//   '/static/css/main.chunk.css',
//   '/favicon.ico',
//   '/manifest.json'
// ];

// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(cache => cache.addAll(ASSETS))
//       .then(() => self.skipWaiting())
//   );
// });

// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request)
//       .then(response => response || fetch(event.request))
//   );
// });
/* eslint-disable no-restricted-globals, no-undef */
const CACHE_NAME = 'restaurant-app-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/js/main.chunk.js',
  '/static/js/1.chunk.js',
  '/static/css/main.chunk.css',
  '/favicon.ico',
  '/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Delete old caches
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});