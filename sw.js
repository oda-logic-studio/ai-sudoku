const CACHE_NAME = 'ai-sudoku-v10]';

self.addEventListener('install', (event) => {
  // ★追加：新しいバージョンが見つかったら、即座に更新を適用する
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        './index.html',
        './images/coach_robot_normal.png'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  // ★追加：古いキャッシュ（記憶）を完全にゴミ箱に捨てる処理
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('script.google.com')) return;
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});