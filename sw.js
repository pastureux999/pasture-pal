const CACHE_NAME = "pasturepal-v1";
const PRECACHE = [
  "/PasturePal.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Install: cache core assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for API calls, cache-first for assets
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Always go network-first for API, Supabase, Stripe, and external calls
  const isExternal =
    url.hostname !== self.location.hostname ||
    url.pathname.startsWith("/api/");

  if (isExternal) {
    event.respondWith(fetch(event.request).catch(() => new Response("", { status: 503 })));
    return;
  }

  // Cache-first for local assets
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
