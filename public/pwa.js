// Register the offline shell. Workflow state is handled by app.js.
if('serviceWorker' in navigator){
  let reloading=false;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!reloading){reloading=true;location.reload();}});
  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
