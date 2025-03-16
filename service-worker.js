// Service Worker for Sexy Jenga PWA
const CACHE_NAME = 'sexy-jenga-cache-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './pwa.js',
    './manifest.json',
    './logo.svg',
    './icons/icon-72x72.png',
    './icons/icon-96x96.png',
    './icons/icon-128x128.png',
    './icons/icon-144x144.png',
    './icons/icon-152x152.png',
    './icons/icon-192x192.png',
    './icons/icon-384x384.png',
    './icons/icon-512x512.png',
    './favicon.ico',
    './favicon.svg',
    'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
    'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4.woff2',
    'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2',
    'https://fonts.gstatic.com/s/pacifico/v22/FwZY7-Qmy14u9lezJ-6H6Mk.woff2'
];

// Install event - cache all static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Helper function to clean URLs of challenge parameters
function cleanUrl(url) {
    const urlObj = new URL(url);
    // If this is our main page with challenges parameter, strip it for caching
    if (urlObj.pathname === '/' || urlObj.pathname === '/index.html') {
        urlObj.search = '';
    }
    return urlObj.toString();
}

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Handle the fetch event
    event.respondWith(
        caches.match(cleanUrl(event.request.url))
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request because it's a one-time use stream
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(response => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response because it's a one-time use stream
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            // Don't cache if it's a data URL
                            if (event.request.url.startsWith('data:')) return response;

                            // Cache the cleaned URL version (without challenge parameters)
                            cache.put(cleanUrl(event.request.url), responseToCache);
                        });

                    return response;
                }).catch(() => {
                    // If fetch fails (e.g., offline), try to return a fallback
                    if (event.request.url.indexOf('.html') > -1 ||
                        event.request.url === '/') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});

// Handle updates when new content is available
self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
}); 