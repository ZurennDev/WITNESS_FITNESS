/* wf-figures.js v3 (2D figures + original 3D viewer). Older notes: Witness Fitness demonstrator mannequin.
   index.html calls fig(exerciseId, exerciseName) and expects an HTML string back.
   HOW IT WORKS: every exercise = a START pose and an END pose, each a list of
   segment angles in degrees. The body is built joint by joint (hip > knee > ankle),
   so limbs can never detach. The angle labels are MEASURED from the drawn body,
   so the number always matches what you see.
   ANGLE RULES (side view, figure faces right):
     th/sk = thigh/shin, ua/fa = upper arm/forearm, measured from "straight down".
       0 = down, 90 = forward, 180 = up, -90 = backward.
     t = torso lean from vertical (0 upright, 90 horizontal, forward = +).
     fo = foot direction (90 = toes forward, 0 = toes down, 180 = toes up).
     u2,f2,h2,s2,o2 = far arm / far leg (if left out, copies the near side).
     hd = extra head tilt, sp = spine curve (+ belly down, - back up). */
(function(){
if(window.__wf3){window.fig=window.__wf3;return}
var D=Math.PI/180,FL=142,PW=150,PH=150;
var SEG={t:34,u:20,f:19,th:28,sk:28,ft:9};
function p(o){return Object.assign({t:0,ua:0,fa:0,th:0,sk:0,fo:90,hd:0,sp:0},o||{})}
function vec(a,l){return[l*Math.sin(a*D),l*Math.cos(a*D)]}
function add(a,b){return[a[0]+b[0],a[1]+b[1]]}
var KEYS=["hip","S","e","w","e2","w2","k","a","t","k2","a2","t2","hd","hn","hf","sn","sf"];
function build(q,front){
 function g(k,d){return q[k]!==undefined?q[k]:d}
 var hip=[0,0],S=add(hip,[SEG.t*Math.sin(q.t*D),-SEG.t*Math.cos(q.t*D)]);
 var fb=front?13:0,lb=front?5:0,m=front?-1:1;
 function arm(b,ua,fa){var s=add(S,[b,0]),e=add(s,vec(ua,SEG.u));return[e,add(e,vec(fa,SEG.f))]}
 function leg(b,th,sk,fo){var h=add(hip,[b,0]),k=add(h,vec(th,SEG.th)),a=add(k,vec(sk,SEG.sk));return[k,a,add(a,vec(fo,SEG.ft))]}
 var A=arm(fb,q.ua,q.fa),A2=arm(-fb,g("u2",m*q.ua),g("f2",m*q.fa));
 var L=leg(lb,q.th,q.sk,q.fo),L2=leg(-lb,g("h2",m*q.th),g("s2",m*q.sk),g("o2",m*q.fo));
 var ha=(q.t+q.hd)*D;
 return{hip:hip,S:S,e:A[0],w:A[1],e2:A2[0],w2:A2[1],k:L[0],a:L[1],t:L[2],k2:L2[0],a2:L2[1],t2:L2[2],
  hd:[S[0]+13*Math.sin(ha),S[1]-13*Math.cos(ha)],hn:[lb,0],hf:[-lb,0],sn:add(S,[fb,0]),sf:add(S,[-fb,0]),q:q,front:front}}
function place(B,pin,px){
 var dx=px-B[pin][0],low=-1e9,O={q:B.q,front:B.front};
 ["hip","S","e","w","e2","w2","k","a","t","k2","a2","t2","hd"].forEach(function(k){low=Math.max(low,B[k][1]+(k==="hd"?7:0))});
 var dy=FL-2-low;KEYS.forEach(function(k){O[k]=[B[k][0]+dx,B[k][1]+dy]});return O}
/* joint name -> [point A, joint, point C, label] */
var JT={knee:["hip","k","a","Knee"],hip:["S","hip","k","Hip"],elbow:["S","e","w","Elbow"],shoulder:["hip","S","e","Shoulder"]};
function nz(x){var l=Math.hypot(x[0],x[1])||1;return[x[0]/l,x[1]/l]}
function ang(B,n){var j=JT[n],a=B[j[0]],b=B[j[1]],c=B[j[2]],u=[a[0]-b[0],a[1]-b[1]],w=[c[0]-b[0],c[1]-b[1]];
 return Math.round(Math.acos(Math.max(-1,Math.min(1,(u[0]*w[0]+u[1]*w[1])/(Math.hypot(u[0],u[1])*Math.hypot(w[0],w[1])))))/D)}
function P(a){return a[0].toFixed(1)+" "+a[1].toFixed(1)}
function ln(pts,w,c,o){return'<path d="M'+pts.map(P).join(" L")+'" fill="none" stroke="'+c+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"'+(o?' opacity="'+o+'"':"")+'/>'}
function lin(x1,y1,x2,y2,w){return'<line x1="'+x1.toFixed(1)+'" y1="'+y1.toFixed(1)+'" x2="'+x2.toFixed(1)+'" y2="'+y2.toFixed(1)+'" stroke="var(--mute)" stroke-opacity=".55" stroke-width="'+w+'" stroke-linecap="round"/>'}
function arc(B,n){
 var j=JT[n],a=B[j[0]],b=B[j[1]],c=B[j[2]],r=11,u=nz([a[0]-b[0],a[1]-b[1]]),w=nz([c[0]-b[0],c[1]-b[1]]),d=ang(B,n),m=nz([u[0]+w[0],u[1]+w[1]]);
 if(d>=172)m=[u[1],-u[0]];
 var s='<circle cx="'+b[0].toFixed(1)+'" cy="'+b[1].toFixed(1)+'" r="3.6" fill="var(--acc)"/>';
 if(d<172)s+='<path d="M'+P([b[0]+r*u[0],b[1]+r*u[1]])+' A'+r+' '+r+' 0 0 '+((u[0]*w[1]-u[1]*w[0])>0?1:0)+' '+P([b[0]+r*w[0],b[1]+r*w[1]])+'" fill="none" stroke="var(--acc)" stroke-width="2"/>';
 return s+'<text x="'+(b[0]+21*m[0]).toFixed(1)+'" y="'+(b[1]+21*m[1]+3.5).toFixed(1)+'" text-anchor="middle" font-size="11" font-weight="700" fill="var(--acc)">'+d+'°</text>'}
function prop(sp,B,R){var n=sp[0],x,y,x1,x2;
 if(n==="chair"){x=R.hip[0];y=R.hip[1]+5;return lin(x-22,y,x+12,y,3)+lin(x-22,y,x-22,y-40,3)+lin(x-20,y,x-20,FL,2.5)+lin(x+10,y,x+10,FL,2.5)}
 if(n==="bench"||n==="benchh"){y=(n==="bench"?R.hip[1]:R.w2[1])+6;x1=(n==="bench"?R.hip[0]:Math.min(R.k2[0],R.w2[0]))-12;x2=(n==="bench"?R.S[0]:R.w2[0])+14;return lin(x1,y,x2,y,5)+lin(x1+4,y,x1+4,FL,3)+lin(x2-4,y,x2-4,FL,3)}
 if(n==="step"){x=R.a[0];y=R.a[1]+4;return'<rect x="'+(x-16).toFixed(1)+'" y="'+y.toFixed(1)+'" width="32" height="'+(FL-y).toFixed(1)+'" rx="3" fill="var(--mute)" fill-opacity=".35"/>'}
 if(n==="wall"){x=R[sp[1]][0]+5;return lin(x,6,x,FL,4)}
 if(n==="bar"){var q=B[sp[1]];return'<circle cx="'+q[0].toFixed(1)+'" cy="'+q[1].toFixed(1)+'" r="6" fill="var(--mute)"/>'}
 return""}
function draw(B,ks){
 var far="var(--mute)",near="var(--ink)",f=B.front,s="",c=[B.hip[0]+(B.S[0]-B.hip[0])/2,B.hip[1]+(B.S[1]-B.hip[1])/2],sp=B.q.sp||0,tr=B.q.t*D;
 s+=ln([B.hf,B.k2,B.a2],7,far,.8);if(!f)s+=ln([B.a2,B.t2],5,far,.8);
 s+=ln([B.sf,B.e2,B.w2],6,far,.8);
 s+='<path d="M'+P(B.hip)+' Q'+P([c[0]+sp*Math.cos(tr),c[1]+sp*Math.sin(tr)])+' '+P(B.S)+'" fill="none" stroke="'+near+'" stroke-width="'+(f?14:11)+'" stroke-linecap="round" opacity=".92"/>';
 s+='<circle cx="'+B.hd[0].toFixed(1)+'" cy="'+B.hd[1].toFixed(1)+'" r="7.5" fill="'+near+'"/>';
 s+=ln([B.hn,B.k,B.a],7,near);if(!f)s+=ln([B.a,B.t],5,near);
 s+=ln([B.sn,B.e,B.w],6,near);
 ks.forEach(function(k){s+=arc(B,k)});return s}
function fig(id,name){
 var E=T[id];if(!E)return"";
 var fr=!!E.front,poses=[E.a].concat(E.b?[E.b]:[]),pin=E.pin||"a",px=E.px||60;
 var bodies=poses.map(function(q){return place(build(q,fr),pin,px)}),R=bodies[bodies.length-1],lb=E.lb||(poses.length>1?["Start","End"]:["Position"]),ks=[],svg="";
 bodies.forEach(function(B,i){
  svg+='<g transform="translate('+i*PW+' 0)"><rect x="3" y="3" width="'+(PW-6)+'" height="'+(PH-6)+'" rx="12" fill="var(--bg)" stroke="var(--line)"/>'+lin(10,FL,PW-10,FL,2)+
  '<text x="12" y="19" font-size="11" font-weight="700" fill="var(--mute)">'+lb[i]+'</text>'+(E.props||[]).map(function(s){return prop(s,B,R)}).join("")+draw(B,ks)+'</g>'});
 var cap=ks.map(function(k){return JT[k][3]+" "+bodies.map(function(B){return ang(B,k)}).join("° → ")+"°"}).join(" · "),
  nm=String(name||"").replace(/[&<>"]/g,"");
 return'<div class="wf-fig" role="img" aria-label="'+nm+': '+lb.join(" and ")+' positions"><svg viewBox="0 0 '+PW*bodies.length+' '+PH+'" style="width:100%;max-width:'+bodies.length*210+'px;height:auto;display:block;margin:10px auto 4px" aria-hidden="true">'+svg+'</svg>'+
  (cap?'<p class="sub" style="text-align:center;margin:2px 0"><b style="color:var(--acc)">'+cap+'</b></p>':"")+(E.n?'<p class="sub" style="text-align:center;margin:2px 0 8px">'+E.n.replace(/[^.]*\u00b0[^.]*\.\s*/g,'')+'</p>':"")+'</div>'}
/* ===== POSE TABLE: edit the angles here to fix any exercise ===== */
var T={
squat:{a:p(),b:p({t:40,ua:85,fa:85,th:80,sk:-12}),k:["knee","hip"],n:"Hips back, chest up, heels flat. Knees about 90° at the bottom."},
pushup:{pin:"t",px:20,a:p({t:70,th:-70,sk:-70,fo:0}),b:p({t:80,ua:-49,fa:53,th:-80,sk:-80,fo:0}),k:["elbow"],n:"Body stays in one straight line from head to heels."},
plank:{pin:"t",px:20,a:p({t:83,fa:90,th:-83,sk:-83,fo:0}),lb:["Hold"],k:["hip"],n:"Elbows under shoulders. Hip near 180° means a straight line."},
lunge:{px:75,a:p(),b:p({th:90,sk:0,h2:-5,s2:-100,o2:-50}),k:["knee"],n:"Front knee about 90°, back knee just above the floor, torso upright."},
burpee:{px:50,a:p({t:60,th:95,sk:-25}),b:p({ua:180,fa:180}),lb:["Hands down","Jump up"],n:"Squat, hands to the floor, step back, step in, then jump."},
jacks:{front:true,pin:"hip",px:75,a:p(),b:p({ua:160,fa:160,th:17,sk:17}),lb:["Together","Apart"],n:"Front view. Arms overhead as your feet jump apart."},
knees:{a:p(),b:p({t:4,th:90,sk:0,ua:-35,fa:55,u2:45,f2:135}),k:["knee","hip"],n:"Lift the knee to hip height. Opposite arm swings forward."},
march:{a:p(),b:p({th:75,sk:-5,ua:-30,fa:60,u2:40,f2:110}),k:["knee"],n:"Steady rhythm, stay tall, swing your arms."},
sprints:{a:p({t:20}),b:p({t:22,th:70,sk:10,h2:-40,s2:-130,o2:-100,ua:-50,fa:40,u2:55,f2:135}),k:["knee"],n:"Lean slightly, drive the knee up, arms bent about 90°."},
punch:{props:[["chair"]],a:p({th:90,sk:0,ua:20,fa:160}),b:p({th:90,sk:0,ua:90,fa:90}),lb:["Guard","Punch"],k:["elbow"],n:"Sit tall. Fist back to the chin, then punch straight forward."},
deadlift:{props:[["bar","w"]],a:p({t:55,th:50,sk:-25}),b:p(),lb:["Bottom","Stand tall"],k:["knee","hip"],n:"Flat back. Hinge at the hips, bar close to your legs."},
bench:{pin:"a",px:38,props:[["bench"],["bar","w"]],a:p({t:90,ua:180,fa:180,th:-100,sk:-10,fo:-90}),b:p({t:90,ua:-80,fa:180,th:-100,sk:-10,fo:-90}),lb:["Top","Chest"],k:["elbow"],n:"Feet planted. Lower the bar to mid-chest, then press up."},
row:{px:50,props:[["benchh"]],a:p({t:75,th:15,sk:-5,h2:75,s2:-20,u2:0,f2:0}),b:p({t:75,th:15,sk:-5,h2:75,s2:-20,u2:0,f2:0,ua:-120,fa:-10}),lb:["Arm down","Pull to hip"],k:["elbow"],n:"Back flat. Pull the dumbbell to your hip, elbow close to the body."},
press:{props:[["chair"]],a:p({th:90,sk:0,ua:80,fa:180}),b:p({th:90,sk:0,ua:170,fa:180}),lb:["Shoulder height","Overhead"],k:["elbow"],n:"Press straight overhead without arching your back."},
curl:{a:p({u2:0,f2:0}),b:p({fa:150,u2:0,f2:0}),k:["elbow"],n:"Elbow stays at your side. Do not swing."},
hams:{pin:"hip",px:35,a:p({th:90,sk:90,fo:180,h2:120,s2:-60,o2:90,ua:30,fa:30}),b:p({t:65,th:90,sk:90,fo:180,h2:120,s2:-60,o2:90,ua:75,fa:75}),lb:["Sit tall","Hinge forward"],k:["hip"],n:"Hinge from the hips. Keep your back long, do not bounce."},
quad:{a:p(),b:p({sk:-150,ua:-20,fa:-20,u2:90,f2:90,h2:0,s2:0}),props:[["wall","w2"]],k:["knee"],n:"Hold the wall. Heel to glutes, knees together, hips forward."},
catcow:{pin:"k",px:40,a:p({t:72,th:0,sk:-90,fo:-90,sp:-9,hd:35}),b:p({t:72,th:0,sk:-90,fo:-90,sp:9,hd:-30}),lb:["Cat: round up","Cow: arch down"],n:"Hands under shoulders, knees under hips. Move your spine slowly."},
child:{pin:"k",px:85,a:p({th:0,sk:-90,fo:-90}),b:p({t:100,hd:40,th:70,sk:-90,fo:-90,ua:85,fa:85}),lb:["Kneel","Fold forward"],n:"Sit hips back toward your heels. Reach forward and rest."},
chairsq:{props:[["chair"]],a:p({ua:90,fa:90}),b:p({t:35,th:88,sk:-2,ua:90,fa:90}),lb:["Stand","Touch the chair"],k:["knee"],n:"Sit back until you lightly touch the chair, then stand."},
wallpush:{pin:"w",px:105,props:[["wall","w"]],a:p({t:15,ua:90,fa:90,th:-15,sk:-15}),b:p({t:35,ua:-30,fa:100,th:-35,sk:-35}),k:["elbow"],n:"Hands stay on the wall. Body in one straight line."},
bridge:{px:40,a:p({t:90,ua:-90,fa:-90,th:-125,sk:50,fo:-90}),b:p({t:108,ua:-90,fa:-90,th:-108,sk:50,fo:-90}),lb:["Lie down","Lift hips"],k:["hip"],n:"Push through your heels until shoulders, hips and knees form a line."},
stand1:{a:p(),b:p({th:10,sk:-40,h2:0,s2:0}),k:["knee"],n:"Hold a wall lightly. Keep hips level, look ahead."},
heeltoe:{a:p(),b:p({th:5,sk:5,h2:-5,s2:-5}),n:"Heel of the front foot touches the toes of the back foot."},
sideleg:{front:true,pin:"hip",px:75,a:p(),b:p({th:35,sk:35,h2:0,s2:0}),lb:["Stand","Leg out"],n:"Front view. Lift the leg out to the side, toes forward, do not lean."},
twist:{props:[["chair"]],a:p({th:90,sk:0,ua:40,fa:150}),lb:["Sit tall"],n:"Rotate your shoulders to each side. Hips stay still (side view cannot show the turn)."},
breath:{props:[["chair"]],a:p({th:90,sk:0,ua:10,fa:30}),lb:["Relax"],n:"Belly rises on the 4-second inhale, falls on the 6-second exhale."},
smarch:{props:[["chair"]],a:p({th:90,sk:0}),b:p({th:125,sk:5,h2:90,s2:0}),k:["knee"],n:"Sit tall. Lift one knee, lower it, then alternate."},
arms:{props:[["chair"]],a:p({th:90,sk:0,ua:90,fa:90}),b:p({th:90,sk:0,ua:160,fa:160}),lb:["Arm forward","Arm up"],k:["shoulder"],n:"Draw circles with your arm: small first, then larger."},
sumo:{front:true,pin:"hip",px:75,a:p({th:35,sk:35,ua:-8,fa:-22}),b:p({th:75,sk:0,ua:-8,fa:-22}),lb:["Wide stance","Squat down"],k:["knee"],n:"Front view. Toes out, knees over toes, chest up."},
stepup:{pin:"a2",px:40,props:[["step"]],a:p({}),b:p({t:10,th:70,sk:-5,h2:0,s2:0}),lb:["Foot on floor","Step up"],k:["knee","hip"],n:"Place the whole foot on the step, press through the heel, then step down."},
legext:{props:[["chair"]],a:p({th:90,sk:0}),b:p({th:90,sk:90,fo:180}),k:["knee"],n:"Straighten the knee until the leg is level, pause, lower slowly."}
};
/* target muscle zones that glow in 3D (thigh, calf, arm, shoulder, glute, core, chest, back) */
var ZN={squat:["thigh","glute"],pushup:["chest","arm","shoulder"],plank:["core","shoulder"],lunge:["thigh","glute"],burpee:["thigh","chest","core"],jacks:["shoulder","calf"],knees:["thigh","core"],march:["thigh","core"],sprints:["thigh","calf","glute"],punch:["shoulder","core"],deadlift:["glute","back","thigh"],bench:["chest","arm"],row:["back","arm"],press:["shoulder","arm"],curl:["arm"],hams:["thigh"],quad:["thigh"],catcow:["core","back"],child:["back"],chairsq:["thigh","glute"],wallpush:["chest","arm"],bridge:["glute","thigh"],stand1:["calf","core"],heeltoe:["calf","core"],sideleg:["glute"],twist:["core"],breath:["core"],smarch:["core","thigh"],arms:["shoulder"],legext:["thigh"]},SUP={bench:1,bridge:1};ZN.sumo=["thigh","glute"];ZN.stepup=["thigh","glute"];
/* ===== 3D VIEWER (Three.js r128, loaded on demand from cdnjs) =====
   Original mannequin: capsule limbs, orange joints, soft floor + shadow.
   The same pose table T drives it; angles interpolate Start <-> End.
   If WebGL or the library is unavailable, the 2D figure stays visible. */
var S3=0.0155,CYC=3600,V=[],raf=0,tl=0,TQ=[];
var ZO={hn:.08,k:.08,a:.08,t:.08,hf:-.08,k2:-.08,a2:-.08,t2:-.08,sn:.2,e:.2,w:.2,sf:-.2,e2:-.2,w2:-.2,hip:0,S:0,hd:0};
var ALLK=["hip","S","e","w","e2","w2","k","a","t","k2","a2","t2","hd","hn","hf","sn","sf"];
function eff(q,fr){var m=fr?-1:1,o=Object.assign({},q);[["u2","ua"],["f2","fa"],["h2","th"],["s2","sk"],["o2","fo"]].forEach(function(x){if(o[x[0]]===undefined)o[x[0]]=m*q[x[1]]});return o}
function mix(a,b,u){var o={};for(var k in a)o[k]=a[k]+(b[k]-a[k])*u;return o}
function ss(x){return x*x*(3-2*x)}
function prog(u){return u<.15?0:u<.5?ss((u-.15)/.35):u<.65?1:1-ss((u-.65)/.35)}
function loadThree(ok,bad){if(window.THREE)return ok();if(tl===-1)return bad();TQ.push([ok,bad]);if(tl)return;tl=1;
 var s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
 s.onload=function(){TQ.forEach(function(x){x[0]()});TQ=[]};s.onerror=function(){tl=-1;TQ.forEach(function(x){x[1]()});TQ=[]};document.head.appendChild(s)}
function st(el,t){try{var p=el.querySelector('.wf3-st');if(p)p.textContent=t;console.info('WF3D',el.dataset.id,'-',t)}catch(x){}}
function oops(el,e){try{st(el,'3D failed: '+((e&&e.message)||e));console.error('WF3D error:',e);var u=el.querySelector('.wf3-ui');if(u)u.remove();var f=el.firstChild;if(f&&f.style)f.style.display='';var m=document.createElement('p');m.className='sub';m.style.cssText='color:var(--hot);text-align:center';m.textContent='3D view unavailable ('+((e&&e.message)||e)+'). Showing the flat view.';el.appendChild(m)}catch(x){}}
var ALIAS=[[/sumo/i,"sumo"],[/step.?up/i,"stepup"]];
/* the app keeps the signed-in profile in its global S; read the sex from there so index.html needs no change */
function curSex(){try{return(S&&S.profile&&S.profile.sex)||""}catch(e){return""}}
function fig3(id,name,sex){var rid=T[id]?id:null;if(!rid)for(var i=0;i<ALIAS.length;i++)if(ALIAS[i][0].test(id+" "+(name||""))){rid=ALIAS[i][1];break}
 if(!rid){(window.WF_MISSING=window.WF_MISSING||{})[id]=name;return""}id=rid;var h=fig(id,name);if(!h)return"";var nm=String(name||"").replace(/[&<>"]/g,"");
 return'<div class="wf3" data-id="'+id+'" data-sex="'+String(sex||window.WF_SEX||curSex()).replace(/[^a-z]/gi,"")+'" role="group" aria-label="3D demonstration: '+nm+'.">'+'<div class="wf3-2d">'+h+'</div><p class="sub wf3-st" style="display:none"></p></div>'}
function setBone(m,a,b){var d=new THREE.Vector3().subVectors(b,a),L=d.length()||1e-4;m.position.copy(a).addScaledVector(d,.5);m.scale.set(1,L,1);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize())}
var NS=12,PK=[[0,.096,.138],[.12,.09,.128],[.3,.083,.108],[.5,.095,.128],[.7,.108,.157],[.88,.108,.172],[1,.092,.15]];
var PKF=[[0,.092,.15],[.12,.082,.138],[.3,.074,.104],[.5,.082,.112],[.7,.09,.125],[.88,.092,.135],[1,.08,.118]];
function pf(u,K){K=K||PK;for(var i=1;i<K.length;i++)if(u<=K[i][0]){var a=K[i-1],b=K[i],t=(u-a[0])/(b[0]-a[0]);return[a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]}return[K[6][1],K[6][2]]}
function upd(v,pr){
 var q=mix(v.qa,v.qb,pr),B=place(build(q,v.fr),v.pin,v.px),P=v.P,fr=v.fr,px=v.px;
 ALLK.forEach(function(k){var p=B[k];if(fr)P[k].set(0,(FL-p[1])*S3,(p[0]-px)*S3);else P[k].set((p[0]-px)*S3,(FL-p[1])*S3,ZO[k])});
 if(fr){P.t.copy(P.a).add(new THREE.Vector3(.13,-.02,0));P.t2.copy(P.a2).add(new THREE.Vector3(.13,-.02,0))}
 if(v.sh){["sn","e","w"].forEach(function(k){P[k].z-=v.sh});["sf","e2","w2"].forEach(function(k){P[k].z+=v.sh})}
 if(v.hw){["hn","k","a","t"].forEach(function(k){P[k].z+=v.hw});["hf","k2","a2","t2"].forEach(function(k){P[k].z-=v.hw})}
 var tr=q.t*D,c=[(B.hip[0]+B.S[0])/2+q.sp*Math.cos(tr),(B.hip[1]+B.S[1])/2+q.sp*Math.sin(tr)];
 for(var i=0;i<=NS;i++){var u=i/NS,x=(1-u)*(1-u)*B.hip[0]+2*u*(1-u)*c[0]+u*u*B.S[0],y=(1-u)*(1-u)*B.hip[1]+2*u*(1-u)*c[1]+u*u*B.S[1];
  if(fr)v.TP[i].set(0,(FL-y)*S3,(x-px)*S3);else v.TP[i].set((x-px)*S3,(FL-y)*S3,0)}
 v.n3.set(fr?1:Math.cos(tr),fr?0:-Math.sin(tr),0);if(v.sup)v.n3.multiplyScalar(-1);
 v.ha=(q.t+q.hd)*D;
 v.parts.forEach(function(p){p.u()});
 v.bar&&v.bar.position.set(P.w.x,P.w.y,0);
 v.shadow.position.set(P.hip.x,.004,fr?P.hip.z:0);return B}
function mk(el){
 var E=T[el.dataset.id],fr=!!E.front,v={el:el,E:E,fr:fr,pin:E.pin||"a",px:E.px||60,P:{},TP:[],tm:[],ts:[],bones:[],joints:[],clock:0,last:0,paused:false,dirty:1};
 v.qa=eff(E.a,fr);v.qb=eff(E.b||E.a,fr);
 var ren=new THREE.WebGLRenderer({antialias:true,alpha:true});ren.setClearColor(0x000000,0);ren.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
 var sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(35,1.4,.1,50);
 sc.add(new THREE.HemisphereLight(0xffffff,0x8a94b8,.95));var dl=new THREE.DirectionalLight(0xffffff,.8);dl.position.set(2,4,3);sc.add(dl);var dl2=new THREE.DirectionalLight(0x9db4ff,.4);dl2.position.set(-2,2.5,-3);sc.add(dl2);
 var M=function(c){return new THREE.MeshStandardMaterial({color:c,roughness:.5,metalness:.05})},mb=M(0x2ba4a0),mf=M(0x1f7f7c),ma=M(0xff8a4c),mh=M(0xf3efe7),mp=M(0x8f97b8);
 ALLK.forEach(function(k){v.P[k]=new THREE.Vector3()});
 var P=v.P,TP=v.TP,F=/^(f|w)/i.test(String(el.dataset.sex||window.WF_SEX||"")),X=function(m,f){return F?f:m},PKX=F?PKF:PK,msk=M(0xd8c4b2),mskF=M(0xae9a8a),ZS=ZN[el.dataset.id]||[],Y=new THREE.Vector3(0,1,0),t1=new THREE.Vector3(),t2=new THREE.Vector3();
 v.sh=X(0,.03);v.hw=X(0,.012);v.parts=[];v.zones=[];v.sup=!!SUP[el.dataset.id];v.n3=new THREE.Vector3(1,0,0);
 v.hot=new THREE.MeshStandardMaterial({color:0xff9a5c,emissive:0xff5a1a,emissiveIntensity:.4,roughness:.5});
 v.hotF=new THREE.MeshStandardMaterial({color:0xd9753a,emissive:0xc04810,emissiveIntensity:.4,roughness:.5});
 for(var i=0;i<=NS;i++)TP.push(new THREE.Vector3());
 /* anatomical mannequin (male or female build): every muscle is a stretched sphere; target muscles glow orange */
 function ell(far,zone){var on=zone&&ZS.indexOf(zone)>=0,m=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),on?(far?v.hotF:v.hot):(far?mskF:msk));sc.add(m);if(on)v.zones.push(m);return m}
 function bone(a,b,r1,r2,far){var m=new THREE.Mesh(new THREE.CylinderGeometry(r2,r1,1,24,1),far?mskF:msk);sc.add(m);v.parts.push({m:m,u:function(){setBone(m,P[a],P[b])}})}
 function ball(k,sx,sy,sz,far,zone){var m=ell(far,zone);m.scale.set(sx,sy,sz);v.parts.push({m:m,u:function(){m.position.copy(P[k])}})}
 function limb(a,b,f,off,Lf,sd,sw,far,zone){var m=ell(far,zone);v.parts.push({m:m,u:function(){
  t1.subVectors(P[b],P[a]);var l=t1.length()||1e-4;t1.divideScalar(l);
  if(v.fr)t2.set(1,0,0);else t2.set(-t1.y,t1.x,0).normalize();
  if(v.sup)t2.multiplyScalar(-1);
  m.position.copy(P[a]).addScaledVector(t1,l*f).addScaledVector(t2,off);
  m.quaternion.setFromUnitVectors(Y,t1);m.scale.set(sd,l*Lf,sw)}})}
 function tfeat(u,lz,off,up,rd,rl,rw,zone){var m=ell(false,zone);v.parts.push({m:m,u:function(){
  var f=u*NS,i=Math.min(NS-1,Math.floor(f)),A=TP[i],Bq=TP[i+1];
  t2.subVectors(Bq,A);var dx=t2.x,dy=t2.y;t2.normalize();
  t1.lerpVectors(A,Bq,f-i).addScaledVector(v.n3,off).addScaledVector(t2,up);t1.z+=lz;
  m.position.copy(t1);m.rotation.z=v.fr?0:-Math.atan2(dx,dy);m.scale.set(rd,rl,rw)}})}
 function hpos(m,f,u){var c=Math.cos(v.ha),s=Math.sin(v.ha);if(v.fr)m.position.set(P.hd.x+f,P.hd.y+u,P.hd.z);else m.position.set(P.hd.x+c*f+s*u,P.hd.y-s*f+c*u,P.hd.z);m.rotation.z=v.fr?0:-v.ha}
 /* torso: men = V-taper, women = narrower shoulders, small waist, wider hips */
 for(var i=0;i<=NS;i++)(function(i){var d=pf(i/NS,PKX),m=ell(false,null);m.scale.set(d[0],.062,d[1]);v.parts.push({m:m,u:function(){var i0=Math.max(0,i-1),i1=Math.min(NS,i+1);m.position.copy(TP[i]);m.rotation.z=v.fr?0:-Math.atan2(TP[i1].x-TP[i0].x,TP[i1].y-TP[i0].y)}})})(i);
 [-1,1].forEach(function(sd){
  if(F)tfeat(.74,sd*.062,.07,0,.047,.052,.058,"chest");else tfeat(.77,sd*.08,.085,0,.048,.062,.085,"chest");
  [.2,.31,.42].forEach(function(u){tfeat(u,sd*X(.036,.03),pf(u,PKX)[0]-.012,0,X(.026,.021),X(.036,.03),X(.04,.034),"core")});
  tfeat(.66,sd*X(.125,.095),X(-.05,-.04),0,X(.05,.04),X(.13,.11),X(.065,.05),"back")});
 tfeat(.99,0,-.02,.03,X(.07,.055),X(.075,.06),X(.15,.105),"back");
 /* head and neck */
 var hdm=ell(false,null),jw=ell(false,null),ns=ell(false,null);hdm.scale.set(X(.102,.095),X(.118,.113),X(.09,.083));jw.scale.set(X(.075,.065),X(.07,.062),X(.062,.056));ns.scale.set(.02,.026,.02);
 v.parts.push({m:hdm,u:function(){hdm.position.copy(P.hd);hdm.rotation.z=v.fr?0:-v.ha}});
 v.parts.push({m:jw,u:function(){hpos(jw,.025,-.06)}});v.parts.push({m:ns,u:function(){hpos(ns,.1,-.012)}});
 bone("S","hd",X(.05,.04),X(.052,.043),false);
 /* legs */
 [["hn","k","a","t",false],["hf","k2","a2","t2",true]].forEach(function(L){var h=L[0],k=L[1],a=L[2],t=L[3],fa=L[4];
  bone(h,k,X(.082,.08),X(.062,.057),fa);bone(k,a,X(.056,.05),X(.036,.032),fa);
  limb(h,k,.5,X(.014,.012),.46,X(.068,.062),X(.072,.066),fa,"thigh");limb(h,k,.45,-.016,.42,X(.06,.055),X(.064,.058),fa,"thigh");limb(k,a,X(.27,.3),-.02,.32,X(.054,.046),X(.052,.045),fa,"calf");
  ball(h,X(.086,.09),X(.086,.09),X(.086,.09),fa,null);ball(k,X(.05,.045),X(.05,.045),X(.05,.045),fa,null);ball(a,X(.036,.032),X(.036,.032),X(.036,.032),fa,null);
  var ft=ell(fa,null);ft.scale.set(X(.034,.03),X(.088,.08),X(.046,.04));
  v.parts.push({m:ft,u:function(){t1.subVectors(P[t],P[a]);var l=t1.length()||1e-4;t1.divideScalar(l);ft.position.copy(P[a]).addScaledVector(t1,l*.42);ft.quaternion.setFromUnitVectors(Y,t1)}});
  var gl=ell(fa,"glute");gl.scale.set(X(.088,.1),X(.094,.105),X(.078,.09));
  v.parts.push({m:gl,u:function(){t2.subVectors(TP[NS],TP[0]).normalize();gl.position.copy(P[h]).addScaledVector(v.n3,-X(.07,.078));gl.rotation.z=v.fr?0:-Math.atan2(t2.x,t2.y)}})});
 /* arms */
 [["sn","e","w",false],["sf","e2","w2",true]].forEach(function(A){var s=A[0],e=A[1],w=A[2],fa=A[3];
  bone(s,e,X(.05,.042),X(.042,.036),fa);bone(e,w,X(.042,.036),X(.03,.026),fa);
  limb(s,e,.4,.014,.34,X(.05,.042),X(.05,.042),fa,"arm");limb(s,e,.4,-.016,.3,X(.05,.041),X(.05,.041),fa,"arm");limb(e,w,.3,.008,.3,X(.044,.037),X(.042,.036),fa,"arm");
  ball(s,X(.074,.062),X(.088,.072),X(.08,.066),fa,"shoulder");ball(e,X(.043,.036),X(.043,.036),X(.043,.036),fa,null);
  var hm=ell(fa,null);hm.scale.set(X(.026,.022),X(.058,.052),X(.042,.036));
  v.parts.push({m:hm,u:function(){t1.subVectors(P[w],P[e]).normalize();hm.position.copy(P[w]).addScaledVector(t1,.048);hm.quaternion.setFromUnitVectors(Y,t1)}})});
 var cv=document.createElement("canvas");cv.width=cv.height=64;var g=cv.getContext("2d"),gr=g.createRadialGradient(32,32,2,32,32,32);gr.addColorStop(0,"rgba(0,0,0,.4)");gr.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=gr;g.fillRect(0,0,64,64);
 v.shadow=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.1),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthWrite:false}));v.shadow.rotation.x=-Math.PI/2;sc.add(v.shadow);
 var fl=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.25,.03,64),new THREE.MeshStandardMaterial({color:0x2c3360,roughness:.95}));sc.add(fl);
 var rg=new THREE.Mesh(new THREE.RingGeometry(1.86,1.9,64),new THREE.MeshBasicMaterial({color:0xff8a4c,transparent:true,opacity:.5,side:THREE.DoubleSide}));rg.rotation.x=-Math.PI/2;rg.position.y=.003;rg.visible=false;sc.add(rg);
 /* props (chair, bench, wall, bar) */
 var Rb=place(build(eff(E.b||E.a,fr),fr),v.pin,v.px),X=function(x){return(x-v.px)*S3},Yy=function(y){return(FL-y)*S3};
 function box(cx,cy,cz,sx,sy,sz,m){var b=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),m||mp);b.position.set(cx,cy,cz);sc.add(b)}
 function legs(x1,x2,y,zw){[x1,x2].forEach(function(x){[-zw,zw].forEach(function(z){box(X(x),Yy(y)/2,z,.04,Yy(y),.04)})})}
 (E.props||[]).forEach(function(s){var n=s[0],x1,x2,y;
  if(n==="chair"){x1=Rb.hip[0]-22;x2=Rb.hip[0]+12;y=Rb.hip[1]+5;box(X((x1+x2)/2),Yy(y)-.02,0,(x2-x1)*S3,.04,.5);box(X(x1),Yy(y-20),0,.04,40*S3,.5);legs(x1+2,x2-2,y,.2)}
  else if(n==="bench"||n==="benchh"){y=(n==="bench"?Rb.hip[1]:Rb.w2[1])+6;x1=(n==="bench"?Rb.hip[0]:Math.min(Rb.k2[0],Rb.w2[0]))-12;x2=(n==="bench"?Rb.S[0]:Rb.w2[0])+14;box(X((x1+x2)/2),Yy(y)-.03,0,(x2-x1)*S3,.06,.34);legs(x1+4,x2-4,y,.12)}
  else if(n==="step"){y=Rb.a[1]+4;box(X(Rb.a[0]),Yy(y)/2,0,32*S3,Yy(y),.5)}
  else if(n==="wall"){box(X(Rb[s[1]][0]+5),.95,0,.06,1.9,2.4,new THREE.MeshStandardMaterial({color:0x8f97b8,transparent:true,opacity:.35}))}
  else if(n==="bar"){var br=new THREE.Group(),bm=new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,1.1,10),mp);bm.rotation.x=Math.PI/2;br.add(bm);
   [-.45,.45].forEach(function(z){var p=new THREE.Mesh(new THREE.CylinderGeometry(.11,.11,.04,18),M(0x444b6b));p.rotation.x=Math.PI/2;p.position.z=z;br.add(p)});sc.add(br);v.bar=br}});
 /* camera fit from both poses */
 var mn=[9,9,9],mx=[-9,-9,-9];[0,.5,1].forEach(function(pr){upd(v,pr);["hip","S","e","w","e2","w2","k","a","t","k2","a2","t2","hd"].forEach(function(k){var p=v.P[k];[p.x,p.y,p.z].forEach(function(c,i){mn[i]=Math.min(mn[i],c);mx[i]=Math.max(mx[i],c)})})});
 var W=fr?mx[2]-mn[2]:mx[0]-mn[0],H=mx[1];v.tx=fr?0:(mn[0]+mx[0])/2;v.tz=fr?(mn[2]+mx[2])/2:0;v.ty=Math.max(.6,H/2);v.dist=Math.max(2.14*H,1.35*W,2.4);
 fl.position.set(v.tx,-.02,v.tz);rg.position.x=v.tx;rg.position.z=v.tz;
 v.az0=fr?Math.PI/2:0;v.ev0=.12;v.az=v.az0;v.ev=v.ev0;
 /* UI */
 var ui=document.createElement("div"),box_=document.createElement("div"),hud=document.createElement("div"),cap=document.createElement("p"),bt=document.createElement("div"),nt=document.createElement("p"),pz=document.createElement("button"),rs=document.createElement("button");
 box_.style.cssText="position:relative;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:radial-gradient(circle at 50% 25%,#2b3358,#10132a);cursor:default;margin:10px 0 4px";
 ren.domElement.style.cssText="display:block;width:100%;height:auto";hud.style.cssText="position:absolute;left:12px;top:9px;font:700 12px system-ui,sans-serif;color:#b9c3e6;pointer-events:none";
 cap.className="sub";cap.style.cssText="text-align:center;margin:2px 0;font-weight:700;color:var(--acc);min-height:20px";bt.className="chips";bt.style.justifyContent="center";
 pz.className=rs.className="chip";pz.textContent="Pause";rs.textContent="Reset view";nt.className="sub";nt.style.cssText="text-align:center;margin:6px 0 8px";nt.textContent=E.n||"";
 pz.onclick=function(){v.paused=!v.paused;pz.textContent=v.paused?"Play":"Pause"};rs.onclick=function(){v.az=v.az0;v.ev=v.ev0;v.touched=0;v.dirty=1};
 box_.appendChild(ren.domElement);ui.appendChild(box_);
 ui.className="wf3-ui";el.insertBefore(ui,el.querySelector(".wf3-st"));st(el,"3D scene built, drawing first frame...");
 
 v.ren=ren;v.sc=sc;v.cam=cam;v.ui=ui;v.box=box_;v.hud=hud;v.cap=cap;v.cw=0;return v}
