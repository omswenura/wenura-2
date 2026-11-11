let installPrompt;
const installButton=document.getElementById('installApp');
const installHint=document.getElementById('installHint');
function standalone(){return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;}
function installed(){installHint.textContent='Charger Flow is running as an app. Your checklist is available offline after its first online load.';installButton.hidden=true;}
if(standalone())installed();
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;installButton.textContent='Install app';});
window.addEventListener('appinstalled',()=>{installPrompt=null;installed();});
installButton.addEventListener('click',async()=>{
  if(installPrompt){await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;return;}
  const ios=/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  installHint.textContent=ios?'On iPhone or iPad, open this site in Safari → Share → Add to Home Screen → Open as Web App (if shown) → Add.':'In Chrome on Android, open the browser menu → Add to home screen → Install. On desktop, use the address bar install icon. The site must be on HTTPS.';
});
function connection(){document.getElementById('connectionStatus').textContent=navigator.onLine?'● Device storage':'● Offline · device storage';}
window.addEventListener('online',connection);window.addEventListener('offline',connection);connection();
if('serviceWorker' in navigator){
  window.addEventListener('load',async()=>{
    try{
      const registration=await navigator.serviceWorker.register('./sw.js');
      const offerUpdate=()=>{if(registration.waiting && navigator.serviceWorker.controller){document.getElementById('updateBanner').hidden=false;}};
      offerUpdate();registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',offerUpdate);});
      document.getElementById('updateApp').onclick=()=>registration.waiting?.postMessage('ACTIVATE_UPDATE');
      let refreshing=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!refreshing && document.getElementById('updateBanner').hidden===false){refreshing=true;location.reload();}});
    }catch{installHint.textContent='Offline setup did not finish. Reopen this site online to retry. You can still use the checklist.';}
  });
}
