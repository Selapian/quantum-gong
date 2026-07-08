const CACHE_NAME = 'quantum-gong-v5';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './gong.mp3'
];

// Install Assets directly to Application Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Clean old caches on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Standard fetch cache network fallback fallback strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Heavy Lifter: Background Engine execution line
// Catches data-push signals even if the browser/phone is closed down
self.addEventListener('push', (event) => {
  event.waitUntil(
    caches.match('./gong.mp3').then(async (response) => {
      if (!response) return;
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Allocates a standalone execution track in the kernel sandbox
      const audio = new Audio(audioUrl);
      audio.currentTime = 0;
      
      return audio.play().catch(err => console.log("Background Audio Instance Error:", err));
    })
  );
});
