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
function frame(p,a,g,w){
 var f=g==="f",sc=f?.94:1,tr=p[0]*r,tx=Math.sin(tr),ty=-Math.cos(tr),nk=[tx*L.t*sc,ty*L.t*sc];
 var so=a.v?[13,-13]:[2,-2],ho=a.v?[7,-7]:[1,-1];
 var S=[[nk[0]+so[0],nk[1]],[nk[0]+so[1],nk[1]]],H=[[ho[0],0],[ho[1],0]];
 var arm=[0,1].map(function(i){return lim(S[i],L.ua,L.fa,p[1+2*i],p[2+2*i],sc)}),leg=[0,1].map(function(i){return lim(H[i],L.th,L.sh,p[5+2*i],p[6+2*i],sc)});
 var ft=leg.map(function(l,i){return[l[2][0]+(a.v?(i?-8:8):9),l[2][1]]});
 var my=Math.max(leg[0][2][1],leg[1][2][1],ft[0][1],ft[1][1],arm[0][2][1],arm[1][2][1],nk[1]+12);
 var dy=FL-my-p[9],dx=(a.a||110)-leg[0][2][0];
 var q=function(c){return(c[0]+dx).toFixed(1)+" "+(c[1]+dy).toFixed(1)};
 var skin="#8d929c",dark="#666b75",tw=f?16:20,lw=f?7.5:9,top=f?"#17191e":"#2a2c33",acc="#9be22b";
 function seg(a1,b,c,wd,col){return'<path d="M'+q(a1)+' L'+q(b)+(c?' L'+q(c):'')+'" stroke="'+col+'" stroke-width="'+wd+'" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'}
 function part(pt,k,wd,col){return seg(pt[0],pt[1],pt[2],wd,col)}
 function mid(u,v,k){return[u[0]+(v[0]-u[0])*k,u[1]+(v[1]-u[1])*k]}
 function limb(l,far,isLeg){var col=far?dark:skin,s=seg(l[0],l[1],l[2],lw,col);if(isLeg){var m=mid(l[0],l[1],.9);s+=seg(l[0],m,0,lw+3,far?"#111":top)}return s}
 function dumb(w2,e){var d=e[2],pr=[Math.cos(0),0],an=Math.atan2(e[2][0]-e[1][0],e[2][1]-e[1][1]),px=Math.cos(an)*7,py=-Math.sin(an)*7;return seg([d[0]-px,d[1]-py],[d[0]+px,d[1]+py],0,5,"#1d1f24")+seg([d[0]-px*.6,d[1]-py*.6],[d[0]+px*.6,d[1]+py*.6],0,2,"#888")}
 var hip=[0,0],o="";
 o+=limb(arm[1],1,0)+limb(leg[1],1,1)+(a.v?seg(ft[1],leg[1][2],0,4,dark):seg(leg[1][2],ft[1],0,5,dark));
 o+=seg(hip,nk,0,tw,skin);
 o+=seg(hip,mid(hip,nk,.14),0,tw+1,f?"#17191e":top);
 if(f){o+=seg(mid(hip,nk,.6),mid(hip,nk,.98),0,tw+3,acc)+seg(mid(hip,nk,.62),mid(hip,nk,.96),0,tw+1,top)}else o+=seg(mid(hip,nk,.14),mid(hip,nk,.97),0,tw+1,top);
 var hd=[nk[0]+tx*13,nk[1]+ty*13];
 o+=seg(nk,hd,0,5,skin)+'<ellipse cx="'+(hd[0]+dx).toFixed(1)+'" cy="'+(hd[1]+dy).toFixed(1)+'" rx="'+(f?7:8)+'" ry="10" fill="'+skin+'" transform="rotate('+p[0].toFixed(0)+' '+(hd[0]+dx).toFixed(1)+' '+(hd[1]+dy).toFixed(1)+')"/>';
 o+=limb(leg[0],0,1)+(a.v?seg(ft[0],leg[0][2],0,4,skin):seg(leg[0][2],ft[0],0,5,skin));
 o+=limb(arm[0],0,0);
 if(w)o+=dumb(1,arm[1])+dumb(1,arm[0]);
 return o}
