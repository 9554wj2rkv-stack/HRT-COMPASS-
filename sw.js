/* HRT Compass V2 — service worker
   - Only caches the app's own files (no health data ever goes in the cache; records live in localStorage).
   - Every cache name starts with "hrt-compass-v2-", and cleanup only ever deletes caches with that prefix,
     so V1's caches (and any other app on the same github.io address) are never touched.
   - Registered from /hrt-compass-v2/, so its scope is limited to that folder and it cannot control V1.
   - The page itself is fetched network-first, so a new upload reaches users the next time they open the app
     with a connection; offline, the last cached copy is used. Updates never touch stored records. */
const CACHE_PREFIX = 'hrt-compass-v2-';
const CACHE = CACHE_PREFIX + 'shell-2';   // change the number when you upload a new version
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './favicon-32.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE)   // only our own old caches
        .map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;               // never handle other sites
  const scopePath = new URL(self.registration.scope).pathname;    // e.g. /hrt-compass-v2/
  if (!url.pathname.startsWith(scopePath)) return;                // never handle V1 or other apps

  if (req.mode === 'navigate') {
    // Network first for the page, so updates arrive; fall back to cache offline.
    event.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return res; })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }
  // Cache first for static files (icons, fonts, manifest).
  event.respondWith(caches.match(req).then(r => r || fetch(req)));
});
