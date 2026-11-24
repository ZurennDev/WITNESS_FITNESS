/* Witness Fitness coach: animated mannequin + voice timer + accurate exercise minutes.
   Load AFTER the main inline script (put the tag next to wf-more.js) and REPLACE the wf-figures.js tag. */
(function(){
"use strict";
var r=Math.PI/180,FL=160,L={t:48,th:36,sh:36,ua:24,fa:22};
/* pose = [torso, nearArmUpper, nearArmFore, farArmUpper, farArmFore, nearThigh, nearShin, farThigh, farShin, lift]
   angles in degrees from "straight down", positive = toward the front (right). v:1 = front view, a = anchor x, d = seconds per cycle */
var Z=[0,4,8,-4,4,0,0,0,0,0];
var A={
ready:{d:3,f:[Z,[0,7,14,-7,8,0,0,0,0,0]]},
breath:{d:5,f:[[0,4,8,-4,4,0,0,0,0,0],[0,40,60,-40,-60,0,0,0,0,0]],v:1},
squat:{d:3.2,f:[[0,8,15,-8,15,0,0,0,0,0],[35,85,85,85,85,80,-15,80,-15,0]]},
lunge:{d:3.2,f:[[0,4,8,-4,4,0,0,0,0,0],[4,4,8,-4,4,85,5,-12,-70,0]]},
pushup:{d:2.6,a:45,f:[[78,0,0,0,0,-78,-78,-78,-78,0],[84,-55,40,-55,40,-84,-84,-84,-84,0]]},
plank:{d:4,a:45,f:[[76,0,90,0,90,-76,-76,-76,-76,0],[77,0,90,0,90,-77,-77,-77,-77,0]]},
jacks:{d:1.2,v:1,f:[[0,5,5,-5,-5,3,3,-3,-3,0],[0,150,160,-150,-160,22,22,-22,-22,6]]},
knees:{d:1.4,f:[[0,-40,50,40,-50,85,0,0,0,0],[0,40,-50,-40,50,0,0,85,0,0]]},
curl:{d:2.6,f:[[0,0,0,0,0,0,0,0,0,0],[0,0,150,0,0,0,0,0,0,0]]},
press:{d:2.8,f:[[0,70,170,-70,-170,0,0,0,0,0],[0,175,178,-175,-178,0,0,0,0,0]],v:1},
hinge:{d:3.2,f:[[0,4,8,-4,4,0,0,0,0,0],[72,5,5,-5,5,14,-10,14,-10,0]]},
bridge:{d:2.8,a:150,f:[[-90,-88,-88,-88,-88,130,40,130,40,0],[-110,-85,-85,-85,-85,100,10,100,10,0]]},
legfwd:{d:3.5,f:[[0,4,8,-4,4,0,0,0,0,0],[0,20,30,-20,-30,0,0,65,-20,0]]},
legside:{d:3,v:1,f:[[0,6,6,-6,-6,0,0,0,0,0],[0,6,6,-6,-6,0,0,-32,-32,0]]},
arms:{d:2.4,v:1,f:[[0,80,80,-80,-80,0,0,0,0,0],[0,100,100,-100,-100,0,0,0,0,0]]},
punch:{d:1.2,f:[[0,85,88,20,130,0,0,0,0,0],[0,20,130,85,88,0,0,0,0,0]]}};
var M={squat:"squat",chairsq:"squat",burpee:"squat",lunge:"lunge",pushup:"pushup",plank:"plank",jacks:"jacks",knees:"knees",march:"knees",smarch:"knees",sprints:"knees",punch:"punch",deadlift:"hinge",row:"hinge",hams:"hinge",child:"hinge",press:"press",curl:"curl",bridge:"bridge",stand1:"legfwd",quad:"legfwd",legext:"legfwd",sideleg:"legside",arms:"arms",twist:"arms",breath:"breath"};
var W={curl:1,press:1,deadlift:1,row:1};
function pose(a,t){var f=a.f,n=f.length,s=((t/a.d)%1)*n,i=Math.floor(s),k=(1-Math.cos(Math.PI*(s-i)))/2,P=f[i],Q=f[(i+1)%n];return P.map(function(x,j){return x+(Q[j]-x)*k})}
function lim(o,u,l,a1,a2,sc){var e=[o[0]+Math.sin(a1*r)*u*sc,o[1]+Math.cos(a1*r)*u*sc];return[o,e,[e[0]+Math.sin(a2*r)*l*sc,e[1]+Math.cos(a2*r)*l*sc]]}
function frame(p,a,g,w,u){
 var f=g==="f",sc=f?.94:1,tr=p[0]*r,tx=Math.sin(tr),ty=-Math.cos(tr),nk=[tx*L.t*sc,ty*L.t*sc];
 var so=a.v?[14,-14]:[2,-2],ho=a.v?[7,-7]:[1,-1];
 var S=[[nk[0]+so[0],nk[1]],[nk[0]+so[1],nk[1]]],H=[[ho[0],0],[ho[1],0]];
 var arm=[0,1].map(function(i){return lim(S[i],L.ua,L.fa,p[1+2*i],p[2+2*i],sc)}),leg=[0,1].map(function(i){return lim(H[i],L.th,L.sh,p[5+2*i],p[6+2*i],sc)});
 var ft=leg.map(function(l,i){return[l[2][0]+(a.v?(i?-8:8):10),l[2][1]+1]});
 var my=Math.max(leg[0][2][1],leg[1][2][1],ft[0][1],ft[1][1],arm[0][2][1],arm[1][2][1],nk[1]+12);
 var dy=FL-my-p[9]-3,dx=(a.a||110)-leg[0][2][0];
 var X=function(c){return[c[0]+dx,c[1]+dy]},F=function(n){return n.toFixed(1)},k=a.v?1.35:1,fm=f?.88:1;
 var SK="url(#"+u+"s)",DK="url(#"+u+"d)",CL="url(#"+u+"c)",HD="url(#"+u+"h)",SH="url(#"+u+"o)";
 function T(a1,r1,b,r2,fill,ex){a1=X(a1);b=X(b);var vx=b[0]-a1[0],vy=b[1]-a1[1],l=Math.hypot(vx,vy)||1,nx=-vy/l,ny=vx/l;return'<path d="M'+F(a1[0]+nx*r1)+' '+F(a1[1]+ny*r1)+'L'+F(b[0]+nx*r2)+' '+F(b[1]+ny*r2)+'A'+r2+' '+r2+' 0 0 0 '+F(b[0]-nx*r2)+' '+F(b[1]-ny*r2)+'L'+F(a1[0]-nx*r1)+' '+F(a1[1]-ny*r1)+'A'+r1+' '+r1+' 0 0 0 '+F(a1[0]+nx*r1)+' '+F(a1[1]+ny*r1)+'Z" fill="'+fill+'"'+(ex||"")+'/>'}
 function C(c,rr,fill){c=X(c);return'<circle cx="'+F(c[0])+'" cy="'+F(c[1])+'" r="'+rr+'" fill="'+fill+'"/>'}
 function mid(u1,v1,t){return[u1[0]+(v1[0]-u1[0])*t,u1[1]+(v1[1]-u1[1])*t]}
 var hr=(f?10:9)*k*.95,wr=(f?6.2:7.4)*k*.95,cr=(f?8.2:10)*k*.95;
 function rad(t){return t<.5?hr+(wr-hr)*t/.5:wr+(cr-wr)*(t-.5)/.5}
 var hip=[0,0],P=function(t){return mid(hip,nk,t)},TR=' stroke="#9be22b" stroke-width="1.1"';
 function cloth(t1,t2,ex){return T(P(t1),rad(t1)+.9,P(t2),rad(t2)+.9,CL,ex)}
 function limb(l,far,isLeg){var sk=far?DK:SK,o="";
  if(isLeg){o+=T(l[0],8.4*fm,l[1],5.6*fm,sk)+T(l[1],5.6*fm,l[2],3.6*fm,sk)+C(l[1],5.4*fm,sk);o+=T(l[0],9.3*fm,mid(l[0],l[1],.5),7.1*fm,CL,f?TR:"")}
  else{o+=T(l[0],5.4*fm,l[1],4.3*fm,sk)+T(l[1],4.3*fm,l[2],3.1*fm,sk)+C(l[1],4.2*fm,sk)+C(l[2],3.5*fm,sk)}return o}
 function dumb(e){var d=X(e[2]),an=Math.atan2(e[2][0]-e[1][0],e[2][1]-e[1][1]),px=Math.cos(an)*7,py=-Math.sin(an)*7;function ln(m,wd,c){return'<path d="M'+F(d[0]-px*m)+' '+F(d[1]-py*m)+'L'+F(d[0]+px*m)+' '+F(d[1]+py*m)+'" stroke="'+c+'" stroke-width="'+wd+'" stroke-linecap="round"/>'}return ln(1,5.5,"#1d1f24")+ln(.55,2.2,"#9aa")}
 function shoe(l,i,far){return T(l[2],4.2,ft[i],3.2,far?"#8a8f98":"#e6e9ee")}
 var o=limb(arm[1],1,0)+limb(leg[1],1,1)+shoe(leg[1],1,1);
 o+=T(hip,hr,P(.5),wr,SK)+T(P(.5),wr,nk,cr,SK);
 o+=C(S[1],cr*(a.v?.62:.5),DK);
 o+=cloth(0,.17);
 if(f){o+=cloth(.58,.97,TR)}else o+=cloth(.2,.97);
 o+=T(nk,3.6,[nk[0]+tx*12,nk[1]+ty*12],3.3,SK);
 var hd=X([nk[0]+tx*15,nk[1]+ty*15]);
 o+='<ellipse cx="'+F(hd[0])+'" cy="'+F(hd[1])+'" rx="'+(f?6.8:7.6)+'" ry="'+(f?9:9.8)+'" fill="'+HD+'" transform="rotate('+p[0].toFixed(0)+' '+F(hd[0])+' '+F(hd[1])+')"/>';
 o+=C(S[0],cr*(a.v?.62:.5),SK);
 o+=limb(leg[0],0,1)+shoe(leg[0],0,0)+limb(arm[0],0,0);
 if(w)o+=dumb(arm[1])+dumb(arm[0]);
 return o}
function sex(){try{return P().sex==="Female"?"f":"m"}catch(e){return"m"}}
var UC=0;
window.fig=function(id,name){var u="m"+(++UC),f=sex()==="f";return'<div class="wfmw"><svg class="wfm" viewBox="0 0 220 170" data-ex="'+id+'" data-g="'+(f?"f":"m")+'" data-u="'+u+'" role="img" aria-label="Animated '+(f?"female":"male")+' mannequin showing '+String(name||"").replace(/"/g,"")+'"><defs><linearGradient id="'+u+'s" x1="0" x2="1"><stop offset="0" stop-color="#dfe3ea"/><stop offset=".5" stop-color="#a3a9b3"/><stop offset="1" stop-color="#6c717b"/></linearGradient><linearGradient id="'+u+'d" x1="0" x2="1"><stop offset="0" stop-color="#9ba0aa"/><stop offset="1" stop-color="#555a64"/></linearGradient><linearGradient id="'+u+'c" x1="0" x2="1"><stop offset="0" stop-color="#4a4d56"/><stop offset=".6" stop-color="#23252b"/><stop offset="1" stop-color="#0f1013"/></linearGradient><radialGradient id="'+u+'h" cx=".35" cy=".28" r=".85"><stop offset="0" stop-color="#f1f3f7"/><stop offset=".55" stop-color="#a9afb9"/><stop offset="1" stop-color="#6a6f79"/></radialGradient></defs><ellipse cx="110" cy="'+(FL+1)+'" rx="62" ry="4" fill="#000" opacity=".18"/><line x1="10" y1="'+(FL+1)+'" x2="210" y2="'+(FL+1)+'" stroke="currentColor" opacity=".2" stroke-width="1.5"/><g class="mg"></g></svg></div>'};
var st=document.createElement("style");st.textContent=".wfmw{background:#e9ecf3;border-radius:14px;margin:8px 0;color:#444}@media(prefers-color-scheme:dark){.wfmw{background:#262b47;color:#aab}}.wfmw svg{display:block;width:100%;max-height:230px}@media(prefers-reduced-motion:reduce){.wfm{opacity:.9}}";document.head.appendChild(st);
function loop(now){var els=document.querySelectorAll("svg.wfm");for(var i=0;i<els.length;i++){var e=els[i];if(!e.getClientRects().length)continue;var id=e.dataset.ex,a=A[M[id]||"ready"],p=pose(a,now/1000),gr=e.querySelector(".mg");if(gr)gr.innerHTML=frame(p,a,e.dataset.g,W[id],e.dataset.u)}requestAnimationFrame(loop)}
requestAnimationFrame(loop);
/* ---------- voice ---------- */
var VOICE=true;try{VOICE=localStorage.getItem("wf-voice")!=="off"}catch(e){}
var VO=null,VL=[],AUD=null,CLIP={};
function pick(){try{VL=speechSynthesis.getVoices().filter(function(x){return/^en/i.test(x.lang)});var sc=function(x){var n=x.name,t=0;if(/natural|neural|online/i.test(n))t+=10;if(/google/i.test(n))t+=6;if(/aria|jenny|samantha|sonia|libby|zira|siri|ava|allison|serena|karen|moira|davis|guy/i.test(n))t+=4;if(/en-(US|GB|AU|PH)/i.test(x.lang))t+=2;if(!x.localService)t+=1;return t};VL.sort(function(a,b){return sc(b)-sc(a)});var sv="";try{sv=localStorage.getItem("wf-vname")||""}catch(e){}VO=VL.filter(function(x){return x.name===sv})[0]||VL[0]||null}catch(e){}}
try{pick();speechSynthesis.onvoiceschanged=pick}catch(e){}
function tts(t){try{if(!window.speechSynthesis)return;var u=new SpeechSynthesisUtterance(t);if(VO){u.voice=VO;u.lang=VO.lang}else u.lang="en-US";u.rate=.92;u.pitch=1;speechSynthesis.speak(u)}catch(e){}}
function say(t,flush,key){if(!VOICE)return;try{if(flush){speechSynthesis.cancel();if(AUD){AUD.pause();AUD=null}}}catch(e){}
 if(key&&CLIP[key]!==false){var a=new Audio("audio/"+key+".mp3"),d=0,fb=function(){if(!d){d=1;CLIP[key]=false;tts(t)}};a.onerror=fb;var pr=a.play();if(pr&&pr.then)pr.then(function(){AUD=a;CLIP[key]=true}).catch(fb);return}
 tts(t)}
function nextVoice(){if(!VL.length)return;var i=(VL.indexOf(VO)+1)%VL.length;VO=VL[i];try{localStorage.setItem("wf-vname",VO.name)}catch(e){}say("Hi, I am "+VO.name.replace(/Microsoft |Google /,"").split(" ")[0]+". Let's work out.",true)}
/* ---------- accurate durations from the listed amount ---------- */
var REP=3;/* seconds per rep */
function dur(amt){var s=String(amt||"").toLowerCase(),m;
 if(m=/(\d+)\s*sec\s*fast,\s*(\d+)\s*sec\s*walk/.exec(s))return{work:+m[1],rest:+m[2],sp:"for "+m[1]+" seconds, then walk for "+m[2]};
 var side=/per (side|leg|arm)/.test(s),x=1;if(side)x=2;
 if(m=/(\d+)\s*min/.exec(s))return{work:m[1]*60*x,sp:"for "+m[1]+(m[1]==1?" minute":" minutes"),half:side};
 if(m=/(\d+)\s*sec/.exec(s))return{work:m[1]*x,sp:"for "+m[1]+" seconds"+(side?" on each side":""),half:side};
 if(m=/(\d+)\s*(reps|steps)/.exec(s))return{work:m[1]*REP*x,sp:m[1]+" "+m[2]+(side?" on each side":""),half:side};
 return{work:40,sp:"for 40 seconds"}}
function build(label){var steps=[];workout(label).forEach(function(e){var d=dur(e.amt);for(var s=1;s<=e.sets;s++)steps.push({id:e.id,n:e.n,set:s,sets:e.sets,work:d.work,rest:d.rest!=null?d.rest:30,sp:d.sp,half:d.half,how:e.steps[0]||""})});if(steps.length)steps[steps.length-1].rest=0;return steps}
function intro(s){say(s.set===1?"Next exercise: "+s.n+". "+s.sets+" sets, "+s.sp+". "+s.how:"Set "+s.set+" of "+s.sets+". "+s.n+". Go!",true,"ex-"+s.id)}
window.tStart=function(list,w,rr,label){var steps=build(label);if(!steps.length){toast("No exercises fit you in this group.");return}beep(1);wlOn();T={list:steps,i:0,ph:"Work",end:Date.now()+steps[0].work*1000,run:true,label:label,w:0,r:0,tot:steps.reduce(function(a,s){return a+s.work+s.rest},0),t0:Date.now()};intro(steps[0]);clearInterval(TI);TI=setInterval(window.tick,250)};
window.tick=function(){if(!T||!T.run)return;var now=Date.now(),s=T.list[T.i],left=Math.ceil((T.end-now)/1000);
 if(now>=T.end){try{navigator.vibrate&&navigator.vibrate([300,100,300])}catch(e){}beep(T.ph==="Work"?1100:1600);T.said=0;T.half=0;
  if(T.ph==="Work"){if(s.rest>0){T.ph="Rest";T.end=now+s.rest*1000;var n=T.list[T.i+1];say("Rest for "+s.rest+" seconds. Next: "+(n?n.n:"")+".",true,"rest")}
   else{var m=Math.max(1,Math.round(T.tot/60));logDone(T.label,m,"Exercise Timer");clearInterval(TI);T=null;if(sst==="idle")wlOff();say("Workout complete. Great job!",true,"done");toast("Workout complete and logged.");if(tab==="workouts")workouts();return}}
  else{T.i++;T.ph="Work";T.end=now+T.list[T.i].work*1000;intro(T.list[T.i])}}
 else if(T.ph==="Work"){if(s.half&&!T.half&&left<=Math.ceil(s.work/2)){T.half=1;say("Switch sides.",0,"switch")}else if(left<=3&&T.said!==left&&left>0){T.said=left;say(String(left),0,"n"+left)}}
 else if(left===5&&T.said!==5){T.said=5;say("Get ready.",0,"ready")}
 paintT()};
window.paintT=function(){if(!T||!$("#tph"))return;var s=T.list[T.i],rest=T.ph==="Rest",nx=rest?T.list[T.i+1]||s:s,l=Math.max(0,Math.ceil(((T.run?T.end:Date.now()+T.rem)-Date.now())/1000));
 $("#tph").textContent=T.ph+" · "+s.n+" · Set "+s.set+"/"+s.sets;$("#tbg").textContent=Math.floor(l/60)+":"+String(l%60).padStart(2,"0");
 $("#tex").textContent=rest?"Next: "+nx.n+" ("+nx.sp+")":s.sp.charAt(0).toUpperCase()+s.sp.slice(1)+". "+s.how;
 var c=$("#wfc");if(!c){c=document.createElement("div");c.id="wfc";$("#tex").after(c);var b=document.createElement("button");b.className="btn g s";b.id="wfv";b.style.marginTop="8px";b.onclick=function(){VOICE=!VOICE;try{localStorage.setItem("wf-voice",VOICE?"on":"off")}catch(e){}if(!VOICE&&window.speechSynthesis)speechSynthesis.cancel();b.textContent="Voice: "+(VOICE?"On":"Off")};b.textContent="Voice: "+(VOICE?"On":"Off");c.after(b);var b2=document.createElement("button");b2.className="btn g s";b2.style.cssText="margin:8px 0 0 8px";b2.textContent="Change voice";b2.onclick=nextVoice;b.after(b2)}
 if(c.dataset.ex!==nx.id){c.dataset.ex=nx.id;c.innerHTML=window.fig(nx.id,nx.n)}};
window.WFM={frame:frame,A:A,pose:pose,fig:window.fig};
})();
