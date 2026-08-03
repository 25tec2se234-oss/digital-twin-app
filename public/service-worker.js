self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => caches.delete(key))
      );
    })
  );
  self.registration.unregister();
});















































































































// VERSION: f214c27d40bc3e17