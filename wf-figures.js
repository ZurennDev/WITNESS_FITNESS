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
 var fb=front?8:0,lb=front?5:0,m=front?-1:1;
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
 var bodies=poses.map(function(q){return place(build(q,fr),pin,px)}),R=bodies[bodies.length-1],lb=E.lb||(poses.length>1?["Start","End"]:["Position"]),ks=E.k||[],svg="";
 bodies.forEach(function(B,i){
  svg+='<g transform="translate('+i*PW+' 0)"><rect x="3" y="3" width="'+(PW-6)+'" height="'+(PH-6)+'" rx="12" fill="var(--bg)" stroke="var(--line)"/>'+lin(10,FL,PW-10,FL,2)+
  '<text x="12" y="19" font-size="11" font-weight="700" fill="var(--mute)">'+lb[i]+'</text>'+(E.props||[]).map(function(s){return prop(s,B,R)}).join("")+draw(B,ks)+'</g>'});
 var cap=ks.map(function(k){return JT[k][3]+" "+bodies.map(function(B){return ang(B,k)}).join("° → ")+"°"}).join(" · "),
  nm=String(name||"").replace(/[&<>"]/g,"");
 return'<div class="wf-fig" role="img" aria-label="'+nm+': '+lb.join(" and ")+' positions"><svg viewBox="0 0 '+PW*bodies.length+' '+PH+'" style="width:100%;max-width:'+bodies.length*210+'px;height:auto;display:block;margin:10px auto 4px" aria-hidden="true">'+svg+'</svg>'+
  (cap?'<p class="sub" style="text-align:center;margin:2px 0"><b style="color:var(--acc)">'+cap+'</b></p>':"")+(E.n?'<p class="sub" style="text-align:center;margin:2px 0 8px">'+E.n+'</p>':"")+'</div>'}
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
var ZO={hn:.08,k:.08,a:.08,t:.08,hf:-.08,k2:-.08,a2:-.08,t2:-.08,sn:.17,e:.17,w:.17,sf:-.17,e2:-.17,w2:-.17,hip:0,S:0,hd:0};
var ALLK=["hip","S","e","w","e2","w2","k","a","t","k2","a2","t2","hd","hn","hf","sn","sf"];
function eff(q,fr){var m=fr?-1:1,o=Object.assign({},q);[["u2","ua"],["f2","fa"],["h2","th"],["s2","sk"],["o2","fo"]].forEach(function(x){if(o[x[0]]===undefined)o[x[0]]=m*q[x[1]]});return o}
function mix(a,b,u){var o={};for(var k in a)o[k]=a[k]+(b[k]-a[k])*u;return o}
function ss(x){return x*x*(3-2*x)}
function prog(u){return u<.15?0:u<.5?ss((u-.15)/.35):u<.65?1:1-ss((u-.65)/.35)}
function loadThree(ok,bad){if(window.THREE)return ok();if(tl===-1)return bad();TQ.push([ok,bad]);if(tl)return;tl=1;
 var s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
 s.onload=function(){TQ.forEach(function(x){x[0]()});TQ=[]};s.onerror=function(){tl=-1;TQ.forEach(function(x){x[1]()});TQ=[]};document.head.appendChild(s)}
function oops(el,e){try{console.error('WF3D error:',e);var u=el.querySelector('.wf3-ui');if(u)u.remove();var f=el.firstChild;if(f&&f.style)f.style.display='';var m=document.createElement('p');m.className='sub';m.style.cssText='color:var(--hot);text-align:center';m.textContent='3D view unavailable ('+((e&&e.message)||e)+'). Showing the flat view.';el.appendChild(m)}catch(x){}}
var ALIAS=[[/sumo/i,"sumo"],[/step.?up/i,"stepup"]];
function fig3(id,name){var rid=T[id]?id:null;if(!rid)for(var i=0;i<ALIAS.length;i++)if(ALIAS[i][0].test(id+" "+(name||""))){rid=ALIAS[i][1];break}
 if(!rid){(window.WF_MISSING=window.WF_MISSING||{})[id]=name;return""}id=rid;var h=fig(id,name);if(!h)return"";var nm=String(name||"").replace(/[&<>"]/g,"");
 return'<div class="wf3" data-id="'+id+'" role="group" aria-label="3D demonstration: '+nm+'. Drag to rotate.">'+'<div class="wf3-2d">'+h+'</div></div>'}
function setBone(m,a,b){var d=new THREE.Vector3().subVectors(b,a),L=d.length()||1e-4;m.position.copy(a).addScaledVector(d,.5);m.scale.set(1,L,1);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize())}
function upd(v,pr){
 var q=mix(v.qa,v.qb,pr),B=place(build(q,v.fr),v.pin,v.px),P=v.P,fr=v.fr,px=v.px;
 ALLK.forEach(function(k){var p=B[k];if(fr)P[k].set(0,(FL-p[1])*S3,(p[0]-px)*S3);else P[k].set((p[0]-px)*S3,(FL-p[1])*S3,ZO[k])});
 if(fr){P.t.copy(P.a).add(new THREE.Vector3(.13,-.02,0));P.t2.copy(P.a2).add(new THREE.Vector3(.13,-.02,0))}
 var tr=q.t*D,c=[(B.hip[0]+B.S[0])/2+q.sp*Math.cos(tr),(B.hip[1]+B.S[1])/2+q.sp*Math.sin(tr)];
 for(var i=0;i<=6;i++){var u=i/6,x=(1-u)*(1-u)*B.hip[0]+2*u*(1-u)*c[0]+u*u*B.S[0],y=(1-u)*(1-u)*B.hip[1]+2*u*(1-u)*c[1]+u*u*B.S[1];
  if(fr)v.TP[i].set(0,(FL-y)*S3,(x-px)*S3);else v.TP[i].set((x-px)*S3,(FL-y)*S3,0);v.ts[i].position.copy(v.TP[i]);if(i<6)setBone(v.tm[i],v.TP[i],v.TP[i+1])}
 v.bones.forEach(function(b){setBone(b.m,P[b.a],P[b.b])});v.joints.forEach(function(j){j.m.position.copy(P[j.k])});
 v.n3.set(fr?1:Math.cos(tr),fr?0:-Math.sin(tr),0);if(v.sup)v.n3.multiplyScalar(-1);
 v.zones.forEach(function(z){if(z.kind==="bone")setBone(z.m,P[z.a],P[z.b]);else if(z.kind==="pt")z.m.position.copy(P[z.a]).addScaledVector(v.n3,z.b||0);else z.m.position.copy(v.TP[z.a]).addScaledVector(v.n3,.075*z.b)});
 var ha=(q.t+q.hd)*D;v.face.position.set(P.hd.x+Math.cos(ha)*.095,P.hd.y-Math.sin(ha)*.095,P.hd.z);
 v.bar&&v.bar.position.set(P.w.x,P.w.y,0);
 v.shadow.position.set(P.hip.x,.004,fr?P.hip.z:0);return B}
function mk(el){
 var E=T[el.dataset.id],fr=!!E.front,v={el:el,E:E,fr:fr,pin:E.pin||"a",px:E.px||60,P:{},TP:[],tm:[],ts:[],bones:[],joints:[],clock:0,last:0,paused:false,dirty:1};
 v.qa=eff(E.a,fr);v.qb=eff(E.b||E.a,fr);
 var ren=new THREE.WebGLRenderer({antialias:true,alpha:true});ren.setClearColor(0x000000,0);ren.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
 var sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(35,1.4,.1,50);
 sc.add(new THREE.HemisphereLight(0xffffff,0x8a94b8,.95));var dl=new THREE.DirectionalLight(0xffffff,.8);dl.position.set(2,4,3);sc.add(dl);
 var M=function(c){return new THREE.MeshStandardMaterial({color:c,roughness:.5,metalness:.05})},mb=M(0x2ba4a0),mf=M(0x1f7f7c),ma=M(0xff8a4c),mh=M(0xf3efe7),mp=M(0x8f97b8);
 ALLK.forEach(function(k){v.P[k]=new THREE.Vector3()});
 function sph(r,m){var s=new THREE.Mesh(new THREE.SphereGeometry(r,16,12),m);sc.add(s);return s}
 function cyl(r1,r2,m){var s=new THREE.Mesh(new THREE.CylinderGeometry(r2,r1,1,14,1),m);sc.add(s);return s}
 for(var i=0;i<=6;i++){v.TP.push(new THREE.Vector3());var r=.092+.02*(i/6);v.ts.push(sph(r,mb));if(i<6)v.tm.push(cyl(r,.092+.02*((i+1)/6),mb))}
 [["hn","k",.068,.052,mb],["k","a",.052,.04,mb],["a","t",.04,.032,mb],["sn","e",.045,.038,mb],["e","w",.038,.03,mb],
  ["hf","k2",.068,.052,mf],["k2","a2",.052,.04,mf],["a2","t2",.04,.032,mf],["sf","e2",.045,.038,mf],["e2","w2",.038,.03,mf],
  ["hf","hn",.07,.07,mb],["sf","sn",.05,.05,mb],["S","hd",.045,.045,mb]].forEach(function(b){v.bones.push({a:b[0],b:b[1],m:cyl(b[2],b[3],b[4])})});
 [["hn",.07,mb],["hf",.07,mf],["sn",.055,mb],["sf",.055,mf],["k",.054,ma],["k2",.054,ma],["e",.046,ma],["e2",.046,ma],["a",.04,mb],["a2",.04,mf],["t",.03,mb],["t2",.03,mf],["w",.044,mb],["w2",.044,mf],["hd",.105,mh]].forEach(function(j){v.joints.push({k:j[0],m:sph(j[1],j[2])})});
 v.face=sph(.03,ma);
 v.gm=new THREE.MeshBasicMaterial({color:0xffb020,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false});v.zones=[];v.sup=!!SUP[el.dataset.id];v.n3=new THREE.Vector3(1,0,0);
 function gs(r,kind,a,b){var m=new THREE.Mesh(new THREE.SphereGeometry(r,16,12),v.gm);sc.add(m);v.zones.push({m:m,kind:kind,a:a,b:b})}
 function gc(r1,r2,a,b){var m=new THREE.Mesh(new THREE.CylinderGeometry(r2,r1,1,14,1),v.gm);sc.add(m);v.zones.push({m:m,kind:"bone",a:a,b:b})}
 (ZN[el.dataset.id]||[]).forEach(function(z){
  if(z==="thigh"){gc(.088,.072,"hn","k");gc(.088,.072,"hf","k2")}
  if(z==="calf"){gc(.068,.054,"k","a");gc(.068,.054,"k2","a2")}
  if(z==="arm"){gc(.06,.052,"sn","e");gc(.06,.052,"sf","e2")}
  if(z==="shoulder"){gs(.082,"pt","sn",0);gs(.082,"pt","sf",0)}
  if(z==="glute"){gs(.115,"pt","hn",-.06);gs(.115,"pt","hf",-.06)}
  if(z==="core"){gs(.1,"tor",2,1);gs(.1,"tor",3,1)}
  if(z==="chest"){gs(.11,"tor",5,1)}
  if(z==="back"){gs(.11,"tor",4,-1)}});
 var cv=document.createElement("canvas");cv.width=cv.height=64;var g=cv.getContext("2d"),gr=g.createRadialGradient(32,32,2,32,32,32);gr.addColorStop(0,"rgba(0,0,0,.4)");gr.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=gr;g.fillRect(0,0,64,64);
 v.shadow=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.1),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthWrite:false}));v.shadow.rotation.x=-Math.PI/2;sc.add(v.shadow);
 var fl=new THREE.Mesh(new THREE.BoxGeometry(3.4,.04,1.8),new THREE.MeshStandardMaterial({color:0x262b48,roughness:.9}));fl.rotation.x=-Math.PI/2;sc.add(fl);
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
 v.az0=fr?1.15:.5;v.el0=.2;v.az=v.az0;v.el=v.el0;
 /* UI */
 var ui=document.createElement("div"),box_=document.createElement("div"),hud=document.createElement("div"),cap=document.createElement("p"),bt=document.createElement("div"),nt=document.createElement("p"),pz=document.createElement("button"),rs=document.createElement("button");
 box_.style.cssText="position:relative;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:radial-gradient(circle at 50% 25%,#2b3358,#10132a);touch-action:pan-y;cursor:grab;margin:10px 0 4px";
 ren.domElement.style.cssText="display:block;width:100%;height:auto";hud.style.cssText="position:absolute;left:12px;top:9px;font:700 12px system-ui,sans-serif;color:#b9c3e6;pointer-events:none";
 cap.className="sub";cap.style.cssText="text-align:center;margin:2px 0;font-weight:700;color:var(--acc);min-height:20px";bt.className="chips";bt.style.justifyContent="center";
 pz.className=rs.className="chip";pz.textContent="Pause";rs.textContent="Reset view";nt.className="sub";nt.style.cssText="text-align:center;margin:6px 0 8px";nt.textContent=(E.n||"")+" Drag to rotate.";
 pz.onclick=function(){v.paused=!v.paused;pz.textContent=v.paused?"Play":"Pause"};rs.onclick=function(){v.az=v.az0;v.el=v.el0;v.touched=0;v.dirty=1};
 box_.appendChild(ren.domElement);box_.appendChild(hud);bt.appendChild(pz);bt.appendChild(rs);ui.appendChild(box_);ui.appendChild(cap);ui.appendChild(bt);ui.appendChild(nt);
 ui.className="wf3-ui";el.firstChild.style.display="none";el.appendChild(ui);
 var dr=null;box_.onpointerdown=function(e){v.touched=1;dr=[e.clientX,e.clientY];try{box_.setPointerCapture(e.pointerId)}catch(x){}box_.style.cursor="grabbing"};
 box_.onpointermove=function(e){if(!dr)return;v.az-=(e.clientX-dr[0])*.012;v.el=Math.max(-.05,Math.min(1.1,v.el+(e.clientY-dr[1])*.008));dr=[e.clientX,e.clientY];v.dirty=1};
 box_.onpointerup=box_.onpointercancel=function(){dr=null;box_.style.cursor="grab"};
 v.ren=ren;v.sc=sc;v.cam=cam;v.ui=ui;v.box=box_;v.hud=hud;v.cap=cap;v.cw=0;return v}
