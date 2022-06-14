const staticCacheName = "site-static-v4";
const dynamicCacheName = "site-dynamic";
const assets = [
   "/",
   "/index.html",
   "/pages/fallback.html",
   "/js/app.js",
   "/js/ui.js",
   "/js/materialize.min.js",
   "/css/styles.css",
   "/css/materialize.min.css",
   "/img/dish.png",
   "https://fonts.googleapis.com/icon?family=Material+Icons",
   "https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
];

// install service worker
self.addEventListener("install", (e) => {
   console.log(e);
   e.waitUntil(
      caches.open(staticCacheName).then((cache) => {
         console.log("caching shell assets");
         cache.addAll(assets);
      })
   );
});

// activate service worker
self.addEventListener("activate", (e) => {
   e.waitUntil(
      caches.keys().then((keys) => {
         return Promise.all(
            keys
               .filter(
                  (key) => key !== staticCacheName && key !== dynamicCacheName
               )
               .map((key) => caches.delete(key))
         );
      })
   );
});

self.addEventListener("fetch", (e) => {
   e.respondWith(
      caches
         .match(e.request)
         .then((cacheReq) => {
            return (
               cacheReq ||
               fetch(e.request).then((fetchRes) => {
                  return caches.open(dynamicCacheName).then((cache) => {
                     cache.put(e.request.url, fetchRes.clone());
                     return fetchRes;
                  });
               })
            );
         })
         .catch(() => caches.match("/pages/fallback.html"))
   );
});