function sex(){try{return P().sex==="Female"?"f":"m"}catch(e){return"m"}}
window.fig=function(id,name){var k=M[id]||"ready";return'<div class="wfmw"><svg class="wfm" viewBox="0 0 220 170" data-ex="'+id+'" data-g="'+sex()+'" role="img" aria-label="Animated '+(sex()==="f"?"female":"male")+' mannequin showing '+String(name||"").replace(/"/g,"")+'"><line x1="10" y1="'+FL+'" x2="210" y2="'+FL+'" stroke="currentColor" opacity=".25" stroke-width="2"/><g class="mg"></g></svg></div>'};
var st=document.createElement("style");st.textContent=".wfmw{background:#e9ecf3;border-radius:14px;margin:8px 0;color:#444}@media(prefers-color-scheme:dark){.wfmw{background:#262b47;color:#aab}}.wfmw svg{display:block;width:100%;max-height:230px}@media(prefers-reduced-motion:reduce){.wfm{opacity:.9}}";document.head.appendChild(st);
function loop(now){var els=document.querySelectorAll("svg.wfm");for(var i=0;i<els.length;i++){var e=els[i];if(!e.getClientRects().length)continue;var id=e.dataset.ex,a=A[M[id]||"ready"],p=pose(a,now/1000),gr=e.querySelector(".mg");if(gr)gr.innerHTML=frame(p,a,e.dataset.g,W[id])}requestAnimationFrame(loop)}
requestAnimationFrame(loop);
/* ---------- voice ---------- */
var VOICE=true;try{VOICE=localStorage.getItem("wf-voice")!=="off"}catch(e){}
function say(t,flush){try{if(!VOICE||!window.speechSynthesis)return;if(flush)speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);u.lang="en-US";u.rate=.95;speechSynthesis.speak(u)}catch(e){}}
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
function intro(s){say(s.set===1?"Next exercise: "+s.n+". "+s.sets+" sets, "+s.sp+". "+s.how:"Set "+s.set+" of "+s.sets+". "+s.n+". Go!",true)}
window.tStart=function(list,w,rr,label){var steps=build(label);if(!steps.length){toast("No exercises fit you in this group.");return}beep(1);wlOn();T={list:steps,i:0,ph:"Work",end:Date.now()+steps[0].work*1000,run:true,label:label,w:0,r:0,tot:steps.reduce(function(a,s){return a+s.work+s.rest},0),t0:Date.now()};intro(steps[0]);clearInterval(TI);TI=setInterval(window.tick,250)};
window.tick=function(){if(!T||!T.run)return;var now=Date.now(),s=T.list[T.i],left=Math.ceil((T.end-now)/1000);
 if(now>=T.end){try{navigator.vibrate&&navigator.vibrate([300,100,300])}catch(e){}beep(T.ph==="Work"?1100:1600);T.said=0;T.half=0;
  if(T.ph==="Work"){if(s.rest>0){T.ph="Rest";T.end=now+s.rest*1000;var n=T.list[T.i+1];say("Rest for "+s.rest+" seconds. Next: "+(n?n.n:"")+".",true)}
   else{var m=Math.max(1,Math.round(T.tot/60));logDone(T.label,m,"Exercise Timer");clearInterval(TI);T=null;if(sst==="idle")wlOff();say("Workout complete. Great job!",true);toast("Workout complete and logged.");if(tab==="workouts")workouts();return}}
  else{T.i++;T.ph="Work";T.end=now+T.list[T.i].work*1000;intro(T.list[T.i])}}
 else if(T.ph==="Work"){if(s.half&&!T.half&&left<=Math.ceil(s.work/2)){T.half=1;say("Switch sides.")}else if(left<=3&&T.said!==left&&left>0){T.said=left;say(String(left))}}
 else if(left===5&&T.said!==5){T.said=5;say("Get ready.")}
 paintT()};
window.paintT=function(){if(!T||!$("#tph"))return;var s=T.list[T.i],rest=T.ph==="Rest",nx=rest?T.list[T.i+1]||s:s,l=Math.max(0,Math.ceil(((T.run?T.end:Date.now()+T.rem)-Date.now())/1000));
 $("#tph").textContent=T.ph+" · "+s.n+" · Set "+s.set+"/"+s.sets;$("#tbg").textContent=Math.floor(l/60)+":"+String(l%60).padStart(2,"0");
 $("#tex").textContent=rest?"Next: "+nx.n+" ("+nx.sp+")":s.sp.charAt(0).toUpperCase()+s.sp.slice(1)+". "+s.how;
 var c=$("#wfc");if(!c){c=document.createElement("div");c.id="wfc";$("#tex").after(c);var b=document.createElement("button");b.className="btn g s";b.id="wfv";b.style.marginTop="8px";b.onclick=function(){VOICE=!VOICE;try{localStorage.setItem("wf-voice",VOICE?"on":"off")}catch(e){}if(!VOICE&&window.speechSynthesis)speechSynthesis.cancel();b.textContent="Voice: "+(VOICE?"On":"Off")};b.textContent="Voice: "+(VOICE?"On":"Off");c.after(b)}
 if(c.dataset.ex!==nx.id){c.dataset.ex=nx.id;c.innerHTML=window.fig(nx.id,nx.n)}};
})();
