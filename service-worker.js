const CACHE_NAME = "cleanlink-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/images/cleanlink-icon.png",
  "/images/cleanlink-icon-192.png",
  "/images/cleanlink-icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name)))
    )
  );
});
