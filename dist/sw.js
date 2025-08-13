// Empty service worker - used to unregister any existing service worker
self.addEventListener('install', () => {
  // Skip waiting to become active immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Immediately unregister this service worker
  event.waitUntil(
    self.registration.unregister()
      .then(() => {
        console.log('Service worker successfully unregistered');
      })
      .catch(error => {
        console.error('Failed to unregister service worker:', error);
      })
  );
}); 