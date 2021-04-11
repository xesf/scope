const cacheName = 'scope-v1';

const contentToCache = [
    'https://pro.fontawesome.com/releases/v5.10.0/css/all.css',
    'https://cdn.staticaly.com/gh/hampusborgos/country-flags/main/png100px/gb.png',
    'https://cdn.staticaly.com/gh/hampusborgos/country-flags/main/png100px/pt.png',
    'index.html',
    'index.mjs',
    'utils.mjs',
    'data/scenes.mjs',
    'data/text.mjs',
    'assets/android-icon-36x36.png',
    'assets/android-icon-48x48.png',
    'assets/android-icon-72x72.png',
    'assets/android-icon-96x96.png',
    'assets/android-icon-144x144.png',
    'assets/android-icon-192x192.png',
    'assets/apple-icon-57x57.png',
    'assets/apple-icon-60x60.png',
    'assets/apple-icon-72x72.png',
    'assets/apple-icon-76x76.png',
    'assets/apple-icon-114x114.png',
    'assets/apple-icon-120x120.png',
    'assets/apple-icon-144x144.png',
    'assets/apple-icon-152x152.png',
    'assets/apple-icon-180x180.png',
    'assets/apple-icon-precomposed.png',
    'assets/apple-icon.png',
    'assets/favicon-16x16.png',
    'assets/favicon-32x32.png',
    'assets/favicon-96x96.png',
    'assets/favicon.ico',
    'assets/ms-icon-70x70.png',
    'assets/ms-icon-144x144.png',
    'assets/ms-icon-150x150.png',
    'assets/ms-icon-310x310.png',
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        (async () => {
            const cache = await caches.open(cacheName);
            await cache.addAll(contentToCache);
        })()
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        (async () => {
            const r = await caches.match(e.request);
            if (r) return r;
            const response = await fetch(e.request);
            const cache = await caches.open(cacheName);
            cache.put(e.request, response.clone());
            return response;
        })()
    );
});
