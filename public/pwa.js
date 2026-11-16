// Register the offline shell and make approved workflow templates immediately usable.
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}

document.querySelectorAll('input[data-step][disabled]').forEach(input=>input.disabled=false);
document.addEventListener('change',event=>{
  const box=event.target;
  if(!box.matches('input[data-step]')) return;
  const title=document.querySelector('.detail-head h1')?.textContent;
  const template=Object.entries(Workflow.templates).find(([,value])=>value.title===title)?.[0];
  if(!template) return;
  let saved={records:[],active:null};
  try{saved={...saved,...JSON.parse(localStorage.getItem('purchasing-workspace-v1')||'null')}}catch{}
  let record=saved.records.find(item=>item.id===saved.active);
  if(!record || record.template!==template){
    record={id:crypto.randomUUID(),template,name:`Unassigned ${Workflow.templates[template].title}`,po:'',brand:'OMS',supplier:'',destination:'Sri Lanka',quantity:'',deadline:'',blocker:'',done:{}};
    saved.records.push(record);
    saved.active=record.id;
  }
  record.done[box.dataset.step]=box.checked;
  localStorage.setItem('purchasing-workspace-v1',JSON.stringify(saved));
  event.stopImmediatePropagation();
  box.closest('.step')?.classList.toggle('complete',box.checked);
},true);
