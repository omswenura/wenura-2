/* Increment the version whenever an app-shell file changes. Never cache Drive or OAuth requests. */
const VERSION = 'purchasing-control-v7';
const CACHE = `${VERSION}:${self.registration.scope}`;
const ASSETS = ['./','index.html','style.css','mobile.css','workflow.js','data.js','config.js','app.js','drive.js','pwa.js','manifest.webmanifest','google-drive-setup.html','icons/icon.svg','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))));
self.addEventListener('message', event => { if(event.data === 'ACTIVATE_UPDATE') self.skipWaiting(); });
self.addEventListener('activate', event => event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key => key.startsWith('charger-flow-') && key.endsWith(`:${self.registration.scope}`) && key!==CACHE).map(key=>caches.delete(key)));
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const allowed = ASSETS.map(asset => new URL(asset,self.registration.scope).href);
  if(event.request.method !== 'GET' || !allowed.includes(url.href)) return;
  // Serve a consistent shell. Updates are activated explicitly by the user.
  event.respondWith(caches.open(CACHE).then(async cache => (await cache.match(event.request)) || fetch(event.request)));
});
