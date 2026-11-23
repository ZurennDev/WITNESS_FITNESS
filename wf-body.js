/* wf-body.js - realistic anatomical mannequin for the exercise guide.
   Load AFTER wf-figures.js. It replaces fig(id,name) and shows each exercise
   as 1-3 poses (start / end) on a shaded human body. Orange = muscles working. */
(function(){
const R=Math.PI/180,sn=a=>Math.sin(a*R),cs=a=>Math.cos(a*R),dn=a=>[sn(a),cs(a)],up=a=>[sn(a),-cs(a)];
const ad=(p,v,k)=>[p[0]+v[0]*k,p[1]+v[1]*k],q=p=>p[0].toFixed(1)+","+p[1].toFixed(1),mix=(a,b,s)=>[a[0]+(b[0]-a[0])*s,a[1]+(b[1]-a[1])*s],nr=u=>[-u[1],u[0]];
const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const C={n:["#F4CDAA","#E1B08A","#B6825E"],f:["#D9A883","#C4916D","#97674B"],ln:"#8A5738",hair:"#3B2B23"},ACC="fill:var(--acc);opacity:.62";
let gid=0;
/* smooth closed curve through points */
function sm(p){const n=p.length;let d="M"+q(p[0]);for(let i=0;i<n;i++){const a=p[(i+n-1)%n],b=p[i],c=p[(i+1)%n],e=p[(i+2)%n];d+="C"+q([b[0]+(c[0]-a[0])/6,b[1]+(c[1]-a[1])/6])+" "+q([c[0]-(e[0]-b[0])/6,c[1]-(e[1]-b[1])/6])+" "+q(c)}return d+"Z"}
/* cylinder-style shading across a body part */
function grad(M,n,w,P){const id="wb"+(++gid),s=(n[0]*-.5+n[1]*-.8)>0?1:-1,a=ad(M,n,s*w),b=ad(M,n,-s*w);
 return[id,`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"><stop offset="0" stop-color="${P[0]}"/><stop offset=".45" stop-color="${P[1]}"/><stop offset="1" stop-color="${P[2]}"/></linearGradient>`]}
const paint=(d,gd,id,hi)=>gd+`<path d="${d}" fill="url(#${id})" stroke="${C.ln}" stroke-width=".7" stroke-linejoin="round"/>`+(hi?`<path d="${d}" style="${ACC}"/>`:"");
/* tapered limb segment with a muscle belly. k<0 bulges the +side opposite, see poses */
function seg(A,B,w,k,far,hi,pm){const v=[B[0]-A[0],B[1]-A[1]],l=Math.hypot(v[0],v[1])||1,u=[v[0]/l,v[1]/l],n=nr(u),M=ad(A,v,pm||.4),[id,gd]=grad(M,n,w[1],far?C.f:C.n);
 return paint(sm([ad(A,n,w[0]),ad(M,n,w[1]*(1+k)),ad(B,n,w[2]),ad(B,u,w[2]),ad(B,n,-w[2]),ad(M,n,-w[1]*(1-k)),ad(A,n,-w[0]),ad(A,u,-w[0])]),gd,id,hi)}
const jt=(p,r,far,hi)=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r}" fill="${(far?C.f:C.n)[1]}"/>`+(hi?`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r}" style="${ACC}"/>`:"");
const hand=(h,fa,far)=>`<ellipse cx="${h[0].toFixed(1)}" cy="${h[1].toFixed(1)}" rx="3.7" ry="5.4" transform="rotate(${-fa} ${h[0].toFixed(1)} ${h[1].toFixed(1)})" fill="${(far?C.f:C.n)[1]}" stroke="${C.ln}" stroke-width=".6"/>`;
function foot(A,ft,far,it){const ud=dn(ft),ns=nr(ud),P=[ad(ad(A,ud,-5),ns,-2),ad(ad(A,ud,-5.5),ns,3.5),ad(ad(A,ud,3),ns,5),ad(ad(A,ud,12),ns,5),ad(ad(A,ud,18.5),ns,3.8),ad(ad(A,ud,19.5),ns,1.5),ad(ad(A,ud,14),ns,-1.5),ad(ad(A,ud,5),ns,-4.5),ad(ad(A,ud,-1),ns,-5)];
 P.forEach(p=>it.push([p[0],p[1],0]));const [id,gd]=grad(ad(A,ud,6),ns,5,far?C.f:C.n);return paint(sm(P),gd,id,0)}
function headSvg(HC,ang,far){const id="wb"+(++gid),L=[[-9,0],[-8,-7.5],[-2,-11.5],[6,-9.5],[9.2,-3],[11.6,2.2],[8.6,4],[8.4,9],[3,11.2],[-4,9.5],[-8.5,4.5]],Hr=[[-9.4,1],[-9,-8],[-2,-12.2],[6,-10.4],[9.4,-4],[3,-6],[-3,-4.5],[-7,2]];
 return`<radialGradient id="${id}" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="${C.n[0]}"/><stop offset=".6" stop-color="${C.n[1]}"/><stop offset="1" stop-color="${C.n[2]}"/></radialGradient><g transform="translate(${q(HC)}) rotate(${ang.toFixed(1)})"><path d="${sm(L)}" fill="url(#${id})" stroke="${C.ln}" stroke-width=".7"/><path d="${sm(Hr)}" fill="${C.hair}"/><ellipse cx="-1.5" cy="2.5" rx="2" ry="3" fill="${C.n[2]}" opacity=".7"/></g>`}
/* ---------- SIDE VIEW ---------- */
function side(o){o={t:0,ua:0,fa:4,th:0,sh:0,...o};
 const F=o.F||{},t1=o.t-(o.sb||0)/2,t2=o.t+(o.sb||0)/2,hl=new Set((o.hl||"").split(" ")),H=[0,0],it=[],out={},bl=o.belly||0;
 const M=ad(H,up(t1),31),S=ad(M,up(t2),31),hd=o.hd||0,ha=t2+hd,HC=ad(S,up(ha),21);
 it.push([0,0,16],[S[0],S[1],10],[HC[0],HC[1],11]);
 const arm=far=>{const v=k=>far&&F[k]!==undefined?F[k]:o[k],d=far?4:0,s0=[S[0]+d,S[1]],E=ad(s0,dn(v("ua")),30),W=ad(E,dn(v("fa")),27),h=ad(W,dn(v("fa")),5);it.push([E[0],E[1],5],[h[0],h[1],5]);if(!far)out.hand=h;
  return jt(s0,7.2,far,hl.has("sh"))+seg(s0,E,[6.6,6.9,5.3],-.08,far,hl.has("ar"))+jt(E,5.3,far,0)+seg(E,W,[5.3,5.7,3.7],.1,far,hl.has("fo"))+hand(h,v("fa"),far)};
 const leg=far=>{const v=k=>far&&F[k]!==undefined?F[k]:o[k],d=far?4:0,h0=[d,0],K=ad(h0,dn(v("th")),44),A=ad(K,dn(v("sh")),42),ft=v("ft")!==undefined?v("ft"):90;it.push([K[0],K[1],7],[A[0],A[1],0]);if(far)out.Kf=K;
  return seg(h0,K,[12.5,12.8,8],-.1,far,hl.has("q"),.35)+jt(K,7.6,far,0)+seg(K,A,[7.9,8.5,4.6],.2,far,hl.has("c"),.3)+foot(A,ft,far,it)};
 const pos=s=>s<=.5?mix(H,M,s*2):mix(M,S,s*2-1),tg=s=>s<=.5?up(t1):up(t2);
 const ST=[[0,12,14],[.18,12+bl*.4,16],[.4,10.5+bl,11],[.62,15.5,12.5],[.84,16.5,13.5],[1,9,11]];
 const tD=sm(ST.map(([s,f,b])=>ad(pos(s),nr(tg(s)),-b)).concat([ad(S,up(t2),8)],ST.map(([s,f,b])=>ad(pos(s),nr(tg(s)),f)).reverse(),[ad(H,up(t1),-9)]));
 const nm=nr(up((t1+t2)/2)),[tid,tgd]=grad(M,nm,15,C.n),cid="wb"+(++gid);
 const el=(s,off,rx,ry)=>{const u=tg(s),p=ad(pos(s),nr(u),off),a=Math.atan2(u[0],-u[1])/R;return`<ellipse cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" rx="${rx}" ry="${ry}" transform="rotate(${a.toFixed(1)} ${p[0].toFixed(1)} ${p[1].toFixed(1)})" style="${ACC}"/>`};
 const zones=(hl.has("ch")?el(.72,3,15,11):"")+(hl.has("co")?el(.38,2,13,10):"")+(hl.has("ba")?el(.6,-6,10,13):"");
 const gl=ad(H,nr(up(t1)),-3),blob=`<circle cx="${gl[0].toFixed(1)}" cy="${gl[1].toFixed(1)}" r="13.5" fill="${C.n[1]}" stroke="${C.ln}" stroke-width=".7"/>`+(hl.has("g")?`<circle cx="${gl[0].toFixed(1)}" cy="${gl[1].toFixed(1)}" r="13.5" style="${ACC}"/>`:"");
 const tor=blob+`<clipPath id="${cid}"><path d="${tD}"/></clipPath>`+paint(tD,tgd,tid,0)+`<g clip-path="url(#${cid})">${zones}</g>`;
 const head=seg(S,ad(S,up(t2+hd/2),13),[5.8,5.4,5.2],0,false,false,.5)+headSvg(HC,ha,false);
 const svg=arm(1)+leg(1)+tor+head+leg(0)+arm(0);
 return{svg,it,H,S,hand:out.hand,Kf:out.Kf}}
