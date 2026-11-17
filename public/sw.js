/* Increment the version whenever an app-shell file changes. Never cache Drive or OAuth requests. */
const VERSION = 'purchasing-control-v10';
const CACHE = `${VERSION}:${self.registration.scope}`;
const ASSETS = ['./','index.html','style.css','mobile.css','workflow.js','data.js','config.js','app.js','drive.js','pwa.js','manifest.webmanifest','google-drive-setup.html','icons/icon.svg','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install', event => event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await cache.addAll(ASSETS);
  if(self.skipWaiting) await self.skipWaiting();
})()));
self.addEventListener('message', event => { if(event.data === 'ACTIVATE_UPDATE') self.skipWaiting(); });
self.addEventListener('activate', event => event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key => (key.startsWith('charger-flow-') || key.startsWith('purchasing-control-')) && key.endsWith(`:${self.registration.scope}`) && key!==CACHE).map(key=>caches.delete(key)));
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const allowed = ASSETS.map(asset => new URL(asset,self.registration.scope).href);
  if(event.request.method !== 'GET' || !allowed.includes(url.href)) return;
  // Serve the current installed shell. New versions activate immediately.
  event.respondWith(caches.open(CACHE).then(async cache => (await cache.match(event.request)) || fetch(event.request)));
});
