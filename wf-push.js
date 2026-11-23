/* Witness Fitness: background push reminders (client side) */
const VAPID="BEcEr0rEoCmUz0fRDSlj7CVZ_K2wQYuy6BNeryYJvxFCkmp694mnOG-sdXha84dlW6w9m7ms6ZozATTfe8cJ38E";
const b64u=s=>{const b=atob((s+"=".repeat((4-s.length%4)%4)).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from(b,c=>c.charCodeAt(0))};
const pushOK=()=>"serviceWorker" in navigator&&"PushManager" in window&&"Notification" in window&&VAPID.indexOf("PASTE")<0;
const pushSub=async()=>(await navigator.serviceWorker.ready).pushManager.getSubscription();
function pushHTML(){
 if(!pushOK())return'<div class="warn">Background reminders are not available here. On iPhone, add this website to your Home Screen first and open it from there.</div>';
 return'<h2>Background reminders</h2><div class="card"><p class="sub" style="margin:0" id="pst">Checking…</p><button class="btn" id="pon">Turn on background reminders</button><button class="btn g" id="poff" hidden>Turn off on this device</button><p class="sub" style="margin-top:8px">These reach you when the page is closed. We store a device address and your time zone to send them. On iPhone, add the site to your Home Screen first.</p></div>'}
async function pushOff(){try{const s=await pushSub();if(s){await SB.from("push_subs").delete().eq("endpoint",s.endpoint);await s.unsubscribe()}}catch(e){}}
async function pushMount(){const on=$("#pon");if(!on)return;const off=$("#poff"),st=$("#pst");
 const paint=async()=>{let s=null;try{s=await pushSub()}catch(e){}
  st.textContent=s?"On for this device.":Notification.permission==="denied"?"Blocked. Allow notifications in your browser settings, then try again.":"Off for this device.";on.hidden=!!s;off.hidden=!s};
 on.onclick=async()=>{on.disabled=true;try{
  if(await Notification.requestPermission()!=="granted"){toast("Notifications not allowed.");return}
  const reg=await navigator.serviceWorker.ready;let s=await reg.pushManager.getSubscription();
  if(!s)s=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(VAPID)});
  const r=await SB.from("push_subs").upsert({endpoint:s.endpoint,user_id:UID,sub:s.toJSON(),tz:Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"});
  if(r.error)throw r.error;toast("Background reminders on.")}catch(e){toast("Couldn't turn on reminders. Try again.")}finally{on.disabled=false;paint()}};
 off.onclick=async()=>{await pushOff();toast("Turned off.");paint()};paint()}