/* ---------- FRONT VIEW ---------- */
function front(o){o={ua:0,fa:4,th:0,sh:0,...o};const sw=o.sw||1,sx=o.sx||0,hl=new Set((o.hl||"").split(" ")),it=[],LT=o.seat?22:44,info={};
 const pick=(R,a,b)=>R?o[a]:(o[b]!==undefined?o[b]:-o[a]);
 const one=s=>{const R_=s>0,ua=pick(R_,"ua","uaL"),fa=pick(R_,"fa","faL"),th=pick(R_,"th","thL"),sh=pick(R_,"sh","shL"),S=[s*17*sw+sx,-58],Hp=[s*8,0],E=ad(S,dn(ua),30),W=ad(E,dn(fa),27),h=ad(W,dn(fa),5),K=ad(Hp,dn(th),LT),A=ad(K,dn(sh),42);
  it.push([E[0],E[1],5],[h[0],h[1],5],[K[0],K[1],7],[A[0],A[1]+5,0],[S[0],S[1],8]);info[R_?"hand":"handL"]=h;
  const fx=A[0]+s*2,fy=A[1]+4;
  return{arm:jt(S,7.4,false,hl.has("sh"))+seg(S,E,[6.6,6.9,5.3],0,false,hl.has("ar"))+jt(E,5.3,false,0)+seg(E,W,[5.3,5.7,3.7],0,false,hl.has("fo"))+hand(h,fa,false),
   leg:seg(Hp,K,[11.5,12,8],0,false,hl.has("q"),.35)+jt(K,7.6,false,0)+seg(K,A,[8,8.6,4.8],0,false,hl.has("c"),.3)+`<ellipse cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" rx="6.4" ry="4.6" transform="rotate(${s*10} ${fx.toFixed(1)} ${fy.toFixed(1)})" fill="${C.n[1]}" stroke="${C.ln}" stroke-width=".7"/>`}};
 const r=one(1),l=one(-1),half=[[-6,-65],[-19,-60],[-17,-45],[-12.5,-24],[-12,-8],[-15,3],[-4,8]],tp=half.concat(half.slice().reverse().map(p=>[-p[0],p[1]])).map(p=>p[1]<-15?[p[0]*sw+sx*(p[1]<-50?1:.5),p[1]]:p);
 const tD=sm(tp),[tid,tgd]=grad([sx*.6,-30],[1,0],17,C.n),cid="wb"+(++gid);
 const zn=(hl.has("co")?`<ellipse cx="${(sx*.5).toFixed(1)}" cy="-20" rx="11" ry="12" style="${ACC}"/>`:"")+(hl.has("ch")?`<ellipse cx="${sx}" cy="-48" rx="15" ry="9" style="${ACC}"/>`:"")+(hl.has("g")?`<circle cx="-14" cy="0" r="7" style="${ACC}"/><circle cx="14" cy="0" r="7" style="${ACC}"/>`:"");
 const tor=`<clipPath id="${cid}"><path d="${tD}"/></clipPath>`+paint(tD,tgd,tid,0)+`<g clip-path="url(#${cid})">${zn}</g>`;
 const hx=sx*1.2,hid="wb"+(++gid),head=seg([sx*.8,-62],[sx,-73],[5.8,5.4,5.2],0,false,false,.5)+`<radialGradient id="${hid}" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="${C.n[0]}"/><stop offset=".6" stop-color="${C.n[1]}"/><stop offset="1" stop-color="${C.n[2]}"/></radialGradient><g transform="translate(${hx.toFixed(1)},-85)"><ellipse rx="9.4" ry="11.5" fill="url(#${hid})" stroke="${C.ln}" stroke-width=".7"/><path d="M-9.4,-3 Q-9.6,-13 0,-13 Q9.6,-13 9.4,-3 Q6,-8.5 0,-8.5 Q-6,-8.5 -9.4,-3Z" fill="${C.hair}"/></g>`;
 it.push([0,0,16],[hx,-85,11],[0,2,14]);
 return{svg:r.leg+l.leg+tor+head+l.arm+r.arm,it,H:[0,0],hand:info.hand,handL:info.handL}}
