const KEY='purchasing-workspace-v2';
const $=id=>document.getElementById(id);
const blank=()=>({records:[],active:null,view:'dashboard'});
let state=blank();
try{state={...state,...JSON.parse(localStorage.getItem(KEY)||localStorage.getItem('purchasing-workspace-v1')||'null')}}catch{}
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const current=()=>state.records.find(record=>record.id===state.active)||null;
const template=id=>Workflow.templates[id];
function createDraft(templateId){
  const record={id:crypto.randomUUID(),template:templateId,name:'',po:'',brand:'OMS',supplier:'',unitPrice:'',currency:'USD',moq:'',manufacturingCountry:'',destination:'Sri Lanka',quantity:'',deadline:'',blocker:'',done:{}};
  state.records.push(record);state.active=record.id;save();return record;
}
function progress(record){const flow=template(record.template),done=Object.values(record.done).filter(Boolean).length;return{flow,done,next:flow.steps.find(step=>!record.done[step.id])};}
function selectField(record,name,label,options){
  return `<label>${label}<select name="${name}"><option value="">Select…</option>${options.map(option=>`<option ${record?.[name]===option?'selected':''}>${option}</option>`).join('')}</select></label>`;
}
function textField(record,name,label,placeholder=''){
  return `<label>${label}<input name="${name}" value="${esc(record?.[name]||'')}" maxlength="160" placeholder="${placeholder}"></label>`;
}
function technicalFields(templateId,record){
  const fields={
    charger:[
      textField(record,'spec_wattage','Wattage','e.g. 65W'),
      textField(record,'spec_ports','Ports','e.g. USB-C + USB-A'),
      textField(record,'spec_protocols','Charging protocols','e.g. PD, QC'),
      selectField(record,'spec_cable_included','Cable included?',['Yes','No']),
      textField(record,'spec_certifications','Certifications','e.g. CE, RoHS')
    ],
    cable:[
      selectField(record,'spec_material','Cable material',['TPE','PVC','Braided nylon/polyester','Silicone','Other']),
      selectField(record,'spec_conductor','Conductor material',['Pure copper','Copper alloy','Aluminum-plated','Other']),
      textField(record,'spec_electrical','Wattage / amperage / voltage','e.g. 60W · 3A · 20V'),
      selectField(record,'spec_length','Length',['1m','2m','3m','Other']),
      selectField(record,'spec_connectors','Connector combination',['USB-C','Lightning','Micro-USB','Type-C to Type-C','Type-C to Lightning','Other'])
    ],
    tws:[
      selectField(record,'spec_product_type','Product type',['TWS','OWS']),
      selectField(record,'spec_anc','ANC',['Included','Not included','To confirm']),
      selectField(record,'spec_enc','ENC',['Included','Not included','To confirm']),
      textField(record,'spec_case_battery','Charging-case battery capacity','e.g. 500 mAh'),
      textField(record,'spec_bud_battery','Individual bud battery capacity','e.g. 40 mAh'),
      selectField(record,'spec_finish','Surface finish',['Oil-painted / glossy','Matte','Other']),
      selectField(record,'spec_tdra_destination','UAE TDRA requirement',['UAE — TDRA required','Not UAE','To confirm'])
    ],
    neckband:[
      textField(record,'spec_battery','Battery capacity in casing','e.g. 300 mAh'),
      selectField(record,'spec_voice_change','Voice-changing feature',['Included','Not included','To confirm']),
      selectField(record,'spec_karaoke','Karaoke mode',['Included','Not included','To confirm']),
      selectField(record,'spec_gaming','Gaming mode',['Included','Not included','To confirm']),
      textField(record,'spec_microphone','Microphone details','Type, quality or supplier description'),
      selectField(record,'spec_magnetic','Magnetic on/off',['Included','Not included','To confirm']),
      selectField(record,'spec_touch','Touch sensors',['Included','Not included','To confirm']),
      textField(record,'spec_talk_time','Talk time','e.g. 20 hours')
    ]
  };
  return fields[templateId]||[];
}
function setHeader(){
  const record=current();
  $('recordTitle').textContent=record?(record.name||`New ${template(record.template).title} record`):'Purchasing control centre';
  $('recordMeta').textContent=record?`${record.po||'PO not assigned'} · ${record.brand} · ${record.supplier||'Supplier not recorded'}`:'Approved workflows and operational references';
}
function dashboardLegacy(){
  const records=state.records, blockers=records.filter(record=>record.blocker);
  $('screen').innerHTML=`<section class="hero"><div><span class="eyebrow">PURCHASING & MANUFACTURING</span><h1>Every product. Every required step.</h1><p>Start a record, add its confirmed details, then mark the exact approved workflow.</p></div><button class="primary" data-action="setup">＋ Set up purchase order</button></section>
  <section class="metric-grid"><article><span>ACTIVE PURCHASE ORDERS</span><strong>${records.length}</strong><small>Only records you create appear here</small></article><article><span>BLOCKERS RECORDED</span><strong>${blockers.length}</strong><small>Only confirmed issues are counted</small></article><article><span>APPROVED WORKFLOWS</span><strong>3</strong><small>Charger · Cable · TWS / OWS</small></article><article><span>WARRANTY STICKERS</span><strong>4%</strong><small>1F134 WARRANTY STICKERS</small></article></section>
  <section class="split"><div class="panel"><div class="panel-head"><div><h2>Purchase order status</h2><p>Nothing is complete until you mark it.</p></div><button class="ghost" data-action="setup">Set up record</button></div>${records.length?`<div class="records">${records.map(record=>{const item=progress(record);return `<button class="record" data-open="${record.id}"><span class="record-dot"></span><span><strong>${esc(record.name||'New product record')}</strong><small>${esc(record.po||'PO not assigned')} · ${esc(item.flow.title)}</small></span><b>${item.done}/${item.flow.steps.length}</b><em>${esc(item.next?.label||'All steps marked')}</em></button>`}).join('')}</div>`:`<div class="empty"><b>No purchase orders set up</b><p>Choose a workflow below, then enter the product and supplier details.</p></div>`}</div><aside class="panel reference-card"><span class="eyebrow">HOW IT WORKS</span><h2>Set up first. Mark with confidence.</h2><p>Each set-up record keeps its own supplier, PO, deadline, blockers and workflow marks.</p><button class="link-button" data-view="references">View operating references →</button></aside></section>
  <section class="workflow-cards"><h2>Set up an approved workflow</h2>${Object.entries(Workflow.templates).map(([id,flow])=>`<button class="workflow-card" data-setup="${id}"><span>${id==='charger'?'01':id==='cable'?'02':'03'}</span><div><b>${flow.title}</b><small>${flow.steps.length} approved steps · ${flow.version}</small></div><i>Set up →</i></button>`).join('')}</section>`;
}
// The overview is a clean entry point; individual records are opened from the
// corresponding workflow setup rather than displayed as an unfiltered list.
function dashboard(){
  const flows=Object.entries(Workflow.templates);
  $('screen').innerHTML=`<section class="hero"><div><span class="eyebrow">PURCHASING & MANUFACTURING</span><h1>Choose the product workflow.</h1><p>Set up the relevant workflow, enter its confirmed details, then mark each approved step as work progresses.</p></div><button class="primary" data-action="setup">＋ Set up purchase order</button></section>
  <section class="metric-grid"><article><span>APPROVED WORKFLOWS</span><strong>${flows.length}</strong><small>Choose the workflow that matches the product</small></article><article><span>WARRANTY STICKERS</span><strong>4%</strong><small>Standard allowance for applicable products</small></article><article><span>PACKAGING CONTROL</span><strong>Required</strong><small>Before manufacturing completion</small></article><article><span>PAYMENT PLAN</span><strong>Tracked</strong><small>WENU - PURCHASING PAYMENT PLAN</small></article></section>
  <section class="workflow-cards"><h2>Set up an approved workflow</h2>${flows.map(([id,flow],index)=>`<button class="workflow-card" data-setup="${id}"><span>${String(index+1).padStart(2,'0')}</span><div><b>${flow.title}</b><small>${flow.steps.length} approved steps · ${flow.version}</small></div><i>Set up →</i></button>`).join('')}</section>
  <aside class="panel reference-card overview-reference"><span class="eyebrow">MASTER REFERENCE</span><h2>Packaging, stickers, payment and cargo controls</h2><p>Use the master reference for standards that apply alongside the selected product workflow.</p><button class="link-button" data-view="references">View operating references →</button></aside>`;
}
function setup(templateId,record=null){
  const flow=template(templateId);
  $('screen').innerHTML=`<section class="detail-head"><button class="back" data-view="dashboard">← Overview</button><div><span class="eyebrow">${record?'EDIT RECORD':'SET UP WORKFLOW'}</span><h1>${flow.title}</h1><p>Enter what is known now. You can complete the details later.</p></div></section>
  <form class="form-panel" id="setupForm"><div class="form-grid">
  <label>Workflow<select name="template">${Object.entries(Workflow.templates).map(([id,item])=>`<option value="${id}" ${(record?.template||templateId)===id?'selected':''}>${item.title} · ${item.steps.length} steps</option>`).join('')}</select></label>
  <label>Product / model<input name="name" value="${esc(record?.name||'')}" maxlength="120" placeholder="e.g. 65W USB-C charger"></label>
  <label>PO number<input name="po" value="${esc(record?.po||'')}" maxlength="80" placeholder="Add when issued"></label>
  <label>Brand<select name="brand">${Workflow.brands.map(item=>`<option ${(record?.brand||'OMS')===item?'selected':''}>${item}</option>`).join('')}</select></label>
  <label>Supplier<input name="supplier" value="${esc(record?.supplier||'')}" maxlength="120" placeholder="Supplier name"></label>
  <label>Unit price<input name="unitPrice" type="number" min="0" step="0.01" value="${esc(record?.unitPrice||'')}" placeholder="e.g. 4.50"></label>
  <label>Currency<select name="currency">${['USD','LKR','AED','CNY','Other'].map(item=>`<option ${(record?.currency||'USD')===item?'selected':''}>${item}</option>`).join('')}</select></label>
  <label>Minimum order quantity (MOQ)<input name="moq" type="number" min="1" value="${esc(record?.moq||'')}" placeholder="Supplier MOQ"></label>
  <label>Manufacturing country<input name="manufacturingCountry" value="${esc(record?.manufacturingCountry||'')}" maxlength="80" placeholder="e.g. China"></label>
  <label>Destination<select name="destination">${['Sri Lanka','UAE','Other'].map(item=>`<option ${(record?.destination||'Sri Lanka')===item?'selected':''}>${item}</option>`).join('')}</select></label>
  <label>Order quantity<input name="quantity" type="number" min="1" value="${esc(record?.quantity||'')}" placeholder="Confirmed units"></label>
  <label>Deadline<input name="deadline" type="date" value="${esc(record?.deadline||'')}"></label>
  <label class="wide-field">Current blocker / issue<textarea name="blocker" maxlength="1000" placeholder="Leave blank when no issue is confirmed">${esc(record?.blocker||'')}</textarea></label>
  <section class="spec-section wide-field"><div><span class="eyebrow">WORKFLOW-SPECIFIC DATA</span><h2>${flow.title} selections</h2><p>Select the known options and enter the confirmed details for this product.</p></div><div class="spec-grid">${technicalFields(templateId,record).join('')}</div></section>
  </div><div class="form-actions"><button type="button" class="secondary" data-view="dashboard">Cancel</button><button class="primary">Save and open workflow</button></div></form>`;
  $('setupForm').onsubmit=event=>{event.preventDefault();const values=Object.fromEntries(new FormData(event.target));const target=record||createDraft(values.template);Object.assign(target,values);if(target.template!==values.template){target.done={};target.template=values.template;}state.active=target.id;save();setHeader();workflow(target);};
}
function workflow(record){
  const flow=template(record.template), item=progress(record);
  $('screen').innerHTML=`<section class="detail-head"><button class="back" data-view="dashboard">← Overview</button><div><span class="eyebrow">PURCHASE ORDER WORKFLOW</span><h1>${flow.title}</h1><p>${esc(record.name||'New product record')} · ${esc(record.po||'PO not assigned')} · ${flow.steps.length} approved steps</p></div><button class="primary" data-action="edit">Edit details</button></section>
  <section class="progress-summary"><strong>${item.done} / ${flow.steps.length}</strong><div><span style="width:${item.done/flow.steps.length*100}%"></span></div><small>${item.next?`Next action: ${esc(item.next.label)}`:'All steps marked as complete'}</small></section>
  <section class="steps-panel">${flow.sections.map(group=>`<section class="workflow-group"><header><span>${String(group.start).padStart(2,'0')}–${String(group.end).padStart(2,'0')}</span><h2>${group.title}</h2></header>${flow.steps.filter(step=>step.number>=group.start&&step.number<=group.end).map(step=>`<label class="step ${record.done[step.id]?'complete':''}"><input type="checkbox" data-step="${step.id}" ${record.done[step.id]?'checked':''}><span class="step-number">${String(step.number).padStart(2,'0')}</span><span>${esc(step.label)}${record.template==='charger'&&step.number===14?'<small>Sticker work starts after supplier confirmation and can run in parallel.</small>':''}${record.template==='charger'&&step.number===28?'<small>Company-supplied packaging must arrive before manufacturing completion.</small>':''}</span></label>`).join('')}</section>`).join('')}</section>`;
}
function references(){
  $('screen').innerHTML=`<section class="detail-head"><button class="back" data-view="dashboard">← Overview</button><div><span class="eyebrow">MASTER REFERENCE</span><h1>Operating controls</h1><p>Universal controls support each product workflow; they do not replace approved step numbers.</p></div></section>
  <div class="reference-grid"><section class="panel"><div class="panel-head"><h2>Universal purchasing & packaging</h2><span class="pill">${Workflow.universal.length} REFERENCES</span></div><div class="reference-list">${Workflow.universal.map(([code,label])=>`<div><b>${code}</b><span>${label}</span></div>`).join('')}</div></section><section class="panel"><div class="panel-head"><h2>Packaging standards</h2><span class="pill">CONFIRMED</span></div><ul class="tight"><li>Supplier-designed or own-brand packaging is selected per product.</li><li>Weights: 350g, 375g, 400g, 450g, 700g, 725g, 750g.</li><li>Glossy, matte, Vietnam or silver paper; UV/embossing where applicable.</li><li>Pantone preferred; CMYK otherwise. Plastic hooks: OMS red, EXPERT blue.</li><li>Compare quotations against like-for-like references before approval.</li></ul></section><section class="panel wide"><div class="panel-head"><h2>Packaging dimensions</h2><span class="pill">MM · ORDER UNCONFIRMED</span></div><table><thead><tr><th>Category</th><th>Dimensions</th><th>Remark</th></tr></thead><tbody>${Workflow.packaging.map(row=>`<tr><td>${row[0]}</td><td>${row[1]} mm</td><td>${row[2]}</td></tr>`).join('')}</tbody></table><p class="table-note">Dimension order has not been confirmed. The duplicate Charger row is retained from the original chart.</p></section><section class="panel wide"><div class="panel-head"><h2>Payment, shipping & cargo controls</h2><span class="pill">UNIVERSAL</span></div><ol class="tight"><li>Confirm production and packing; settle outstanding balance unless an explicitly agreed early-dispatch exception applies.</li><li>Obtain the original packing list, request Boss’s shipping mark, verify its application, and obtain the updated packing list.</li><li>Use the Boss-confirmed cargo address, verify delivery to the correct facility, and collect the cargo slip as receipt evidence.</li></ol></section></div><section class="panel catalogue"><div class="panel-head"><h2>Product portfolio</h2><span class="pill">${Workflow.catalogue.length} CATEGORIES</span></div>${Workflow.catalogue.map(name=>`<span>${name}${({'Phone chargers':' · 37 steps','Phone cables':' · 23 steps','TWS / OWS':' · 37 steps'}[name]||' · workflow pending')}</span>`).join('')}</section>`;
}
function render(){setHeader();state.view==='references'?references():dashboard();}
document.body.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-action],[data-view],[data-setup],[data-template],[data-open]');if(!trigger)return;
  if(trigger.dataset.view){state.view=trigger.dataset.view;render();return;}
  if(trigger.dataset.setup){setup(trigger.dataset.setup);return;}
  if(trigger.dataset.template){setup(trigger.dataset.template);return;}
  if(trigger.dataset.open){state.active=trigger.dataset.open;save();setHeader();workflow(current());return;}
  if(trigger.dataset.action==='setup'||trigger.dataset.action==='new'){setup('charger');return;}
  if(trigger.dataset.action==='edit'){setup(current().template,current());}
});
document.body.addEventListener('change',event=>{if(!event.target.matches('[data-step]'))return;const record=current();if(!record)return;record.done[event.target.dataset.step]=event.target.checked;save();workflow(record);});
render();
