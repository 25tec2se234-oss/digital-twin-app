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































































































// VERSION: 0c95b44ba1542e4d