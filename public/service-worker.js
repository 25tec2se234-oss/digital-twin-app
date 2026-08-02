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


























































































// VERSION: 2455071ab7c1e96f