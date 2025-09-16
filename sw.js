// sw.js — Bike Land JO
const CACHE_VERSION = "v2.0.0";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

const CORE_ASSETS = [
  "/",                       // index.html (للـ root)
  "/index.html",
  "/dist/output.css",
  "/images/banner-img.png",
  "/images/banner-bg.png",
  "/images/favicon/favicon-32x32.png",
  "/images/favicon/favicon-16x16.png",
  "/images/favicon/apple-touch-icon.png",
  "/images/favicon/android-chrome-192x192.png",
  "/images/favicon/android-chrome-512x512.png"
  // زِد أي ملفات ثابتة مهمة (شعارات، سكريبتات محلية، صور على الهيدر..)
];

// تثبيت: نحمّل الأصول الأساسية
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// تفعيل: نحذف كاش الإصدارات القديمة
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => ![STATIC_CACHE, RUNTIME_CACHE].includes(k))
        .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// الإسترجاع:
// - صفحات HTML: Network-First (لتحصل على آخر نسخة إنترنت متاح)
// - باقي الملفات: Cache-First (للسرعة والأوفلاين)
self.addEventListener("fetch", event => {
  const req = event.request;
  const isHTML = req.headers.get("accept")?.includes("text/html");

  if (isHTML) {
    event.respondWith(networkFirst(req));
  } else {
    event.respondWith(cacheFirst(req));
  }
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const fresh = await fetch(req);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(req, fresh.clone());
    return fresh;
  } catch {
    return cached; // إن وجد
  }
}

async function networkFirst(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const fresh = await fetch(req);
    cache.put(req, fresh.clone());
    return fresh;
  } catch {
    const cached = await caches.match(req);
    return cached || caches.match("/index.html");
  }
}
