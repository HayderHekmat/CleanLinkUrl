// Service Worker - DISABLED FOR CACHE CLEARING
// This will clear all old caches and not cache anything new

const CACHE_NAME = "cleanlink-cache-v999-nocache";

self.addEventListener("install", event => {
  console.log('🗑️ Service Worker: Clearing all caches...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          console.log('Deleting cache:', name);
          return caches.delete(name);
        })
      );
    }).then(() => {
      console.log('✅ All caches cleared');
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", event => {
  console.log('Service Worker: Activating and claiming clients...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
    }).then(() => {
      console.log('✅ Service Worker: All caches deleted on activate');
      return self.clients.claim();
    })
  );
});

// Don't cache anything - just fetch from network
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(error => {
      console.error('Fetch failed:', error);
      throw error;
    })
  );
});