/* ---------- PROPS ---------- */
const WOOD='fill="#9A7650" stroke="#6E5236" stroke-width=".6"',STEEL='fill="#59627D" stroke="#3B4259" stroke-width=".6"';
function props(o,r,gy){let b="",f="";const cx=o.cx||0;
 if(o.prop==="chair"){const tp=gy-33;b=`<g ${WOOD}><rect x="${cx-24}" y="${tp}" width="44" height="5" rx="1.5"/><rect x="${cx-22}" y="${tp+5}" width="3.2" height="${gy-tp-5}"/><rect x="${cx+15}" y="${tp+5}" width="3.2" height="${gy-tp-5}"/><rect x="${cx-24}" y="${tp-46}" width="4" height="46" rx="1.5"/></g>`}
 if(o.prop==="fchair"){b=`<g ${WOOD}><rect x="-32" y="12" width="64" height="5" rx="1.5"/><rect x="-29" y="17" width="3.2" height="${gy-17}"/><rect x="26" y="17" width="3.2" height="${gy-17}"/></g>`}
 if(o.prop==="bench"){const tp=r.H[1]+15;b=`<g ${STEEL}><rect x="-98" y="${tp}" width="116" height="7" rx="2"/><rect x="-90" y="${tp+7}" width="5" height="${gy-tp-7}"/><rect x="8" y="${tp+7}" width="5" height="${gy-tp-7}"/></g>`}
 if(o.prop==="rowbench"){const tp=r.Kf[1]+8;b=`<g ${STEEL}><rect x="-36" y="${tp}" width="116" height="7" rx="2"/><rect x="-28" y="${tp+7}" width="5" height="${gy-tp-7}"/><rect x="68" y="${tp+7}" width="5" height="${gy-tp-7}"/></g>`}
 if(o.prop==="wall"||o.prop==="wallL"){const x=o.prop==="wall"?r.hand[0]+5:r.handL[0]-13;b=`<rect x="${x}" y="${gy-175}" width="8" height="175" fill="#8E97B2" opacity=".5"/><line x1="${o.prop==="wall"?x:x+8}" x2="${o.prop==="wall"?x:x+8}" y1="${gy-175}" y2="${gy}" stroke="#6C7590" stroke-width="1.2"/>`}
 if(o.hold&&r.hand){const h=r.hand,big=o.hold==="bar";f=`<circle cx="${h[0].toFixed(1)}" cy="${h[1].toFixed(1)}" r="${big?11:6.5}" fill="#2E3347" stroke="#14172A" stroke-width=".8"/><circle cx="${h[0].toFixed(1)}" cy="${h[1].toFixed(1)}" r="${big?3.4:2.4}" fill="#8C93AB"/><circle cx="${h[0].toFixed(1)}" cy="${h[1].toFixed(1)}" r="3.4" fill="${C.n[1]}"/>`}
 return[b,f]}
