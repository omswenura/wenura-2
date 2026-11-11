const KEY = 'charger-flow-v1';
const empty = () => ({name:'',supplier:'',checks:{},results:{},notes:'',time:'09:00',enabled:true,notified:''});
let state = empty();
let storageOK = true;
try { const saved = JSON.parse(localStorage.getItem(KEY)); if (saved) state = ChargerData.validate(saved); } catch { storageOK=false; }
const $ = id => document.getElementById(id);
function notice(message) { $('notice').textContent=message; $('notice').hidden=false; }
function save() { try { localStorage.setItem(KEY,JSON.stringify(state)); storageOK=true; } catch { storageOK=false; notice('Browser storage is unavailable. Download your record before closing this page.'); } }
function dateKey() {const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;}
function render() {
  const next = Workflow.nextTask(state.checks);
  const count = Workflow.tasks.filter(t=>state.checks[t[0]]).length;
  $('progressCount').textContent=`${count} / ${Workflow.tasks.length}`;
  $('progressBar').style.width=`${count / Workflow.tasks.length * 100}%`;
  const stage=Workflow.stages.find(s=>s.tasks.some(t=>t[0]===next?.[0]));
  $('currentStage').textContent=stage?.title || 'All checks complete';
  $('stageHint').textContent=stage?.description || 'Your sample is fully reviewed';
  $('nextTitle').textContent=next?.[1] || 'Sample verification complete';
  $('nextDetail').textContent=next?.[2] || 'All checks are complete. Download your record or begin a new sample.';
  $('sampleBadge').textContent=state.name || 'NEW SAMPLE';
  $('reminderSummary').textContent=state.enabled ? state.time : 'Off';
  $('reminderHint').textContent=state.enabled ? 'Keep this page open for reminders' : 'Turn on reminders to get a daily nudge';
  const container=$('steps');container.replaceChildren();
  Workflow.stages.forEach((s,index)=>{
    const section=document.createElement('section');section.className='stage';
    const heading=document.createElement('div');heading.className='stage-heading';
    const number=document.createElement('span');number.className='stage-number';number.textContent=String(index+1).padStart(2,'0');
    const title=document.createElement('div');const h=document.createElement('h3');h.textContent=s.title;const p=document.createElement('p');p.textContent=s.description;title.append(h,p);
    const status=document.createElement('span');status.className='stage-status';status.textContent=`${s.tasks.filter(t=>state.checks[t[0]]).length} / ${s.tasks.length}`;
    heading.append(number,title,status);section.append(heading);
    s.tasks.forEach(([id,label,detail])=>{
      const available=Workflow.isAvailable(id,state.checks),done=!!state.checks[id];
      const row=document.createElement('div');row.className=`task ${done?'done':''} ${!available&&!done?'locked':''}`;
      const check=document.createElement('input');check.type='checkbox';check.id=`check-${id}`;check.checked=done;check.disabled=!available&&!done;
      check.addEventListener('change',()=>{
        state.checks[id]=check.checked;
        if(!check.checked) {const i=Workflow.tasks.findIndex(t=>t[0]===id);Workflow.tasks.slice(i+1).forEach(t=>state.checks[t[0]]=false);notice('This task was reopened. Later checks need to be confirmed again; their recorded findings are preserved.');}
        save();render();document.getElementById(`check-${id}`)?.focus();
      });
      const body=document.createElement('div');body.className='task-body';const name=document.createElement('label');name.htmlFor=check.id;name.textContent=label;
      const desc=document.createElement('p');desc.textContent=(!available&&!done)?'Complete the previous task to unlock this step.':detail;
      const result=document.createElement('input');result.type='text';result.placeholder=id==='price'?'e.g. USD 4.50 / unit · required quantity 500':id==='moq'?'e.g. Minimum order 500 units':id==='production'?'e.g. 25 days after order confirmation':'Record findings or confirmation…';result.value=state.results[id]||'';result.setAttribute('aria-label',`${label} findings`);result.disabled=!available&&!done;result.maxLength=2000;result.addEventListener('input',()=>{state.results[id]=result.value;save();});
      body.append(name,desc,result);row.append(check,body);section.append(row);
    });container.append(section);
  });
}
$('today').textContent=new Intl.DateTimeFormat('en',{weekday:'long',month:'long',day:'numeric'}).format(new Date()).toUpperCase();
$('sampleName').value=state.name;$('supplier').value=state.supplier;$('notes').value=state.notes;$('reminderTime').value=state.time;$('reminderEnabled').checked=state.enabled;
$('sampleForm').addEventListener('submit',e=>{e.preventDefault();state.name=$('sampleName').value.trim();state.supplier=$('supplier').value.trim();save();render();if(storageOK)notice('Sample details saved.');});
for(const [id,key] of [['sampleName','name'],['supplier','supplier']])$(id).addEventListener('input',()=>{state[key]=$(id).value;save();$('sampleBadge').textContent=state.name||'NEW SAMPLE';});
$('notes').addEventListener('input',()=>{state.notes=$('notes').value;save();$('notesStatus').textContent=storageOK?'Saved on this browser':'Unable to save — download your record';});
$('saveReminder').onclick=()=>{if(!$('reminderTime').value){notice('Choose a reminder time first.');return;}state.time=$('reminderTime').value;state.enabled=$('reminderEnabled').checked;state.notified='';save();render();notice(state.enabled?'Daily reminder saved. Keep this page open to receive it.':'Daily reminders turned off.');};
$('enableNotifications').onclick=async()=>{if(!('Notification' in window)){notice('This browser does not support system notifications. In-app reminders still work. On iPhone, add this app to your home screen first.');return;}try {const permission=await Notification.requestPermission();notice(permission==='granted'?'System notifications enabled. Keep the app open for scheduled reminders.':'Notifications are blocked or not enabled. In-app reminders still work.');}catch{notice('System notifications are unavailable. In-app reminders still work.');}};
async function remind(){const d=new Date(),now=`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;const next=Workflow.nextTask(state.checks);if(!state.enabled||!next||now<state.time||state.notified===dateKey())return;state.notified=dateKey();save();const message=`Time to begin: ${next[1]}.`;notice(message);if('Notification' in window&&Notification.permission==='granted'){try{const registration='serviceWorker' in navigator?await navigator.serviceWorker.getRegistration():null;if(registration)await registration.showNotification('Charger Flow · Daily reminder',{body:message,icon:'icons/icon-192.png',tag:'daily-reminder'});else new Notification('Charger Flow · Daily reminder',{body:message});}catch{/* In-app reminder is already visible. */}}}
$('newSample').onclick=()=>$('newDialog').showModal();$('cancelNew').onclick=()=>$('newDialog').close();
function download(content,type,extension){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`charger-sample-${dateKey()}.${extension}`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function exportBackup(){download(JSON.stringify(ChargerData.backup(state),null,2),'application/json','json');}
$('exportSample').onclick=exportBackup;$('downloadBackup').onclick=exportBackup;
$('downloadCsv').onclick=()=>download(ChargerData.csv(state),'text/csv;charset=utf-8','csv');
async function restore(record){
  const incoming=ChargerData.validate(record);
  const approved=await new Promise(resolve=>{
    const dialog=$('replaceDialog');let result=false;
    $('cancelReplace').onclick=()=>dialog.close();$('confirmReplace').onclick=()=>{result=true;dialog.close();};
    dialog.addEventListener('close',()=>resolve(result),{once:true});dialog.showModal();
  });
  if(!approved)return false;
  state=incoming;save();$('sampleName').value=state.name;$('supplier').value=state.supplier;$('notes').value=state.notes;$('reminderTime').value=state.time;$('reminderEnabled').checked=state.enabled;render();notice(storageOK?'Backup restored and saved on this device.':'Backup loaded, but device storage is unavailable. Export a backup before closing.');return true;
}
window.ChargerApp={backup:()=>ChargerData.backup(state),restore};
$('importBackup').onclick=()=>$('backupFile').click();
$('backupFile').onchange=async()=>{const file=$('backupFile').files[0];if(!file)return;try{if(file.size>1000000)throw new Error('This backup is too large. Choose a Charger Flow JSON backup under 1 MB.');await restore(JSON.parse(await file.text()));}catch(error){notice(`Could not import backup: ${error.message}`);}finally{$('backupFile').value='';}};
$('confirmNew').onclick=()=>{const {time,enabled}=state;state={...empty(),time,enabled};save();$('sampleName').value='';$('supplier').value='';$('notes').value='';$('newDialog').close();render();notice('New sample ready. Begin by collecting your selected charger.');};
render();if(!storageOK)notice('Saved data could not be loaded. Browser storage may be unavailable.');remind();setInterval(remind,15000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)remind();});
