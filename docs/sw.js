const CACHE_NAME = 'quantum-gong-v21';
const ASSETS = ['./', './index.html', './manifest.json', './gong.mp3'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request)));
});

self.addEventListener('push', (event) => {
  console.log("Push signal caught.");

  event.waitUntil(
    Promise.all([
      // Satisfies Android's required foreground visual tracking execution loop
      self.registration.showNotification('Quantum Gong', {
        body: '⚛️ The bell is ringing...',
        tag: 'gong-alert'
      }),

      caches.match('./gong.mp3').then(async (response) => {
        if (!response) return;
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.currentTime = 0;
        console.log("Gong Rung!")
        return audio.play();
      })
    ])
  );
});
