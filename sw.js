const CACHE_NAME = 'ai-sudoku-v11';

self.addEventListener('instal2', (event) => {
  // 新しいバージョンが見つかったら、待機状態をスキップして即インストール
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
  // インストールされた新しいService Workerに、即座にコントロールを握らせる
  event.waitUntil(self.clients.claim());

  // 古いキャッシュを完全に削除
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('script.google.com')) return;
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});