function draw3(v,t){
 var dt=v.last?Math.min(100,t-v.last):0;v.last=t;var anim=!!v.E.b&&!v.paused;if(anim){v.clock+=dt}
 if(!anim&&!v.dirty&&v.drawn&&!(v.zones&&v.zones.length))return;v.drawn=1;v.dirty=0;
 var w=v.box.clientWidth||320;if(w!==v.cw){v.cw=w;var h=Math.round(w*.72);v.ren.setSize(w,h,false);v.cam.aspect=w/h;v.cam.updateProjectionMatrix()}
 var pr=v.E.b?prog((v.clock%CYC)/CYC):0,B=upd(v,pr),lb=v.E.lb||(v.E.b?["Start","End"]:["Position"]);
 if(v.zones.length){var hk=.3+.3*Math.sin(t/300);v.hot.emissiveIntensity=hk;v.hotF.emissiveIntensity=hk}
 var c=v.cam,az=v.az;c.position.set(v.tx+v.dist*Math.sin(az)*Math.cos(v.ev),v.ty+v.dist*Math.sin(v.ev),v.tz+v.dist*Math.cos(az)*Math.cos(v.ev));c.lookAt(v.tx,v.ty,v.tz);v.ren.render(v.sc,c);
 if(!v.shown){v.shown=1;var hh=v.box.getBoundingClientRect().height;if(hh>40){v.el.firstChild.style.display="none";st(v.el,"3D ready.")}else throw new Error("3D box has no height ("+Math.round(hh)+")")}}
