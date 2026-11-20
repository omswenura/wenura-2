(function(root){
const make=(title,version,sections,items)=>({title,version,sections,steps:items.map((label,i)=>({id:title.replace(/\W+/g,'').toLowerCase()+`-${i+1}`,number:i+1,label,section:(sections.find(s=>i+1>=s.start&&i+1<=s.end)||{}).title}))});
const charger=make('OMS / EXPERT Charger','v3.1',[{title:'Selection & approvals',start:1,end:8},{title:'Order confirmation',start:9,end:14},{title:'Invoice & payment plan',start:15,end:19},{title:'Packaging',start:20,end:31},{title:'Warranty stickers',start:32,end:37}],['Record preliminary product selection decision','Record price, MOQ, manufacturing country and supplier','Record wattage, ports, protocols, features and certifications','Obtain charger sample','Submit sample to engineering for quality testing','Obtain engineering quality approval','Submit approved sample to Boss','Obtain Boss final product authorization','Determine and finalize order quantity','Notify supplier of required quantity','Attempt price negotiation','Confirm whether a cable is included','If included, identify cable type and supplier','Confirm charger order with supplier','Request supplier invoice','Verify all requested specifications on invoice','Submit verified invoice to Boss','Obtain Boss invoice approval','Enter invoice data in WENU - PURCHASING PAYMENT PLAN','Determine supplier or internal packaging responsibility','Select packaging approach','Provide product photographs to Media','Provide product code and features to Media','Obtain engineering specifications and provide to Media','Determine packaging dimensions','Request product 3D files from supplier','Forward 3D files to Media','Monitor packaging production and delivery before manufacturing completion','For internal packaging, send sample to packaging facility','Confirm packaging materials and production specifications','Compare packaging cost with reference cost','Confirm product quantity and sticker requirements','Calculate stickers at order quantity × 1.04, rounded up','Arrange stickers with 1F134 WARRANTY STICKERS','Follow up sticker production','Confirm delivery to product manufacturer','Verify stickers are affixed to products']);
const cable=make('Cable','v1.0',[{title:'Selection & specifications',start:1,end:9},{title:'Engineering & Boss approval',start:10,end:14},{title:'Order confirmation',start:15,end:18},{title:'Invoice & payment plan',start:19,end:23}],['Record preliminary product selection decision','Record price, MOQ, manufacturing country and supplier','Record wattage capacity and special features','Identify cable material: TPE, PVC, braided nylon/polyester, silicone or other','Verify conductor material: pure copper, copper alloy or aluminum-plated','Verify amperage and voltage','Confirm length: 1m, 2m, 3m or other','Confirm configuration: 2-in-1, 3-in-1, 4-in-1 or other','Confirm connector types and combinations','Obtain physical cable sample','Submit sample to engineering','Obtain engineering approval','Present engineering-approved sample to Boss','Obtain Boss final product authorization','Determine order quantity','Communicate quantity to supplier','Attempt price negotiation','Confirm selected cable and order details with supplier','Request supplier invoice','Verify invoice includes requested cable specifications','Submit verified invoice to Boss','Obtain Boss invoice approval','Enter invoice data in WENU - PURCHASING PAYMENT PLAN']);
const tws=make('TWS / OWS','v1.0',[{title:'Selection & specifications',start:1,end:14},{title:'UAE TDRA controls',start:15,end:23},{title:'Engineering & Boss approval',start:24,end:28},{title:'Order confirmation',start:29,end:32},{title:'Invoice & payment plan',start:33,end:37}],['Record preliminary product selection decision','Record price, MOQ, target manufacturing country and supplier','Confirm product type: TWS or OWS','Confirm ANC availability and performance','Confirm ENC availability and performance','Confirm design: with buds or without buds/open-ear','Confirm charging case battery capacity','Confirm individual earbud battery capacity','Confirm available colors','Confirm finish: oil-painted/glossy or matte','Confirm extra ear tips','Confirm supplier chip description','Confirm microphone type','Obtain explanation of feature operation','Confirm UAE export requirement','Request CE and RoHS certificates','Verify certificates match the correct model','Forward certificates and product details to Sumith Sir','Request TDRA approval process','Follow up until TDRA approval','Obtain TDRA QR code','Forward QR code to Media or Chinese packaging supplier','Verify QR code inside final packaging','Obtain physical TWS/OWS sample','Submit sample and specifications to engineering','Obtain engineering inspection approval','Present approved sample to Boss','Obtain Boss final product authorization','Determine order quantity','Communicate quantity to supplier','Attempt price negotiation','Confirm final product specifications and order details','Request supplier invoice','Verify invoice model, specifications, quantity and commercial details','Submit verified invoice to Boss','Obtain Boss invoice approval','Enter invoice data in WENU - PURCHASING PAYMENT PLAN']);
const universal=[['U01','Preliminary product selection'],['U02','Record supplier and commercial details'],['U03','Record product specifications'],['U04','Obtain product sample'],['U05','Submit sample to engineering'],['U06','Obtain engineering approval'],['U07','Submit product for Boss authorization'],['U08','Obtain final product authorization'],['U09','Determine order quantity'],['U10','Notify supplier'],['U11','Negotiate purchase price'],['U12','Confirm accessories/components'],['U13','Confirm order with supplier'],['U14','Request supplier invoice'],['U15','Verify invoice'],['U16','Submit invoice to Boss'],['U17','Obtain invoice approval'],['U18','Update payment plan'],['P01','Determine packaging responsibility'],['P02','Select packaging method'],['P03','Send photos and code to Media'],['P04','Send features and engineering specifications'],['P05','Determine packaging dimensions'],['P06','Request product 3D files'],['P07','Forward 3D files to Media'],['P08','Monitor packaging and delivery'],['P09','Send sample to internal packaging facility'],['P10','Confirm packaging specifications'],['P11','Compare packaging costs'],['W01','Confirm sticker requirements'],['W02','Calculate quantity including 4% wastage'],['W03','Arrange sticker production'],['W04','Follow up production'],['W05','Confirm delivery to manufacturer'],['W06','Verify sticker application']];
const api={templates:{charger,cable,tws},universal,catalogue:['Phone chargers','Phone cables','TWS / OWS','Power banks','Wired hands-free','Batteries','Back covers','Tempered glass','Speakers','Smartwatches','Computer accessories','Other cables','Key tags','Neck bands','Car chargers','Miscellaneous'],packaging:[['Neck Band','165 × 210 × 25','Standard'],['Neck Band','120 × 160 × 48','Special'],['Car Charger','90 × 160 × 40','Standard'],['TWS / OWS','90 × 160 × 35','Standard'],['Charger','96 × 166 × 38','Option 1'],['Charger','170 × 100 × 56','Option 2'],['Charger','170 × 100 × 56','Repeated source row'],['Wired Hands-Free','80 × 160 × 20','Standard'],['Cable — Low Price','60 × 160 × 20','Confirmed Cable category']],brands:['OMS','EXPERT','ONESAM','HOTTU'],tasks:charger.steps,stages:charger.sections.map(s=>({title:s.title,description:'Approved charger workflow',tasks:charger.steps.filter(x=>x.number>=s.start&&x.number<=s.end).map(x=>[x.id,x.label,'Record a confirmation before completion.'])})),isAvailable:(id,checks)=>{const a=charger.steps,i=a.findIndex(x=>x.id===id);return i>=0&&a.slice(0,i).every(x=>checks[x.id]);},nextTask:checks=>charger.steps.find(x=>!checks[x.id])||null};
const neckband=make('Neck Band','v3.0 · approved',[
  {title:'Selection & technical checks',start:1,end:11},
  {title:'Engineering & Boss approval',start:12,end:16},
  {title:'Order confirmation',start:17,end:20},
  {title:'Invoice & payment plan',start:21,end:25}
],[
  'Record preliminary sample selection decision',
  'Record price, MOQ, manufacturing country and supplier',
  'Record battery capacity and battery information inside the neckband casing',
  'Confirm voice-changing feature and operation',
  'Confirm karaoke mode and operation',
  'Confirm gaming mode and operation',
  'Confirm microphone type, quality and performance',
  'Confirm magnetic on/off functionality',
  'Confirm touch sensor functions',
  'Confirm talk-time duration',
  'Confirm other special features and specifications',
  'Obtain physical neckband sample',
  'Hand over sample and gathered details to company engineer',
  'Obtain engineering quality approval',
  'Present engineering-approved neckband to Boss',
  'Obtain Boss final product approval',
  'Determine and finalize order quantity',
  'Notify supplier of confirmed quantity',
  'Attempt price negotiation',
  'Confirm neckband order with supplier',
  'Request supplier invoice',
  'Verify invoice includes all requested specifications',
  'Submit verified invoice to Boss',
  'Obtain Boss invoice approval',
  'Enter invoice data in WENU - PURCHASING PAYMENT PLAN'
]);
// These records are required during product selection for every product type.
// Keep the existing step IDs intact so marks saved in the browser continue to
// refer to the same original task after this requirement is introduced.
function insertWorkflowSteps(flow,sectionTitle,entries,position='end'){
  const section=flow.sections.find(item=>item.title===sectionTitle);
  if(!section)throw new Error(`Missing ${sectionTitle} section for ${flow.title}`);
  const insertAt=position==='before-last'?section.end-1:section.end;
  const prefix=flow.title.replace(/\W+/g,'').toLowerCase();
  flow.steps.splice(insertAt,0,...entries.map(entry=>({id:`${prefix}-${entry.id}`,label:entry.label})));
  section.end+=entries.length;
  flow.sections.slice(flow.sections.indexOf(section)+1).forEach(item=>{item.start+=entries.length;item.end+=entries.length;});
  flow.steps.forEach((step,index)=>{
    step.number=index+1;
    step.section=(flow.sections.find(item=>step.number>=item.start&&step.number<=item.end)||{}).title;
  });
}
function addUniversalSelectionRequirements(flow){
  insertWorkflowSteps(flow,flow.sections[0].title,[
    {id:'product-photographs',label:'Obtain and attach product photographs'},
    {id:'separate-product-invoice',label:'Obtain a separate supplier invoice for this product'},
    {id:'supplier-packaging-costs',label:'During price negotiation, if supplier handles packaging, confirm one-by-one packing, inner poly-bag and external lamination costs'},
    {id:'product-logo-cost-and-placement',label:'If a logo is required on the product, confirm logo cost and exact placement'},
    {id:'user-manual-inclusion',label:'Confirm whether a user manual is included and obtain it for review'}
  ]);
}
function addOrderConfirmationPackingDecision(flow){
  insertWorkflowSteps(flow,'Order confirmation',[
    {id:'individual-packing-decision',label:'Decide whether supplier will individually pack products or internal packaging will be used'}
  ],'before-last');
}
addUniversalSelectionRequirements(charger);
addUniversalSelectionRequirements(cable);
addUniversalSelectionRequirements(tws);
addUniversalSelectionRequirements(neckband);
addOrderConfirmationPackingDecision(charger);
addOrderConfirmationPackingDecision(cable);
addOrderConfirmationPackingDecision(tws);
addOrderConfirmationPackingDecision(neckband);
insertWorkflowSteps(charger,'Packaging',[
  {id:'packaging-design-and-use-details',label:'Provide packaging design requirements and product-use details to Media or the packaging designer'},
  {id:'user-manual-review',label:'Obtain and review the user manual, if included with the product'}
]);
const mandatoryPackaging=[
  'Determine packaging responsibility: supplier or internal',
  'Select packaging approach',
  'Provide packaging design requirements and product-use details to Media or the packaging designer',
  'Obtain and review the user manual, if included with the product',
  'Provide product photos and product code to Media',
  'Provide product features and engineering specifications to Media',
  'Determine packaging dimensions',
  'Request product 3D files from supplier',
  'Forward product 3D files to Media',
  'Monitor packaging production and delivery before manufacturing completion',
  'For internal packaging, send product sample to packaging facility',
  'Confirm packaging materials, printing, finishes and hooks',
  'Compare packaging costs against reference costs'
];
const mandatoryStickers=[
  'Confirm warranty-sticker requirements and product quantity',
  'Calculate stickers at order quantity × 1.04, rounded up',
  'Arrange production with 1F134 WARRANTY STICKERS',
  'Follow up warranty-sticker production',
  'Confirm delivery to product manufacturer',
  'Verify warranty stickers are affixed to products'
];
function addMandatoryPackagingAndStickers(flow){
  const packagingStart=flow.steps.length+1;
  flow.sections.push({title:'Mandatory packaging',start:packagingStart,end:packagingStart+mandatoryPackaging.length-1});
  flow.steps.push(...mandatoryPackaging.map((label,index)=>({id:flow.title.replace(/\W+/g,'').toLowerCase()+`-${packagingStart+index}`,number:packagingStart+index,label,section:'Mandatory packaging'})));
  const stickerStart=flow.steps.length+1;
  flow.sections.push({title:'Mandatory warranty stickers',start:stickerStart,end:stickerStart+mandatoryStickers.length-1});
  flow.steps.push(...mandatoryStickers.map((label,index)=>({id:flow.title.replace(/\W+/g,'').toLowerCase()+`-${stickerStart+index}`,number:stickerStart+index,label,section:'Mandatory warranty stickers'})));
}
addMandatoryPackagingAndStickers(cable);
addMandatoryPackagingAndStickers(tws);
addMandatoryPackagingAndStickers(neckband);
cable.version='v2.0 · packaging & stickers included';
tws.version='v2.0 · packaging & stickers included';
neckband.version='v4.0 · approved';
api.templates.neckband=neckband;
// Keep the former 12-step sample flow available for existing local backups and tests.
const legacyTasks=[['collect','Collect selected charger sample'],['appearance','Appearance'],['moq','Minimum order quantity (MOQ)'],['protocols','Charging protocols'],['price','Price & required quantity'],['certificate','Certificate'],['production','Production period'],['approval','Sample approved — hand over to company engineer'],['wattage','Actual wattage'],['comparison','Compare specifications with actual wattage'],['temperature','Temperature check'],['engineerProtocols','Protocol verification']];
api.tasks=legacyTasks;
api.stages=[{title:'Legacy charger sample',description:'Previous sample-only flow',tasks:legacyTasks}];
api.isAvailable=(id,checks)=>{const i=legacyTasks.findIndex(x=>x[0]===id);return i>=0&&legacyTasks.slice(0,i).every(x=>checks[x[0]]);};
api.nextTask=checks=>legacyTasks.find(x=>!checks[x[0]])||null;
if(typeof module!=='undefined')module.exports=api;else root.Workflow=api;
})(typeof window!=='undefined'?window:globalThis);
