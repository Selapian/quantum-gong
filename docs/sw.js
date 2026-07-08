const CACHE_NAME = 'quantum-gong-v14';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './gong.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// SILENT PUSH CHANNEL: Intercepts the OS-level background signal
self.addEventListener('push', (event) => {
  console.log("Background token event detected. Audio rendering engine triggered.");
  
  event.waitUntil(
    caches.match('./gong.mp3').then(async (response) => {
      if (!response) return;
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // FIXED: Reset head tracker to zero so overlapping cron triggers don't freeze playback states
      audio.currentTime = 0;
      
      // Forces playback directly on the hardware path while phone is closed
      return audio.play().catch(err => console.log("Hardware playback error:", err));
    })
  );
});
