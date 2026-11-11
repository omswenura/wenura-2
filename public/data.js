(function(root){
  const tasks = (typeof module !== 'undefined' ? require('./workflow') : root.Workflow).tasks;
  function validate(record){
    if(!record || typeof record!=='object' || Array.isArray(record))throw new Error('Choose a Charger Flow JSON backup.');
    const source=record.schemaVersion===2 ? record.state : record;
    if(!source || typeof source.name!=='string' || typeof source.notes!=='string' || !source.checks || typeof source.checks!=='object' || Array.isArray(source.checks) || !source.results || typeof source.results!=='object' || Array.isArray(source.results))throw new Error('This file is not a valid Charger Flow backup.');
    if(record.schemaVersion && record.schemaVersion!==2)throw new Error('This backup version is not supported.');
    const str=(v,max)=> typeof v==='string' ? v.slice(0,max) : '';
    const state={name:str(source.name,120),supplier:str(source.supplier,120),notes:str(source.notes,20000),checks:{},results:{},time:/^([01]\d|2[0-3]):[0-5]\d$/.test(source.time)?source.time:'09:00',enabled:source.enabled!==false,notified:/^\d{4}-\d{1,2}-\d{1,2}$/.test(source.notified)?source.notified:''};
    let previousComplete=true;
    for(const [id] of tasks){state.checks[id]=previousComplete && source.checks[id]===true;previousComplete=state.checks[id];state.results[id]=str(source.results[id],2000);}
    return state;
  }
  function backup(state){return {app:'Charger Flow',schemaVersion:2,exportedAt:new Date().toISOString(),state:validate(state)};}
  function csvCell(value){let text=String(value ?? '');if(/^[\s]*[=+\-@]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';}
  function csv(state){
    const rows=[['Sample','Supplier','Task','Complete','Findings','Notes']];
    tasks.forEach(([id,label])=>rows.push([state.name,state.supplier,label,state.checks[id]?'Yes':'No',state.results[id]||'',state.notes]));
    return '\uFEFF'+rows.map(row=>row.map(csvCell).join(',')).join('\r\n');
  }
  const api={validate,backup,csv};if(typeof module!=='undefined')module.exports=api;else root.ChargerData=api;
})(typeof window!=='undefined'?window:globalThis);
