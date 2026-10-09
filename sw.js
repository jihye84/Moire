/* 무아레 정원: 홈 화면에 추가해 앱처럼 열 수 있게 하는 최소한의 서비스 워커 */
const CACHE = 'moire-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'])).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
/* 늘 최신 판을 먼저 받고, 연결이 끊겼을 때만 저장해 둔 판을 씀 */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); return r; })
      .catch(() => caches.match(e.request).then(m => m || caches.match('./index.html')))
  );
});
