const CACHE_NAME = 'anesthesia-registry-desktop-v2';
const APP_URL = 'https://script.google.com/macros/s/AKfycbwGaEc4JQme3zKaWQe3bfQ_X3fqB0POPao6HIylAbztry5fHtWPiS3-cmZZMG51uztQ/exec';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

let lastSuccessfulFetch = 0;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

function isIframeAppRequest(request) {
  const url = new URL(request.url);
  return url.href.startsWith(APP_URL);
}

async function networkThenCache(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === 'opaque')) {
      cache.put(request, response.clone());
      lastSuccessfulFetch = Date.now();
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request, { ignoreSearch: false });
    if (cached) return cached;
    const fallback = await cache.match('./index.html');
    return fallback || Response.error();
  }
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (isIframeAppRequest(request)) {
    event.respondWith(networkThenCache(request));
    return;
  }

  const url = new URL(request.url);
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request, { ignoreSearch: true });
      const fetchPromise = fetch(request).then(response => {
        if (response && response.ok) cache.put(request, response.clone());
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })());
  }
});

self.addEventListener('message', event => {
  if (event.data?.type === 'GET_META') {
    event.ports[0]?.postMessage({ lastSuccessfulFetch });
  }
});
