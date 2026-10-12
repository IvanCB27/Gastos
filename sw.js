/*
  Service worker: guarda los archivos de la app en el teléfono para que
  funcione sin internet.
  NOTA: si en el futuro modificas index.html, cambia VERSION (p. ej. 'gastos-v2')
  para que el teléfono descargue la nueva versión. Esto NO borra tus registros:
  los registros viven en localStorage, no en esta caché.
*/
const VERSION = 'gastos-v3';   // v2: dashboard. v3: correcciones de seguridad y robustez.
const ARCHIVOS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)));
  self.skipWaiting();
});

// Borra cachés de versiones anteriores (solo archivos de la app, no los datos).
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Estrategia "primero caché": responde desde el teléfono; solo usa la red si falta algo.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