function draw3(v,t){
 var dt=v.last?Math.min(100,t-v.last):0;v.last=t;var anim=!!v.E.b&&!v.paused;if(anim){v.clock+=dt}
 if(!anim&&!v.dirty&&v.drawn&&v.touched&&!(v.zones&&v.zones.length))return;v.drawn=1;v.dirty=0;
 var w=v.box.clientWidth||320;if(w!==v.cw){v.cw=w;var h=Math.round(w*.72);v.ren.setSize(w,h,false);v.cam.aspect=w/h;v.cam.updateProjectionMatrix()}
 var pr=v.E.b?prog((v.clock%CYC)/CYC):0,B=upd(v,pr),lb=v.E.lb||(v.E.b?["Start","End"]:["Position"]);
 v.hud.textContent=lb[pr>.5?1:0]+(v.E.b?"  ·  Rep "+(Math.floor(v.clock/CYC)+1):"");v.gm.opacity=.35+.3*Math.sin(t/260);var ks=v.E.k||[],tx=ks.map(function(k){return JT[k][3]+" "+ang(B,k)+"°"}).join(" · ");if(v.cap.textContent!==tx)v.cap.textContent=tx;
 var c=v.cam,az=v.az+(v.touched?0:.3*Math.sin(t/2600));c.position.set(v.tx+v.dist*Math.sin(az)*Math.cos(v.el),v.ty+v.dist*Math.sin(v.el),v.tz+v.dist*Math.cos(az)*Math.cos(v.el));c.lookAt(v.tx,v.ty,v.tz);v.ren.render(v.sc,c)}