function kill(v,why){if(v.dead)return;v.dead=1;st(v.el,"3D closed: "+(why||"?"));try{v.ui.remove();v.el.firstChild.style.display="";v.ren.dispose();v.ren.forceContextLoss()}catch(e){}if(v.el._v===v)v.el._v=null}
function loop(t){raf=0;V=V.filter(function(v){if(v.dead)return false;if(!v.el.isConnected){v.orph=v.orph||t;if(t-v.orph>3000){kill(v,"removed from page for over 3 seconds");return false}return true}v.orph=0;return true});V.forEach(function(v){if(!v.el.isConnected)return;try{draw3(v,t)}catch(e){console.error("WF3D error:",e);v.el._bad=1;kill(v,"error");oops(v.el,e)}});if(V.length)raf=requestAnimationFrame(loop)}
function adopt(el){var id=el.dataset.id,o=null;for(var i=0;i<V.length;i++){var w=V[i];if(!w.dead&&!w.el.isConnected&&w.el.dataset.id===id&&(w.el.dataset.sex||"")===(el.dataset.sex||"")){o=w;break}}if(!o)return false;o.el._v=null;o.el=el;el._v=o;o.orph=0;o.dirty=1;el.firstChild.style.display="none";el.insertBefore(o.ui,el.querySelector(".wf3-st"));st(el,"3D ready.");return true}
function startV(el){if(el._v||el._bad)return;if(adopt(el))return;st(el,"3D loading...");loadThree(function(){if(!el.isConnected||el._v||!el._vis)return;try{el._v=mk(el);V.push(el._v);if(!raf)raf=requestAnimationFrame(loop)}catch(e){el._bad=1;el._v=null;oops(el,e)}},function(){el._bad=1;oops(el,'could not load Three.js: offline or blocked')})}
var io=window.IntersectionObserver?new IntersectionObserver(function(es){es.forEach(function(e){e.target._vis=e.isIntersecting;if(e.isIntersecting)startV(e.target);else if(e.target._v){var el=e.target;setTimeout(function(){if(!el._vis&&el._v&&el._v.el===el)kill(el._v,"scrolled out of view")},800)}})},{threshold:.01}):null;
function watch(n){if(!io||n.nodeType!==1)return;var l=[].slice.call(n.querySelectorAll(".wf3"));if(n.matches&&n.matches(".wf3"))l.push(n);l.forEach(function(x){if(!x._w){x._w=1;if(x.offsetParent!==null&&adopt(x))x._vis=true;io.observe(x)}})}
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(watch);m.removedNodes.forEach(function(n){if(n.nodeType===1&&((n.matches&&n.matches('.wf3'))||(n.querySelector&&n.querySelector('.wf3'))))console.warn('WF3D: a figure was removed from the page by an edit to:',m.target)})})}).observe(document.documentElement,{childList:true,subtree:true});
if(document.body)watch(document.body);
window.fig2d=fig;window.fig=fig3;window.__wf3=fig3;window.WF_POSES=T;

})();
