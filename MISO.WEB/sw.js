/**
 * MISO WEB - Service Worker
 * Offline-First PWA Strategy
 * 
 * Estrategias implementadas:
 * - Cache-first para assets estáticos (HTML, CSS, JS, imágenes)
 * - Network-first para APIs (con fallback a caché)
 * - Precaching de recursos críticos
 */

// Nombre del cache con versión
const VERSION = 'v4.0.0';
const CACHE_NAME = `miso-web-${VERSION}`;

// Recursos críticos que se precachean al instalar
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './src/styles/main.css',
  './src/core/orchestrator.js',
  './src/legacy/app.js',
  './src/legacy/db.js',
  './assets/images/logo_miso.png',
  './assets/images/logo_gijh.png',
  './assets/images/misoapp.png',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
  'https://unpkg.com/dexie@4.0.10/dist/dexie.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Install event - Precaching
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching critical assets');
        // Usamos un mapeo individual para que un fallo en un recurso (como un 404) 
        // no bloquee la instalación completa del Service Worker
        return Promise.all(
          PRECACHE_ASSETS.map(url => 
            cache.add(url).catch(err => console.warn(`[SW] No se pudo cachear (omitido): ${url}`))
          )
        );
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Precaching failed:', err);
      })
  );
});

// Activate event - Limpiar caches antiguos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => !name.includes(VERSION))
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Clients claim');
        return self.clients.claim();
      })
  );
});

// Fetch event - Estrategia cache-first para src/ y assets/, network-first para HTML
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests except fonts and CDNs
  if (url.origin !== location.origin) {
    if (!url.hostname.includes('fonts.googleapis.com') &&
        !url.hostname.includes('fonts.gstatic.com') &&
        !url.hostname.includes('unpkg.com') &&
        !url.hostname.includes('cdnjs.cloudflare.com')) {
      return;
    }
  }

  // Request strategy based on type
  if (request.method !== 'GET') {
    return;
  }

  // Cache-first para archivos en /src/ y /assets/
  if (url.pathname.includes('/src/') || url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached and update in background
            fetch(request).then((response) => {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, response);
              });
            }).catch(() => {});
            return cachedResponse;
          }

          // Not in cache, fetch from network and cache
          return fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
              return response;
            })
            .catch(() => {
              // Return offline fallback for images
              if (request.destination === 'image') {
                return new Response(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="#f3f4f6" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="#9ca3af">Offline</text></svg>',
                  { headers: { 'Content-Type': 'image/svg+xml' } }
                );
              }
              return null;
            });
        })
    );
    return;
  }

  // HTML navigation requests - Network first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('./index.html');
          });
        })
    );
    return;
  }

  // Para archivos de vistas, usar network-first
  if (url.pathname.includes('/views/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Static assets (CSS, JS, Images, Fonts) - Cache first with network fallback
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached and update in background
          fetch(request).then((response) => {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response);
            });
          }).catch(() => {});
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // Return offline fallback for images
            if (request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="#f3f4f6" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="#9ca3af">Offline</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
            return null;
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for future implementation
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    console.log('[SW] Background sync triggered');
  }
});

// Push notifications for future implementation
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    console.log('[SW] Push notification received:', data);
  }
});

console.log('[SW] Service Worker loaded');