function kill(v,why){if(v.dead)return;v.dead=1;try{console.info("WF3D closed:",why||"?")}catch(e){}try{v.ui.remove();v.el.firstChild.style.display="";v.ren.dispose();v.ren.forceContextLoss()}catch(e){}if(v.el._v===v)v.el._v=null}
function loop(t){raf=0;V=V.filter(function(v){if(!v.el.isConnected||v.dead){kill(v,"removed from page (the app redrew this screen)");return false}return true});V.forEach(function(v){try{draw3(v,t)}catch(e){console.error("WF3D error:",e);v.el._bad=1;kill(v,"error");oops(v.el,e)}});if(V.length)raf=requestAnimationFrame(loop)}
function startV(el){if(el._v||el._bad)return;loadThree(function(){if(!el.isConnected||el._v||!el._vis)return;try{el._v=mk(el);V.push(el._v);if(!raf)raf=requestAnimationFrame(loop)}catch(e){el._bad=1;el._v=null;oops(el,e)}},function(){el._bad=1;oops(el,'could not load Three.js: offline or blocked')})}
var io=window.IntersectionObserver?new IntersectionObserver(function(es){es.forEach(function(e){e.target._vis=e.isIntersecting;if(e.isIntersecting)startV(e.target);else if(e.target._v){var el=e.target;setTimeout(function(){if(!el._vis&&el._v)kill(el._v,"scrolled out of view")},800)}})},{threshold:.01}):null;
function watch(n){if(!io||n.nodeType!==1)return;var l=[].slice.call(n.querySelectorAll(".wf3"));if(n.matches&&n.matches(".wf3"))l.push(n);l.forEach(function(x){if(!x._w){x._w=1;io.observe(x)}})}
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(watch)})}).observe(document.documentElement,{childList:true,subtree:true});
if(document.body)watch(document.body);
window.fig2d=fig;window.fig=fig3;window.__wf3=fig3;window.WF_POSES=T;

})();
