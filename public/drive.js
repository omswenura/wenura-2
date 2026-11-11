/* Private, immutable Drive snapshots. OAuth access tokens live only in memory. */
(()=>{
  const SCOPE='https://www.googleapis.com/auth/drive.appdata';
  const API='https://www.googleapis.com/drive/v3/files';
  const field=document.getElementById('googleClientId');
  const status=document.getElementById('driveStatus');
  const saveButton=document.getElementById('saveDrive');
  const loadButton=document.getElementById('loadDrive');
  const connectButton=document.getElementById('connectDrive');
  const disconnectButton=document.getElementById('disconnectDrive');
  const picker=document.getElementById('driveBackup');
  let token='',expires=0,busy=false,files=[];
  try{field.value=window.CHARGER_CONFIG?.googleClientId || localStorage.getItem('charger-google-client-id') || '';}catch{field.value=window.CHARGER_CONFIG?.googleClientId || '';}
  function ui(){const connected=!!token && Date.now()<expires;saveButton.disabled=busy||!connected;loadButton.disabled=busy||!connected||!files.length;connectButton.disabled=busy;disconnectButton.hidden=!connected;field.disabled=connected||busy;picker.disabled=busy||!files.length;}
  function message(text){status.textContent=text;}
  async function request(url,options={}){
    if(!token||Date.now()>=expires){token='';ui();throw new Error('Your Google session expired. Connect Google Drive again.');}
    const response=await fetch(url,{...options,headers:{Authorization:`Bearer ${token}`,...options.headers},cache:'no-store',signal:AbortSignal.timeout(30000)});
    if(response.status===401){token='';ui();throw new Error('Your Google session expired. Connect Google Drive again.');}
    if(!response.ok){if(response.status===403)throw new Error('Drive access was denied. Check that the Drive API is enabled and app-data permission is granted.');throw new Error(`Drive request failed (${response.status}). Your device record is unchanged.`);}
    return response.json();
  }
  async function list(){
    const query=new URLSearchParams({spaces:'appDataFolder',q:"trashed = false and appProperties has { key='app' and value='charger-flow' }",fields:'files(id,name,modifiedTime)',orderBy:'modifiedTime desc',pageSize:'20'});
    const result=await request(`${API}?${query}`);files=result.files || [];
    picker.replaceChildren();files.forEach(file=>{const option=document.createElement('option');option.value=file.id;option.textContent=new Date(file.modifiedTime).toLocaleString();picker.append(option);});
    if(!files.length){const option=document.createElement('option');option.textContent='No backups yet';picker.append(option);}
  }
  async function run(action){if(busy)return;busy=true;ui();try{await action();}catch(error){message(error.name==='TimeoutError'?'Drive took too long. Try again; your local record is kept.':error.message);}finally{busy=false;ui();}}
  connectButton.onclick=()=>{
    const clientId=field.value.trim();
    if(!/^[a-zA-Z0-9._-]+\.apps\.googleusercontent\.com$/.test(clientId)){message('Enter the web OAuth client ID from the setup instructions. Do not enter a client secret.');return;}
    if(!navigator.onLine){message('Connect to the internet to use Google Drive. Your checklist works offline.');return;}
    if(!window.google?.accounts?.oauth2){message('Google sign-in is still loading or blocked. Reload while online, then try again.');return;}
    try{localStorage.setItem('charger-google-client-id',clientId);}catch{/* public ID may be re-entered */}
    busy=true;ui();message('Choose your Google account in the sign-in window.');
    try{
      const client=google.accounts.oauth2.initTokenClient({client_id:clientId,scope:SCOPE,
        callback:async response=>{
          busy=false;
          if(response.error || !response.access_token){message('Google connection was not completed. Your device record is kept.');ui();return;}
          if(!google.accounts.oauth2.hasGrantedAllScopes(response,SCOPE)){message('App-data permission is required to save backups. Reconnect and allow it.');ui();return;}
          token=response.access_token;expires=Date.now()+Math.max(0,Number(response.expires_in)-60)*1000;
          await run(async()=>{await list();message(files.length?'Connected. Restore a backup to continue on this device, or save a new snapshot.':'Connected. Save your first private backup to Drive.');});
        },error_callback:()=>{busy=false;message('Sign-in was closed or the popup was blocked. Tap Connect Google Drive to retry.');ui();}});
      client.requestAccessToken({prompt:'select_account'});
    }catch{busy=false;ui();message('Could not start Google sign-in. Check your client ID and authorized website origin.');}
  };
  saveButton.onclick=()=>run(async()=>{
    message('Saving a private snapshot to Google Drive…');
    const payload=window.ChargerApp.backup();
    const boundary=`charger_${crypto.randomUUID()}`;
    const metadata={name:`charger-flow-${new Date().toISOString().replaceAll(':','-')}.json`,parents:['appDataFolder'],mimeType:'application/json',appProperties:{app:'charger-flow'}};
    const body=`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(payload)}\r\n--${boundary}--`;
    await request('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',{method:'POST',headers:{'Content-Type':`multipart/related; boundary=${boundary}`},body});
    await list();message(`Snapshot saved at ${new Date().toLocaleTimeString()}. Later edits stay on this device until you save again.`);
  });
  loadButton.onclick=()=>run(async()=>{
    const id=picker.value;if(!files.some(file=>file.id===id))throw new Error('Choose a backup first.');
    message('Downloading backup…');const record=await request(`${API}/${encodeURIComponent(id)}?alt=media`);
    const restored=await window.ChargerApp.restore(record);
    message(restored?'Backup restored on this device. Save a new Drive snapshot after editing.':'Restore cancelled. Your device record is unchanged.');
  });
  disconnectButton.onclick=()=>{token='';expires=0;files=[];picker.replaceChildren();ui();message('Disconnected. Local data and private Drive snapshots are kept.');};
  setInterval(ui,15000);ui();
})();
