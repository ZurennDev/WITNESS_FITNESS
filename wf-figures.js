/* wf-figures.js v2: Witness Fitness demonstrator mannequin.
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
legext:{props:[["chair"]],a:p({th:90,sk:0}),b:p({th:90,sk:90,fo:180}),k:["knee"],n:"Straighten the knee until the leg is level, pause, lower slowly."}
};
window.fig=fig;window.WF_POSES=T;
})();
