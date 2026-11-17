// Older app versions cached workflow scripts too aggressively. Remove their
// service worker once so this control workspace always loads current workflows.
if('serviceWorker' in navigator){
  window.addEventListener('load',async()=>{
    const registrations=await navigator.serviceWorker.getRegistrations();
    if(!registrations.length)return;
    await Promise.all(registrations.map(registration=>registration.unregister()));
    location.reload();
  });
}
