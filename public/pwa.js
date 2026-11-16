// The purchasing workspace keeps the offline shell when installed. UI controls
// are optional so the script supports the expanded layout.
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