/* ---------- POSES (angles in degrees; 0 = straight down for limbs, straight up for the torso) ---------- */
const S0={ua:0,fa:4,th:0,sh:0},SEAT={th:88,sh:0,prop:"chair"};
const PO={
squat:[{...S0,ua:85,fa:90,lb:"Start"},{t:35,hd:-15,ua:85,fa:90,th:80,sh:-25,hl:"q g",lb:"Bottom"}],
pushup:[{t:75,hd:15,ua:0,fa:0,th:-75,sh:-75,ft:15,hl:"ch ar sh co",lb:"Top"},{t:80,hd:15,ua:-50,fa:25,th:-80,sh:-80,ft:10,hl:"ch ar sh co",lb:"Bottom"}],
plank:[{t:86,hd:10,ua:0,fa:90,th:-86,sh:-86,ft:4,hl:"co sh",lb:"Hold"}],
lunge:[{...S0,lb:"Start"},{th:75,sh:-5,F:{th:-5,sh:-95,ft:-5},hl:"q g",lb:"Down"}],
burpee:[{t:65,hd:-25,ua:5,fa:5,th:95,sh:-30,hl:"q g",lb:"Squat"},{t:75,hd:15,ua:0,fa:0,th:-75,sh:-75,ft:15,hl:"co ch",lb:"Plank"},{t:8,ua:165,fa:170,th:0,sh:0,air:16,hl:"q c",lb:"Jump"}],
jacks:[{v:"f",ua:4,fa:4,th:3,sh:3,lb:"Start"},{v:"f",ua:150,fa:155,th:24,sh:24,air:10,hl:"q sh ar",lb:"Jump"}],
knees:[{t:5,ua:-35,fa:55,th:95,sh:-5,F:{ua:40,fa:130,th:0,sh:0},hl:"q",lb:"Drive up"},{t:5,ua:40,fa:130,th:0,sh:0,F:{ua:-35,fa:55,th:95,sh:-5},hl:"q",lb:"Switch"}],
march:[{ua:-25,fa:60,th:75,sh:-10,F:{ua:25,fa:100,th:0,sh:0},hl:"q",lb:"Lift"},{ua:25,fa:100,th:0,sh:0,F:{ua:-25,fa:60,th:75,sh:-10},hl:"q",lb:"Switch"}],
sprints:[{t:18,ua:-45,fa:45,th:80,sh:-15,F:{ua:50,fa:140,th:-30,sh:-45,ft:45},hl:"q g c",lb:"Drive"},{t:18,ua:50,fa:140,th:-30,sh:-45,ft:45,F:{ua:-45,fa:45,th:80,sh:-15,ft:90},hl:"q g c",lb:"Switch"}],
punch:[{...SEAT,ua:20,fa:160,F:{ua:25,fa:165},lb:"Guard"},{...SEAT,ua:88,fa:90,F:{ua:25,fa:165},hl:"sh ar ch",lb:"Punch"}],
deadlift:[{t:62,hd:-30,ua:-18,fa:-18,th:75,sh:-12,hold:"bar",hl:"g q ba",lb:"Start"},{ua:2,fa:2,hold:"bar",hl:"g q ba",lb:"Stand tall"}],
bench:[{t:-90,th:85,sh:-10,ua:180,fa:180,prop:"bench",hold:"bar",hl:"ch ar sh",lb:"Start"},{t:-90,th:85,sh:-10,ua:20,fa:180,prop:"bench",hold:"bar",hl:"ch ar sh",lb:"Chest"}],
row:[{t:75,hd:-35,th:10,sh:0,ua:0,fa:0,F:{th:20,sh:-95,ft:-90,ua:0,fa:0},prop:"rowbench",hold:"db",hl:"ba ar",lb:"Start"},{t:75,hd:-35,th:10,sh:0,ua:-100,fa:0,F:{th:20,sh:-95,ft:-90,ua:0,fa:0},prop:"rowbench",hold:"db",hl:"ba ar",lb:"Pull"}],
press:[{...SEAT,ua:15,fa:165,F:{ua:5,fa:10},hold:"db",lb:"Start"},{...SEAT,ua:176,fa:180,F:{ua:5,fa:10},hold:"db",hl:"sh ar",lb:"Press up"}],
curl:[{...S0,hold:"db",lb:"Down"},{ua:5,fa:150,hold:"db",hl:"ar",lb:"Curl up"}],
hams:[{th:82,sh:84,ft:165,ua:10,fa:40,lb:"Sit tall"},{t:68,hd:20,th:82,sh:84,ft:165,ua:35,fa:72,hl:"q",lb:"Reach"}],
quad:[{...S0,lb:"Start"},{t:3,ua:-4,fa:-6,th:10,sh:-165,ft:-60,F:{th:0,sh:0,ua:-4,fa:-6},hl:"q",lb:"Hold"}],
catcow:[{t:84,sb:20,hd:25,ua:0,fa:0,th:0,sh:-90,ft:-90,hl:"ba",lb:"Cat"},{t:84,sb:-20,hd:-28,ua:0,fa:0,th:0,sh:-90,ft:-90,hl:"co",lb:"Cow"}],
child:[{t:0,ua:0,fa:4,th:85,sh:-92,ft:-90,lb:"Kneel"},{t:100,ua:88,fa:90,th:82,sh:-92,ft:-90,hl:"ba",lb:"Fold forward"}],
chairsq:[{ua:85,fa:90,prop:"chair",cx:-30,lb:"Start"},{t:15,ua:85,fa:90,th:88,sh:-5,prop:"chair",hl:"q g",lb:"Sit down"}],
wallpush:[{t:15,hd:-10,ua:88,fa:88,th:-15,sh:-15,prop:"wall",lb:"Start"},{t:28,hd:-15,ua:20,fa:138,th:-28,sh:-28,prop:"wall",hl:"ch ar sh",lb:"Chest to wall"}],
bridge:[{t:-90,ua:80,fa:80,th:130,sh:-21,lb:"Start"},{t:-108,hd:21,ua:75,fa:75,th:108,sh:-30,hl:"g q",lb:"Lift"}],
stand1:[{ua:30,fa:35,lb:"Stand tall"},{ua:30,fa:35,th:15,sh:-35,F:{th:0,sh:0},hl:"c g",lb:"Lift"}],
heeltoe:[{ua:25,fa:35,th:8,sh:8,F:{th:-8,sh:-8},lb:"Step"},{ua:25,fa:35,th:-8,sh:-8,F:{th:8,sh:8},lb:"Switch"}],
sideleg:[{v:"f",ua:25,fa:25,uaL:-42,faL:-42,th:0,sh:0,thL:0,shL:0,prop:"wallL",lb:"Stand"},{v:"f",ua:25,fa:25,uaL:-42,faL:-42,th:34,sh:34,thL:0,shL:0,prop:"wallL",hl:"q g",lb:"Raise"}],
twist:[{v:"f",seat:1,prop:"fchair",ua:15,fa:-100,uaL:-15,faL:100,lb:"Center"},{v:"f",seat:1,prop:"fchair",sw:.5,sx:4,ua:15,fa:-125,uaL:-15,faL:125,hl:"co",lb:"Turn right"},{v:"f",seat:1,prop:"fchair",sw:.5,sx:-4,ua:15,fa:-125,uaL:-15,faL:125,hl:"co",lb:"Turn left"}],
breath:[{...SEAT,ua:-5,fa:75,belly:7,hl:"co",lb:"Inhale"},{...SEAT,ua:-5,fa:75,belly:0,lb:"Exhale"}],
smarch:[{...SEAT,lb:"Start"},{...SEAT,th:105,F:{th:88,sh:0},hl:"q",lb:"Lift"}],
arms:[{v:"f",seat:1,prop:"fchair",ua:90,fa:90,lb:"Small circles"},{v:"f",seat:1,prop:"fchair",ua:150,fa:155,hl:"sh",lb:"Large circles"}],
legext:[{...SEAT,lb:"Start"},{...SEAT,sh:88,ft:165,F:{th:88,sh:0,ft:90},hl:"q",lb:"Extend"}]};
/* ---------- BUILD ---------- */
const old=window.fig;
window.fig=function(id,name){const P=PO[id];if(!P)return old?old(id,name):"";
 const n=P.length,W=n===1?300:n===2?150:128,HH=150,g0=HH-26,R_=P.map(o=>o.v==="f"?front(o):side(o));
 R_.forEach((r,i)=>{const a=P[i].air||0,pad=P[i].prop?12:0;r.gy=Math.max(...r.it.map(p=>p[1]+p[2]));r.x0=Math.min(...r.it.map(p=>p[0]-p[2]))-pad;r.x1=Math.max(...r.it.map(p=>p[0]+p[2]))+pad;r.hh=r.gy-Math.min(...r.it.map(p=>p[1]-p[2]))+a});
 const mw=Math.max(...R_.map(r=>r.x1-r.x0)),mh=Math.max(...R_.map(r=>r.hh)),s=Math.min((W-14)/mw,(g0-10)/mh,.9);
 let b="";R_.forEach((r,i)=>{const o=P[i],tx=i*W+W/2-s*(r.x0+r.x1)/2,ty=g0-s*r.gy,[pb,pf]=props(o,r,r.gy);
  b+=`<line x1="${i*W+8}" x2="${(i+1)*W-8}" y1="${g0}" y2="${g0}" stroke="var(--line)" stroke-width="2" stroke-linecap="round"/><ellipse cx="${(i*W+W/2).toFixed(1)}" cy="${g0}" rx="${Math.min(W/2-12,(r.x1-r.x0)*s/2).toFixed(1)}" ry="2.5" fill="#000" opacity=".1"/><g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${s.toFixed(3)})">${pb}<g transform="translate(0 ${-(o.air||0)})">${r.svg}${pf}</g></g><text x="${i*W+W/2}" y="${HH-7}" text-anchor="middle" style="font:700 10.5px system-ui,sans-serif;fill:var(--mute)">${i+1}. ${esc(o.lb||"")}</text>`});
 const hi=P.some(o=>o.hl);
 return`<div style="margin:8px 0 4px"><svg viewBox="0 0 ${W*n} ${HH}" role="img" aria-label="${esc(name)}: ${esc(P.map(o=>o.lb).join(", "))}" style="width:100%;height:auto;display:block;background:var(--bg);border-radius:14px">${b}</svg>${hi?'<p class="sub" style="margin:4px 0 0;font-size:12px">Orange shows the muscles working.</p>':""}</div>`}
})();
