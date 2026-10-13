'use strict';
const $=id=>document.getElementById(id);
const BOATS={skiff:{name:'Rusty Skiff',price:4500,pots:6,potLb:1,hull:60,fuel:60,speed:1,stab:0,color:'#b0442a',len:90,crew:2,desc:'Cheap, tiny, hates big waves.'},
 ironTitan:{name:'Iron Titan',price:120000,pots:26,potLb:2.4,hull:260,fuel:200,speed:1.1,stab:.6,color:'#444',len:200,crew:6,desc:'Huge steel crab boat. Shrugs off gales.',gr:['bering'],ph:1},
 longliner:{name:'Longliner',price:75000,pots:10,potLb:2,hull:180,fuel:170,speed:1.2,stab:.45,color:'#2a6',len:170,crew:5,desc:'Miles of hooks for halibut & cod.',gr:['gulfak'],ph:1},
 trawler:{name:'Gulf Trawler',price:90000,pots:8,potLb:2.6,hull:170,fuel:180,speed:1.15,stab:.4,color:'#a62',len:180,crew:5,desc:'Drags nets for shrimp in the Gulf.',gr:['gulfmx'],ph:1},
 seiner:{name:'Tuna Seiner',price:150000,pots:6,potLb:4,hull:220,fuel:260,speed:1.3,stab:.5,color:'#26a',len:210,crew:8,desc:'Encircles whole tuna schools with a purse seine.',gr:['tuna'],method:'pot',ph:1},
 dyscovery1:{name:'Dyscovery1',price:1500000,pots:30,potLb:2.6,hull:320,fuel:320,speed:1.25,stab:.75,color:'#fff',len:230,crew:10,desc:'Flagship research & fishing vessel. Carries a deep-sea SUBMARINE.',gr:['bering','gulfak','gulfmx','tuna'],sub:1},
 crabber:{name:'Northern Crabber',price:28000,pots:14,potLb:1.6,hull:140,fuel:120,speed:1.25,stab:.35,color:'#1d5fa8',len:150,crew:4,desc:'Steel hull, real crane, built for the Bering.'}};
const BOATSUB={winch:{n:'Longer Winch Cable',d:'Haul cages from 1,500 → 3,000 → 4,500 → 6,000 m',c:30000},chill:{n:'Chilled Tanks',d:'Rare creatures sell at full price (60% without)',c:45000}};
const WINCH=[1500,3000,4500,6000];
const SUBUPG={thrust:{n:'Thrusters',d:'+25% dive/ascent & cruise speed per level',c:30000},harpoon:{n:'Harpoon Gun',d:'+1 ammo, +range, +power per level',c:25000},drone:{n:'Drone Sub',d:'Unlock/upgrade chase drone: speed & battery',c:35000},stun:{n:'Stun Pulse',d:'Electric pulse: stronger hits, stuns bigger creatures',c:30000},basket:{n:'Pressurized Sample Tank',d:'+1 live specimen slot (start 2)',c:20000,max:5},subsonar:{n:'Rare-Signal Sonar',d:'Shows rare creatures on sub sonar',c:25000},subDepth:{n:'Sub Hull Depth Rating',d:'300 → 1,000 → 3,000 → 6,000 → 8,500 → 11,000 m (full ocean depth)',c:40000,max:5},lights:{n:'Sub Lights',d:'Wider, brighter headlight cone',c:15000},batt:{n:'Sub Battery',d:'+35% dive time',c:20000},press:{n:'Pressure Hull',d:'Less crush damage past rating',c:30000},claw:{n:'Claw Arm',d:'Better creature capture odds',c:25000},cages:{n:'More Cages per Dive',d:'+2 cages per dive, +30% catch per cage',c:18000}};
const DEPTHS=[300,1000,3000,6000,8500,11000];
const UPG={hull:{n:'Reinforced Hull',d:'+25% max hull, less wave damage',c:3000},deicer:{n:'De-icing Gear',d:'Ice builds 35% slower per level',c:2500},
 engine:{n:'Bigger Engine',d:'+20% speed, -15% fuel burn',c:3500},sonar:{n:'Better Sonar',d:'Wider, sharper hotspot view',c:2000},
 pots:{n:'Pot Capacity',d:'+3 pots per trip',c:2500},crane:{n:'Hydraulic Crane',d:'Wider haul timing zone',c:3000},tanks:{n:'Bigger Fuel Tanks',d:'+30% fuel range per level',c:3000},prov:{n:'Provision Storage',d:'+40% days at sea (food & water)',c:2500},holdU:{n:'Bigger Hold',d:'+25% hold capacity per level',c:4000},
 stab:{n:'Storm Stabilizers',d:'Less pitching, longer rogue-wave reaction',c:4000}};
const MAXL=3;
// ---- Market: research-based ex-vessel ranges (see README for sources) ----
const SPECIES=[{k:'king',n:'Red King Crab',lo:14,hi:24},{k:'snow',n:'Snow Crab (opilio)',lo:3.2,hi:6},{k:'golden',n:'Golden King Crab',lo:9,hi:15,soon:1},
 {k:'bluefin',n:'Bluefin Tuna',lo:9,hi:22,w:[150,600],str:1.6,sz:2.5,spd:210,fast:1},{k:'yellowfin',n:'Yellowfin Tuna',lo:3.5,hi:8,w:[40,180],str:1.1,sz:1.5,spd:200,fast:1},{k:'mahi',n:'Mahi-mahi',lo:3,hi:6,w:[10,45],str:.7,sz:1.2,spd:170,fast:1},
 {k:'sailfish',n:'Sailfish',lo:2,hi:4,w:[60,120],sz:3,spd:270,fast:1},{k:'marlin',n:'Blue Marlin',lo:2.5,hi:5,w:[200,800],sz:3.8,spd:240,fast:1},
 {k:'lobster',n:'American Lobster',lo:4,hi:8},{k:'acod',n:'Atlantic Cod',lo:1.5,hi:3},
 {k:'halibut',n:'Pacific Halibut',lo:5,hi:8},{k:'cod',n:'Pacific Cod',lo:.4,hi:.9},{k:'shrimp',n:'Gulf Shrimp',lo:2,hi:5},{k:'snapper',n:'Red Snapper',lo:4,hi:6.5},
 // deep-sea specials (sold each). size in meters (realistic), depth range in m
 {k:'isopod',n:'Giant Isopod',lo:5000,hi:12000,ea:1,dmin:400,sz:.4,r:1,col:'#c9b9a0'},
 {k:'coela',claw:2,stunReq:1,flees:1,n:'Coelacanth',lo:60000,hi:150000,ea:1,dmin:150,dmax:700,sz:1.8,r:.12,col:'#5a6a8a'},
 {k:'vampsq',flees:1,n:'Vampire Squid',lo:10000,hi:30000,ea:1,dmin:600,sz:.3,r:.7,col:'#8a2030',glow:'#6cf'},
 {k:'angler',n:'Glowing Anglerfish',lo:8000,hi:25000,ea:1,dmin:1000,sz:.25,r:.8,img:'angler',glow:'#bdf'},
 {k:'dragon',fights:1,n:'Abyssal Dragonfish',lo:12000,hi:35000,ea:1,dmin:1500,sz:.2,r:.6,col:'#222',glow:'#f4a'},
 {k:'gsquid',claw:2,stunReq:2,fights:1,n:'Giant Squid',lo:100000,hi:250000,ea:1,dmin:300,dmax:1200,sz:12,r:.08,img:'squid'},
 {k:'goldab',claw:1,n:'Golden Abyss King Crab',lo:40000,hi:120000,ea:1,dmin:2500,sz:1.5,r:.25,img:'goldcrab'},
 {k:'gulper',flees:1,n:'Gulper Eel',lo:9000,hi:22000,ea:1,dmin:500,dmax:3000,sz:.75,r:.6,col:'#1a1a22',glow:'#f6c'},
 {k:'barrel',n:'Barreleye Fish',lo:20000,hi:50000,ea:1,dmin:600,dmax:900,sz:.15,r:.5,col:'#9ab',glow:'#7f7'},
 {k:'dumbo',flees:1,n:'Dumbo Octopus',lo:15000,hi:35000,ea:1,dmin:1000,dmax:7000,sz:.3,r:.6,col:'#f0a090',glow:'#fdb'},
 {k:'frilled',claw:2,stunReq:1,fights:1,n:'Frilled Shark',lo:50000,hi:120000,ea:1,dmin:500,dmax:1500,sz:2,r:.15,col:'#4a4038'},
 {k:'snail',n:'Mariana Snailfish',lo:40000,hi:90000,ea:1,dmin:6000,dmax:8200,sz:.25,r:.7,col:'#f3d6d0',glow:'#fee'},
 {k:'amphi',n:'Hadal Giant Amphipod',lo:6000,hi:15000,ea:1,dmin:6000,sz:.3,r:.9,bot:1,col:'#f2efe6'},
 {k:'seacuc',n:'Deep Sea Cucumber',lo:3000,hi:9000,ea:1,dmin:1000,sz:.2,r:.9,bot:1,col:'#c46a7a'},
 {k:'xeno',n:'Xenophyophore',lo:25000,hi:60000,ea:1,dmin:2000,sz:.15,r:.6,bot:1,col:'#d8cba0'},
 {k:'ghostoc',claw:3,stunReq:1,flees:1,n:'Ghost Octopus',lo:15000,hi:40000,ea:1,dmin:4000,sz:.1,r:.3,col:'#eef',glow:'#fff'}];
const SP=k=>SPECIES.find(s=>s.k===k);
// Pluggable fishing grounds: each has a method (pot|rod; longline/trawl planned) and a species mix.
const GROUNDS={bering:{n:'Bering Sea',method:'pot',mix:[['king',.8],['snow',.2]],wx:[0,1,2,3,4,5],sky:210},
 gulfak:{n:'Gulf of Alaska',method:'longline',mix:[['halibut',.55],['cod',.45]],wx:[0,1,2,3,4,5],sky:205},gulfmx:{n:'Gulf of Mexico',method:'trawl',mix:[['shrimp',.8],['snapper',.2]],wx:[0,1,2,4,5],sky:190,fuelX:1.1},
 natl:{n:'North Atlantic',method:'pot',mix:[['lobster',.75],['acod',.25]],wx:[0,1,2,3,4,5],sky:200},
 mariana:{n:'Mariana Trench Dive (sub)',method:'pot',mix:[['golden',.7],['king',.3]],wx:[0,1],sky:215,sub:1},abyss:{n:'Deep-Sea Trench (sub)',method:'pot',mix:[['golden',.7],['king',.3]],wx:[0,1,2],sky:215,sub:1},
 tuna:{n:'Pacific Tuna Grounds',method:'rod',mix:[['mahi',.5],['yellowfin',.38],['bluefin',.12]],wx:[0,1,2,4,5],sky:195,fuelX:1.3}};
const METHODS={pot:{drop:'DROP POT',haul:'HAUL'},rod:{drop:'CAST LINE',haul:'REEL'},longline:{drop:'SET LINE',haul:'HAUL LINE'},trawl:{drop:'DROP NET',haul:'HAUL NET'}};
function pickSp(mix){let r=Math.random();for(const [k,p] of mix){if((r-=p)<0)return k}return mix[0][0]}
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0)/4294967296}
function dayKey(off=0){const d=new Date();d.setDate(d.getDate()+off);return d.toISOString().slice(0,10)}
function basePrice(sp,off=0){let v=0;for(let i=0;i<4;i++){v+=(hash(sp.k+dayKey(off-i))*2-1)*[.45,.25,.18,.12][i]}const t=(v+1)/2;return sp.lo+(sp.hi-sp.lo)*Math.min(1,Math.max(0,t))}
function todayPrice(sp){const m=S.mkt.date===dayKey()?S.mkt[sp.k]||0:0;return Math.max(sp.lo*.8,basePrice(sp,0)*(1+m))*(S.cotd===sp.k&&S.daily===dayKey(0)?1.3:1)}
// ---- save ----
const DEF={money:6000,boat:null,owned:[],upg:{hull:0,deicer:0,engine:0,sonar:0,pots:0,crane:0,stab:0,tanks:0,prov:0,holdU:0,subDepth:0,lights:0,harpoon:0,drone:0,stun:0,basket:0,winch:0,chill:0,subsonar:0,batt:0,press:0,claw:0,cages:0},trips:0,mkt:{date:''}};
const SAVEV=3;const DEEP={mariana:10935,bering:3500,gulfak:4000,natl:3000,gulfmx:2000,tuna:5000,abyss:6000};
function sdep(x){const g=GDEPTH[GK]||120,D=DEEP[GK]||3000;x=Math.max(0,x);if(GK==='mariana')return Math.round(1500+9435*Math.min(1,Math.pow(x/3700,1.15))-(x>3600?0:60*Math.abs(Math.sin(x*.012))));if(GK==='abyss')return Math.round(250+Math.pow(x/4000,1.3)*5750+80*Math.sin(x*.01)+40*Math.sin(x*.033));
 const shelf=12+Math.pow(Math.min(x,2900)/2900,1.25)*g*1.6+Math.sin(x*.01)*g*.05;if(x<2900)return Math.round(shelf);const k=Math.min(1,(x-2900)/1100);return Math.round(shelf+(D-shelf)*(k*k*(3-2*k)))}
function bedYf(x,uw,bmax){const mx=Math.log(1+(DEEP[GK]||3000));return uw+28+Math.min(1,Math.log(1+sdep(x))/mx)*(bmax-uw-28)}const SPDS=[.5,1,2,3,5];const clone=o=>JSON.parse(JSON.stringify(o));
let S=load();function load(){let d=clone(DEF);try{const o=JSON.parse(localStorage.bs_save||'{}');if(o&&typeof o==='object'){Object.assign(d,o);d.upg=Object.assign(clone(DEF.upg),o.upg||{});d.mkt=o.mkt&&typeof o.mkt==='object'?o.mkt:{date:''};
 if(!Array.isArray(d.owned))d.owned=[];d.owned=d.owned.filter(k=>BOATS[k]);if(d.boat&&!BOATS[d.boat])d.boat=null;if(d.test){d.boat=d.prevBoat&&BOATS[d.prevBoat]?d.prevBoat:null;d.test=0}
 if(typeof d.money!=='number'||isNaN(d.money))d.money=DEF.money;if(!Array.isArray(d.orders))d.orders=[];d.v=SAVEV}}catch(e){d=clone(DEF)}return d}
function save(){try{localStorage.bs_save=JSON.stringify(S)}catch(e){}}
function mktAdj(k,d){if(S.mkt.date!==dayKey())S.mkt={date:dayKey()};S.mkt[k]=Math.max(-.2,Math.min(.25,(S.mkt[k]||0)+d))}
// ---- audio ----
let AC,noiseG,windG,noiseF;
let BUS,LPF,AM={};
function audio(){if(AC)return;try{AC=new (window.AudioContext||window.webkitAudioContext)();const b=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;AM.nb=b;
 BUS=AC.createGain();BUS.gain.value=S.mute?0:(S.vol??.7);LPF=AC.createBiquadFilter();LPF.type='lowpass';LPF.frequency.value=18000;BUS.connect(LPF).connect(AC.destination);
 const mk=(f,q,type='bandpass')=>{const s=AC.createBufferSource();s.buffer=b;s.loop=true;const fl=AC.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=AC.createGain();g.gain.value=0;s.connect(fl).connect(g).connect(BUS);s.start();return [g,fl]};
 [noiseG,noiseF]=mk(400,.6);[windG,AM.windF]=mk(900,6);[AM.rainG]=mk(5000,.5,'highpass');[AM.crashG,AM.crashF]=mk(250,.4,'lowpass');[AM.uwG,AM.uwF]=mk(120,.7,'lowpass');
 const osc=(type,f,v)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.value=0;o.connect(g);o.start();return {o,g}};
 // diesel: 2 detuned saws through lowpass + amplitude "chug" LFO
 AM.e1=osc('sawtooth',42);AM.e2=osc('sawtooth',43.3);AM.eF=AC.createBiquadFilter();AM.eF.type='lowpass';AM.eF.frequency.value=260;AM.eG=AC.createGain();AM.eG.gain.value=0;
 AM.e1.o.connect(AM.eF);AM.e2.o.connect(AM.eF);AM.e1.g.disconnect();AM.eF.connect(AM.eG).connect(BUS);
 AM.sub=osc('sine',220);AM.sub.g.connect(BUS);AM.drone=osc('sawtooth',700);const df=AC.createBiquadFilter();df.type='bandpass';df.frequency.value=1200;AM.drone.g.connect(df).connect(BUS);AM.siren=osc('square',700);AM.siren.g.connect(BUS)}catch(e){}}
function setVol(){if(BUS)BUS.gain.value=S.mute?0:(S.vol??.7);save()}
let pingT=0,creakT=2;
function audioTick(dt){if(!AC||!AM.eG)return;const t=AC.currentTime,g=G,Z=v=>Math.max(0,v);
 if(!g){[noiseG,windG,AM.rainG,AM.crashG,AM.uwG,AM.eG,AM.sub.g,AM.drone.g,AM.siren.g].forEach(n=>n.gain.setTargetAtTime(0,t,.2));LPF.frequency.setTargetAtTime(18000,t,.2);return}
 const sub=!!g.sub,Wt=WEATHER[g.w],thr=Math.abs(g.vx||0)/130;
 LPF.frequency.setTargetAtTime(sub?650:18000,t,.3);
 // engine hum pitch with throttle
 const ef=38+thr*34;AM.e1.o.frequency.setTargetAtTime(ef,t,.4);AM.e2.o.frequency.setTargetAtTime(ef*1.031,t,.4);AM.eF.frequency.setTargetAtTime(200+thr*500,t,.4);AM.eG.gain.setTargetAtTime(sub?0:.05+thr*.09+.012*Math.sin(t*ef*.25),t,.08);
 noiseG.gain.setTargetAtTime(sub?0:.03+g.amp/300,t,.3);noiseF.frequency.setTargetAtTime(250+Math.sin(t*.7)*120,t,.3);
 windG.gain.setTargetAtTime(sub?0:Wt.w*.07,t,.4);AM.windF.frequency.setTargetAtTime(600+Wt.w*500+Math.sin(t*1.3)*300*Wt.w,t,.2);
 AM.rainG.gain.setTargetAtTime(sub?0:[0,0,.05,.03,.08,.12][g.w],t,.5);
 const crash=Z(Math.sin(g.t*1.4))**6*g.amp/40;AM.crashG.gain.setTargetAtTime(sub?0:crash*.18,t,.1);
 AM.uwG.gain.setTargetAtTime(sub?.12:0,t,.4);
 const sv=sub?Math.hypot(JOY.x||0,JOY.y||0)+(g.sub.asc?1:0):0;AM.sub.o.frequency.setTargetAtTime(160+sv*140,t,.2);AM.sub.g.gain.setTargetAtTime(sub?.015+sv*.04:0,t,.2);
 AM.drone.g.gain.setTargetAtTime(sub&&g.sub.drone?.025:0,t,.1);if(sub&&g.sub.drone)AM.drone.o.frequency.setTargetAtTime(650+Math.hypot(g.sub.drone.vx,g.sub.drone.vy)*1.2,t,.1);
 const rog=g.rogue&&!g.rogue.done;AM.siren.g.gain.setTargetAtTime(rog?.05:0,t,.05);if(rog)AM.siren.o.frequency.setValueAtTime(Math.floor(t*3)%2?620:880,t);
 pingT-=dt;if(pingT<=0){pingT=sub?2.6:6;if(sub||g.t>1){tone(1480,1.6,'sine',sub?.08:.03,1450)}}
 creakT-=dt;if(!sub&&creakT<=0){creakT=1+Math.random()*(6-Math.min(5,g.amp/10));const f=90+Math.random()*120;tone(f,.5+Math.random()*.5,'triangle',.04+g.amp/900,f*(.7+Math.random()*.6))}}
function tone(f,t,type='sine',v=.2,f2){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;if(f2)o.frequency.exponentialRampToValueAtTime(f2,AC.currentTime+t);g.gain.value=v;g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+t);o.connect(g).connect(BUS||AC.destination);o.start();o.stop(AC.currentTime+t)}
function nburst(t,f,v){if(!AC)return;const s=AC.createBufferSource();s.buffer=AM.nb;const fl=AC.createBiquadFilter();fl.type='lowpass';fl.frequency.value=f;const g=AC.createGain();g.gain.value=v;g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+t);s.connect(fl).connect(g).connect(BUS);s.start();s.stop(AC.currentTime+t)}
const sfx={harpoon:()=>{nburst(.25,3000,.3);tone(140,.3,'square',.15,60)},zap:()=>{tone(1800,.2,'sawtooth',.12,200);nburst(.15,8000,.15)},thunder:()=>{nburst(2.5,180,.6);tone(45,1.8,'sawtooth',.15,25)},wave:()=>nburst(1.2,700,.35),tap:()=>tone(600,.06,'square',.06),splash:()=>{tone(300,.4,'sawtooth',.08,60)},crane:()=>{tone(90,1.6,'sawtooth',.08,220);tone(45,1.6,'square',.04,110)},
 cash:()=>{nburst(.08,6000,.2);tone(2600,.6,'triangle',.12);[1320,1760,2640].forEach((f,i)=>setTimeout(()=>tone(f,.25,'triangle',.15),i*90))},crash:()=>{tone(80,.7,'sawtooth',.3,30);tone(200,.3,'square',.1,50)},
 ice:()=>tone(2200+Math.random()*800,.08,'triangle',.12),alarm:()=>{tone(880,.15,'square',.12);setTimeout(()=>tone(660,.15,'square',.12),160)},good:()=>tone(660,.2,'triangle',.15,1320)};
const buzz=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
document.addEventListener('pointerdown',e=>{audio();const b=e.target.closest('.btn');if(b){sfx.tap();buzz(10)}},true);
// ---- screens ----
function show(id){document.querySelectorAll('.scr').forEach(s=>s.classList.toggle('on',s.id===id));const sea=!id;$('hud').style.display=$('ctl').style.display=sea?'flex':'none';$('hud').style.display=sea?'block':'none';$('ctl').style.display=sea?'flex':'none';$('route').style.display=sea?'block':'none';$('corner').style.display=$('bEye').style.display=sea?'flex':'none'}
function toast(t,ms=1600){const e=$('toast');e.innerHTML=t;e.style.display='block';clearTimeout(e._t);e._t=setTimeout(()=>e.style.display='none',ms)}
const fm=n=>'$'+Math.round(n).toLocaleString();
$('bPlay').onclick=()=>{S.boat?dock():boats()};
$('bReset2')&&($('bReset2').onclick=async()=>{if(await ask('Erase your save and start over?','Erase','Keep')){localStorage.removeItem('bs_save');location.reload()}});$('bReset').onclick=async()=>{if(await ask('Erase your save and start over?','Erase','Keep')){localStorage.removeItem('bs_save');location.reload()}};
function boatIcon(b){const i=new Image();i.src='img/'+b.spr+'.png';if(b.filt)i.style.filter=b.filt;i.style.cssText+=';width:130px;background:linear-gradient(#5d7a92,#1b3a52);border-radius:10px;padding:6px';return i}
function boats(){if(!S.owned.length&&S.money<4500){S.money=6000;save()}show('sBoats');$('mB').innerHTML=fm(S.money)+'<div style="font-size:13px;color:#9fe07a;margin-top:4px">🎮 Demo: all boats unlocked · buy boats for your fleet in 🏢 Company</div>';const L=$('boatList');L.innerHTML='';
 for(const k in BOATS){const b=BOATS[k],own=S.owned.includes(k),d=document.createElement('div');d.className='card';
  d.innerHTML=`<div class="boatpick"><span></span><div><b>${b.name}</b> ${own?'✅ owned':fm(b.price)}<br><small>${b.desc}<br>📏 ${b.spec.L} · 🧊 Hold ${b.spec.hold.toLocaleString()} lb · 🪤 ${b.spec.real}<br>⛽ ${b.spec.gal.toLocaleString()} gal · 👥 Crew ${b.spec.crew} · 🚀 ${b.spec.kn} kn · Game sets: ${b.pots}</small></div></div>`;
  d.querySelector('span').appendChild(boatIcon(b));const bt=document.createElement('button');bt.className='btn '+(own?'green':'');
  bt.textContent=S.boat===k?'✓ Selected':'Play this boat';bt.disabled=false;
  bt.className='btn '+(S.boat===k?'green':'');bt.onclick=()=>{S.boat=k;S.test=0;save();dock()};d.appendChild(bt);
  if(false){const td=document.createElement('button');td.className='btn green';td.textContent='⭐ Free test drive';td.onclick=()=>{S.prevBoat=S.boat;S.boat=k;S.test=1;save();dock()};d.appendChild(td)}L.appendChild(d)}}
$('bBoatBack').onclick=()=>S.boat?dock():show('sStart');
function spark(sp){const pts=[];for(let i=-6;i<=0;i++)pts.push(i===0?todayPrice(sp):basePrice(sp,i));const mn=Math.min(...pts),mx=Math.max(...pts)+1e-6;
 return `<svg class="spark" width="70" height="22">`+`<polyline fill="none" stroke="${pts[6]>=pts[5]?'#49e07c':'#ff5a5a'}" stroke-width="2" points="${pts.map((p,i)=>(i*11+2)+','+(20-(p-mn)/(mx-mn)*18)).join(' ')}"/></svg>`}
const FC=[['☀️ Calm',5,0],['🌊 Swell',15,5],['💨 Gale',35,12],['⛈ Storm',60,25],['🌀 Hurricane',85,45]];
function forecast(i){const r=hash('wx'+dayKey()+(S.trips+i));const lv=r<.25?0:r<.55?1:r<.75?2:r<.92?3:4;return{lv,n:FC[lv][0],risk:FC[lv][1],bonus:FC[lv][2]}}
const ORDT=[['king','lb',[3000,12000],'Restaurant chain','2x'],['snow','lb',[5000,20000],'Seafood buyer in Seattle','1.6x'],['halibut','lb',[2000,8000],'Fish market','1.8x'],['lobster','lb',[500,3000],'Boston hotel','2x'],
 ['shrimp','lb',[2000,10000],'Gulf processor','1.7x'],['bluefin','lb',[300,1500],'Tokyo sushi buyer','2.5x'],['isopod','ea',[1,1],'Aquarium (live)','$40000'],['angler','ea',[1,2],'Research institute','$60000'],['golden','lb',[1000,5000],'Luxury restaurant','2.2x'],['mahi','lb',[200,1500],'Hawaii fish market','1.8x']];
function newOrder(){const T=ORDT[Math.floor(Math.random()*ORDT.length)];const need=T[1]==='ea'?T[2][0]+Math.floor(Math.random()*(T[2][1]-T[2][0]+1)):Math.round((T[2][0]+Math.random()*(T[2][1]-T[2][0]))/100)*100;
 return {k:T[0],ea:T[1]==='ea',need,who:T[3],bonus:T[4],left:2+Math.floor(Math.random()*3),id:Math.random().toString(36).slice(2,7)}}
function ordersTick(){S.orders=S.orders||[];S.rep=S.rep??50;while(S.orders.length<2)S.orders.push(newOrder())}
function dock(){ordersTick();daily();save();show('sDock');$('mD').textContent=fm(S.money);const b=BOATS[S.boat];
 $('dockInfo').innerHTML=`Your boat: <b>${b.name}</b>${S.test?' <span style="color:#f2b632">(TEST DRIVE)</span>':''}${b.sub?' · 🟡 Sub aboard':''} · Trips: ${S.trips}`;
 const gs=['bering','gulfak','natl','gulfmx','tuna','abyss','mariana'];$('grounds').innerHTML='';for(const k of gs){const e=document.createElement('button');e.className='btn green';const gg=GROUNDS[k];e.textContent=({bering:'🦀 ',gulfak:'🐟 ',natl:'🦞 ',gulfmx:'🦐 ',tuna:'🎣 ',abyss:'🌑 ',mariana:'🕳 '})[k]+gg.n;e.onclick=()=>{if(gg.sub&&!b.sub){S.prevBoat=S.boat;S.boat='dyscovery1';S.test=1;save();toast('Deep zones need a sub – Dyscovery1 test drive!',2500)}sail(k)};$('grounds').appendChild(e)}$('mDate').textContent=new Date().toDateString();
 $('orders').innerHTML=`<div class="row"><b>🚨 EMERGENCY ORDERS</b><small>⭐ Reputation ${S.rep}</small></div>`+S.orders.map(o=>`<div class="row" style="border-bottom:1px solid #2a2a2a;padding:4px 0"><div><b>${o.who}</b> needs <b class=gold>${o.need.toLocaleString()}${o.ea?' ×':' lb'} ${SP(o.k).n}</b></div><div style="text-align:right"><span class=up>${o.bonus.startsWith('$')?fm(+o.bonus.slice(1)):o.bonus+' price'}</span><br><small class=${o.left<=1?'dn':''}>⏳ ${o.left} trip${o.left>1?'s':''} (days) left</small></div></div>`).join('');
 $('fc').innerHTML=[0,1,2].map(i=>{const f=forecast(i);return `<tr><td>${i?'Trip +'+i:'<b>Next trip</b>'}</td><td>${f.n}</td><td class="${f.risk>30?'dn':''}">Risk ${f.risk}%</td><td class="up">${f.bonus?'+'+f.bonus+'% price':'—'}</td></tr>`}).join('');
 $('mkt').innerHTML=SPECIES.map((sp,i)=>{const t=todayPrice(sp),y=basePrice(sp,-1),up=t>=y,pc=((t-y)/y*100).toFixed(1);const hd=sp.ea&&!SPECIES[i-1].ea?'<tr><td colspan=4 style="color:#f2b632;padding-top:10px">🌑 DEEP-SEA SPECIALS (sub only, per animal)</td></tr>':'';
  return hd+`<tr style="${sp.soon?'opacity:.5':''}"><td>${sp.n}${sp.soon?' <small>(soon)</small>':''}${sp.ea?` <small>${sp.dmin}m+</small>`:''}</td><td><b>${sp.ea?fm(t)+'<small>/ea</small>':'$'+t.toFixed(2)}</b></td><td class="${up?'up':'dn'}">${up?'▲':'▼'}${Math.abs(pc)}%</td><td>${spark(sp)}</td></tr>`}).join('')}
$('bBoats2').onclick=boats;$('bYard').onclick=yard;$('bYardBack').onclick=dock;
function yard(){show('sYard');$('mY').textContent=fm(S.money);const Y=$('yard');Y.innerHTML='';
 const ALL=Object.assign({},UPG,BOATS[S.boat].sub?Object.assign({},BOATSUB,SUBUPG):{});for(const k in ALL){const u=ALL[k],l=S.upg[k]||0,c=Math.round(u.c*(1+l*.8)*Math.max(1,Math.pow(BOATS[S.boat].price/20000,.55))/50)*50,d=document.createElement('div');d.className='card';
  d.innerHTML=`<div class="row"><div><b>${u.n}</b> ${'★'.repeat(l)}${'☆'.repeat(Math.max(0,(u.max||MAXL)-l))}<br><small>${u.d}</small></div></div>`;
  const bt=document.createElement('button');bt.className='btn blue';bt.textContent=l>=(u.max||MAXL)?'MAX':fm(c);bt.disabled=l>=(u.max||MAXL)||S.money<c;
  bt.onclick=()=>{S.money-=c;S.upg[k]++;save();sfx.cash();buzz([20,30,20]);yard()};d.querySelector('.row').appendChild(bt);Y.appendChild(d)}}
// ---- sea game ----
const cv=$('cv'),X=cv.getContext('2d');let W,H,DPR;
function rs(){DPR=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;X.setTransform(DPR,0,0,DPR,0,0)}addEventListener('resize',rs);rs();
const WEATHER=[{n:'☀️ Calm',a:6,w:0,ice:0,p:'none'},{n:'🌊 Swell',a:16,w:.2,ice:0,p:'none'},{n:'💨 Gale',a:28,w:.6,ice:0,p:'rain',rogue:.05,fog:.12},{n:'❄️ Freezing Spray',a:22,w:.5,ice:1,p:'snow',rogue:.03,fog:.25},{n:'⛈ STORM',a:40,w:1,ice:.6,p:'snow',rogue:.09,fog:.35},{n:'🌀 HURRICANE',a:58,w:1.5,ice:.25,p:'rain',rogue:.15,fog:.5}];
let G=null,last=0,parts=[];
function mkSea(){let b=BOATS[S.boat];const U=S.upg;
 const hs=[];for(let i=0;i<7;i++){const x=400+Math.random()*3400;hs.push({x,r:120+Math.random()*180,q:(.4+Math.random()*.9)*(.45+x/4000*.95)})}
 const maxH=b.hull*(1+.25*U.hull);const B0=b;b=Object.assign({},B0,{hold:B0.hold?Math.round(B0.hold*(1+.25*(U.holdU||0))):B0.hold,fuel:B0.fuel*(1+.3*(U.tanks||0)),spec:B0.spec?Object.assign({},B0.spec,{days:B0.spec.days*(1+.4*(U.prov||0))}):B0.spec,_base:B0});
 G={gr:Object.assign({},GROUNDS[GK],b.method&&GK==='tuna'?{method:'pot',mix:[['yellowfin',.6],['bluefin',.25],['mahi',.15]]}:{}),by:{},b,x:150,vx:0,dir:0,fuel:b.fuel,maxF:b.fuel,hull:maxH,maxH,ice:0,catch:0,pots:b.pots+3*U.pots,buoys:[],hs,w:0,wT:18,t:0,rogue:null,haul:null,storms:0,dmg:0,fc:TRIPFC,peak:TRIPFC?TRIPFC.lv+(TRIPFC.lv>=4?1:0):2,maxW:0,cam:0,ang:0,amp:6,lastTgt:0,flash:0,potsLost:0,over:false}}
function density(x){let d=0;for(const h of G.hs){d+=h.q*Math.exp(-(((x-h.x)/h.r)**2))}return Math.min(1.3,d)}
function waveY(x,t){const a=G?G.amp:8;return Math.sin(x*.012+t*1.4)*a*.6+Math.sin(x*.027-t*2.1)*a*.3+Math.sin(x*.005+t*.6)*a*.5}
function sail(gk='bering'){GK=gk;TRIPFC=forecast(0);S.mkt.date!==dayKey()&&(S.mkt={date:dayKey()});mkSea();$('bDrop').textContent=METHODS[G.gr.method].drop;$('bHaul').textContent=METHODS[G.gr.method].haul;show(null);subUI();toast(G.gr.method==='rod'?'Running out to the tuna grounds… ▶ find a hotspot and CAST':'Leaving Kodiak… head east to the crab grounds ▶',2500)}
let GK='bering',TRIPFC=null;
const hold={L:0,R:0,U:0,D:0};
for(const [id,k] of [['bL','L'],['bR','R']]){const e=$(id);e.onpointerdown=ev=>{ev.preventDefault();try{e.setPointerCapture(ev.pointerId)}catch(_){}hold[k]=1;if(G)G.auto=null;onSteer(k==='L'?-1:1)};e.onpointerup=e.onpointercancel=e.onlostpointercapture=()=>hold[k]=0}
addEventListener('keydown',e=>{if(!G)return;if(e.key==='ArrowLeft'){hold.L=1;onSteer(-1)}if(e.key==='ArrowRight'){hold.R=1;onSteer(1)}if(e.key===' ')$('bDrop').onclick()});
addEventListener('keyup',e=>{if(e.key==='ArrowLeft')hold.L=0;if(e.key==='ArrowRight')hold.R=0});
function onSteer(d){if(G&&G.rogue&&!G.rogue.done){if(d===G.rogue.d){G.rogue.done=1;banner('✅ NAILED IT!',900,'#2f2');sfx.good();buzz(30)}else{rogueHit()}}}
$('bDrop').onclick=()=>{if(!G||G.haul||G.fight)return;if(G.pots<=0)return toast('No pots left on deck');if(G.buoys.some(b=>Math.abs(b.x-G.x)<60))return toast('Too close to another pot');
 if(G.gr.method==='rod'){G.pots--;G.buoys.push({x:G.x,d:density(G.x),t:0,soak:3+Math.random()*5/(.3+density(G.x)),rod:1});sfx.splash();return toast('Line out… wait for a bite 🎣')}
 G.potsUsed=(G.potsUsed||0)+1;G.pots--;G.buoys.push({x:G.x,d:density(G.x),t:0,soak:14+Math.random()*6});sfx.splash();buzz(40);toast('Pot down! Soaking… 🪤')};
function nearBuoy(){return G.buoys.find(b=>Math.abs(b.x-G.x)<70)}
$('bHaul').onclick=()=>{if(!G||G.haul||G.fight)return;const b=nearBuoy();if(!b)return toast('Steer next to a buoy to haul');if(b.t<b.soak)return toast((b.rod?'No bite yet: ':'Still soaking: ')+Math.ceil(b.soak-b.t)+'s');if(b.rod)return startFight(b);if(b.deep&&!b.up){if(G.winch)return;if(b.deep>WINCH[UL('winch')])return toast(`Cable too short! Need winch rated ${b.deep.toLocaleString()} m (have ${WINCH[UL('winch')].toLocaleString()} m)`);G.winch={b,t:0,T:Math.max(2,b.deep/150*(1-.12*S.upg.crane))};sfx.crane();return toast(`⚙ Winching cage up from ${b.deep.toLocaleString()} m…`)}
 const zw=(.18+.05*S.upg.crane+((G.b._base||G.b)===BOATS.crabber?.05:0)+(G.sk||0)/600)*(1-(G.fatigue||0)/250),zs=Math.random()*(1-zw);G.haul={b,p:0,v:.9+WEATHER[G.w].a/40,zs,zw};
 $('hzone').style.left=zs*100+'%';$('hzone').style.width=zw*100+'%';$('hperf').style.left=(zs+zw*.4)*100+'%';$('hperf').style.width=zw*20+'%';$('haul').style.display='block';sfx.crane()};
$('hStop').onclick=()=>{const h=G&&G.haul;if(!h)return;const p=h.p,inZ=p>=h.zs&&p<=h.zs+h.zw,perf=Math.abs(p-(h.zs+h.zw/2))<h.zw*.1;
 const tm=perf?1.25:inZ?1:.35;let lbs=Math.round((h.b.deep?(250+Math.random()*450)*h.b.cap:(60+Math.random()*50))*G.b.potLb*h.b.d*tm*(1+.15*S.upg.sonar));
 const sk=h.b.deep?(h.b.deep>900?'golden':'king'):pickSpX(G.gr.mix,h.b.x);if(h.b.deep>400&&Math.random()<.18){G.by.isopod=(G.by.isopod||0)+1;setTimeout(()=>toast('🦐 Bonus: a Giant Isopod in the cage!'),1700)}let lbs0=lbs;if(/crab/.test(sk)||sk==='king'||sk==='snow'||sk==='golden'){const pct=Math.max(.05,.3-(G.sk||0)/400-Math.random()*.1);lbs=Math.round(lbs*(1-pct));if(lbs0>0)setTimeout(()=>toast(`📏 Crew sorted: ${Math.round(pct*100)}% undersized/female thrown back`,1800),1200)}G.by[sk]=(G.by[sk]||0)+lbs;const room=Math.max(0,(G.b.hold||1e9)-G.catch);const kept=Math.min(lbs,room);G.by[sk]-=lbs-kept;if(kept<lbs)setTimeout(()=>toast('🧊 HOLD FULL – return to port!',2500),900);G.catch+=kept;G.buoys.splice(G.buoys.indexOf(h.b),1);if(!h.b.deep)G.pots++;G.haul=null;$('haul').style.display='none';
 banner(perf?'PERFECT HAUL!':inZ?'GOOD HAUL':'SLOPPY…',1000,perf?'#ffe14d':inZ?'#2f2':'#f84');toast(`🦀 +${lbs} lb ${SP(sk).n}`);sfx.crane();if(lbs>0)setTimeout(sfx.cash,400);buzz(perf?[30,30,60]:30);
 for(let i=0;i<20;i++)parts.push({x:G.x-G.cam,y:H*.5,vx:(Math.random()-.5)*6,vy:-Math.random()*6,l:1,c:'#e33',s:4})};
function startFight(b){const sk=pickSp(G.gr.mix),sp=SP(sk),wt=Math.round(sp.w[0]+Math.random()**2*(sp.w[1]-sp.w[0]));
 G.fight={b,sk,wt,str:sp.str*(1+wt/sp.w[1]*.5),dist:100,ten:30,hold:0};$('fight').style.display='block';$('fName').textContent=`🐟 ${sp.n} on the line! (~${wt} lb)`;G.fight.rt=1.2;sfx.alarm();buzz([50,30,50])}
function fightStep(dt){const f=G.fight;f.rt=(f.rt??1.5)-dt;if(f.rt<=0){f.run=!f.run;f.rt=f.run?1+Math.random()*1.2*f.str:1.8+Math.random()*2.2}
 const st=Math.sqrt(f.str);f.ten+=dt*(f.hold?(f.run?55*st:12*st):-48);f.ten=Math.max(0,f.ten);
 f.dist+=dt*(f.hold?(f.run?3*st:-26*(1+.1*S.upg.crane)/st):(f.run?9*st:1.5*st));f.dist=Math.max(0,f.dist);
 $('fName').innerHTML=`🐟 ${SP(f.sk).n} (~${f.wt} lb) — `+(f.run?'<span class=dn>🌊 IT\'S RUNNING! EASE OFF</span>':'<span class=up>REEL! REEL!</span>');f.wasRun=f.run;
 $('tBar').style.width=Math.min(100,f.ten)+'%';$('tBar').style.background=f.ten>80?'#f33':f.ten>55?'#fb2':'#3d7';$('dBar').style.width=Math.max(0,f.dist)+'%';
 if(f.hold&&Math.random()<dt*8){tone(140+f.ten*3,.05,'sawtooth',.05);buzz(5)}
 const done=w=>{G.buoys.splice(G.buoys.indexOf(f.b),1);G.pots++;G.fight=null;$('fight').style.display='none';
  if(w){if(G.catch+f.wt>(G.b.hold||1e9)){toast('🧊 Hold full!');}G.by[f.sk]=(G.by[f.sk]||0)+f.wt;G.catch+=f.wt;banner('🎣 LANDED!',1200,'#ffe14d');toast(`+${f.wt} lb ${SP(f.sk).n}`);sfx.cash();buzz([30,30,80])}else{banner(f.ten>=100?'💥 LINE SNAPPED':'It got away…',1200,'#f84');sfx.crash()}};
 if(f.ten>=100)done(0);else if(f.dist<=0)done(1);else if(f.dist>=150)done(0)}
function chip(){if(!G||G.ice<=0)return;G.ice=Math.max(0,G.ice-6);sfx.ice();buzz(8);for(let i=0;i<5;i++)parts.push({x:G.x-G.cam+(Math.random()-.5)*G.b.sw,y:H*.5-30,vx:(Math.random()-.5)*5,vy:-Math.random()*4,l:1,c:'#cff',s:3})}
$('bIce').onclick=chip;cv.addEventListener('pointerdown',e=>{if(G&&Math.abs(e.clientX-(G.x-G.cam))<G.b.sw*.5)chip()});
$('bHome').onclick=()=>{if(!G)return;if(G.buoys.some(b=>b.deep))toast('⚠ Leaving cages behind costs $350 each');if(G.x>700)toast('Heading home… ◀ steer back to Kodiak (left edge)',2200);else endTrip(false)};
function banner(t,ms,c='#fff'){const e=$('banner');e.textContent=t;e.style.color=c;e.style.display='block';clearTimeout(e._t);e._t=setTimeout(()=>e.style.display='none',ms)}
function rogueHit(){if(!G.rogue||G.rogue.done)return;G.rogue.done=1;const d=(25+Math.random()*15)*(1-.15*S.upg.hull)*(1-G.b.stab*.5);G.hull-=d;G.dmg+=d;
 banner('💥 HULL DAMAGE!',1100,'#f44');sfx.crash();sfx.wave();buzz([100,50,150]);if(Math.random()<.4&&G.pots>0){G.pots--;G.potsLost++;toast('A pot washed overboard!')}}
function planW(g){let w=g.w;if(w<g.peak&&Math.random()<.7)w++;else w+=Math.random()<.5?-1:1;w=Math.max(0,Math.min(5,Math.min(g.peak+1,w)));if(!g.gr.wx.includes(w))w=Math.max(0,w-1);return w}
function step(dt){bossTick(dt);if(G.t===0&&G.fc)G.w=Math.max(0,G.fc.lv-2);const g=G,Wt=WEATHER[g.w],U=S.upg;g.t+=dt;g.fatigue=Math.min(100,(g.fatigue||0)+dt*(.25+Wt.w*.4));if(g.sk==null)g.sk=S.test?60:crewSkill(S.boat);if(g.ice>0)g.ice=Math.max(0,g.ice-dt*g.sk*.03);if(g.hull<g.maxH*.85)g.hull+=dt*g.sk*.004;const days=tripHours(g)/24;if(g.b.spec&&days>g.b.spec.days&&!g.provWarn){g.provWarn=1;banner('🥫 PROVISIONS RUNNING OUT',2000,'#f84');toast('Crew needs to return to port – morale dropping',3000)}if(g.provWarn)g.fatigue=Math.min(100,g.fatigue+dt);
 if(g.nextW==null)g.nextW=planW(g);g.wT-=dt;
 if(g.wT<9&&g.nextW>=3&&g.nextW>g.w&&!g.warned){g.warned=1;banner('⚠ STORM INCOMING',2200,'#ff3');toast(`${WEATHER[g.nextW].n} in ~${Math.ceil(g.wT)}s · run for port ⚓ or ride it out for higher prices`,4000);sfx.alarm();buzz([80,60,80])}
 if(g.wT<=0){const prev=g.w;g.w=g.nextW;g.nextW=planW(g);g.warned=0;g.wT=16+Math.random()*14;g.maxW=Math.max(g.maxW,g.w);if(g.w!==prev){toast('Weather: '+WEATHER[g.w].n,2000);if(g.w>=3){sfx.alarm();g.storms++}}}
 let dirv=hold.R-hold.L;if(g.auto!=null&&!dirv){const d=g.auto-g.x;if(Math.abs(d)<12){if(g.autoPort){return endTrip(false)}g.auto=null;toast('🔥 Arrived at hotspot – drop your pots!');sfx.good();buzz(30)}else dirv=Math.sign(d)*1.6}
 g.dirv=dirv;const tgtV=dirv*130*g.b.speed*(1+.2*U.engine),acc=1.6*90/Math.max(90,g.b.sw||90);g.vx=(g.vx||0)+(tgtV-(g.vx||0))*Math.min(1,dt*acc);const sp=g.vx;g.x=Math.max(60,Math.min(4000,g.x+sp*dt));
 g.fuel-=dt*(.18+Math.abs(sp)/130*.55)*(1-.15*U.engine)*(1+Wt.w*.3)*(g.gr.fuelX||1);
 if(Wt.ice)g.ice=Math.min(100,g.ice+dt*Wt.ice*3.2*Math.pow(.65,U.deicer));
 if(g.ice>70)g.hull-=dt*(g.ice-70)*.05,g.dmg+=dt*(g.ice-70)*.05;
 g.buoys.forEach(b=>b.t+=dt);
 if(!g.rogue||g.rogue.done&&g.t>g.rogue.end){g.rogue=null;if(Wt.rogue&&Math.random()<Wt.rogue*dt*3){const d=Math.random()<.5?-1:1;g.rogue={d,end:g.t+1.7+.35*U.stab,done:0};banner(`TURN INTO IT! ${d<0?'◀◀':'▶▶'}`,1700,'#ff3');sfx.alarm();buzz([60,40,60])}}
 else if(!g.rogue.done&&g.t>g.rogue.end)rogueHit();
 if(g.fight)fightStep(dt);
 if(g.winch){const w=g.winch;w.t+=dt;$('toast').style.display='block';$('toast').innerHTML=`⚙ Winching ${Math.round(w.b.deep*(1-w.t/w.T)).toLocaleString()} m… ${Math.round(w.t/w.T*100)}%`;if(Math.random()<dt*2)tone(90+w.t*8,.3,'sawtooth',.04);if(Math.abs(g.x-w.b.x)>90){g.winch=null;toast('Winch stopped – stay over the buoy!')}else if(w.t>=w.T){w.b.up=1;g.winch=null;$('toast').style.display='none';$('bHaul').onclick()}}
 if(g.haul){g.haul.p+=dt*g.haul.v*(g.haul.dir||1);if(g.haul.p>1){g.haul.p=1;g.haul.dir=-1}if(g.haul.p<0){g.haul.p=0;g.haul.dir=1}$('hmk').style.left=g.haul.p*100+'%'}
 if(g.hull<=0)return endTrip(true);if(g.fuel<=0){g.fuel=0;toast('Out of fuel! Coast Guard tow…',2500);return endTrip(false,true)}
 if(g.x<=60&&hold.L&&g.t>3)return endTrip(false);
 // particles
 const pc=Wt.p;if(pc!=='none')for(let i=0;i<[0,0,4,4,8,12][g.w];i++)parts.push({x:Math.random()*W*1.2,y:-10,vx:-(2+Wt.w*6),vy:pc==='rain'?12:2+Math.random()*2,l:2,c:pc==='rain'?'#9cf8':'#fff',s:pc==='rain'?1.5:2.5,w:1});
 }
function drawBoat(x,b,sc,ang,ice){x.save();x.rotate(ang);x.scale(sc,sc);const L=b.len;
 x.fillStyle=b.color;x.beginPath();x.moveTo(-L/2,-18);x.lineTo(L/2+14,-24);x.lineTo(L/2-6,10);x.lineTo(-L/2+8,10);x.closePath();x.fill();
 x.fillStyle='#111';x.fillRect(-L/2+6,2,L-8,7);x.fillStyle='#eee';x.fillRect(-L/2,-20,L+12,3);
 x.fillStyle='#e8e2d0';x.fillRect(L*.1,-46,L*.28,27);x.fillStyle='#234';for(let i=0;i<3;i++)x.fillRect(L*.13+i*L*.08,-40,L*.05,8);
 x.strokeStyle='#ffb000';x.lineWidth=3;x.beginPath();x.moveTo(-L*.15,-20);x.lineTo(-L*.15,-60);x.lineTo(-L*.42,-40);x.stroke();
 x.fillStyle='#777';for(let i=0;i<(b===BOATS.crabber?3:1);i++){x.strokeStyle='#999';x.strokeRect(-L*.45+i*14,-34,12,12)}
 if(ice>5){x.globalAlpha=Math.min(.85,ice/100);x.fillStyle='#dff6ff';x.fillRect(-L/2,-50,L+12,30);x.fillRect(L*.1,-50,L*.28,8);x.globalAlpha=1}
 x.restore()}
const IMG={};for(const n of ['skiff','crabber','seatex','dyscovery1','sub','goldcrab','squid','angler'])(IMG[n]=new Image()).src='img/'+n+(n==='seatex'?'.jpg':'.png');
for(const k of ['ironTitan','longliner','trawler','seiner'])Object.assign(BOATS[k],{spr:'crabber',sw:270,draft:.22});Object.assign(BOATS.ironTitan,{filt:'brightness(.6) saturate(.4)'});Object.assign(BOATS.longliner,{filt:'hue-rotate(110deg)'});Object.assign(BOATS.trawler,{filt:'hue-rotate(170deg)'});Object.assign(BOATS.seiner,{filt:'hue-rotate(40deg) brightness(1.2)'});Object.assign(BOATS.dyscovery1,{spr:'dyscovery1',sw:330,draft:.2});
BOATS.skiff.spr='skiff';BOATS.skiff.sw=150;BOATS.skiff.draft=.30;BOATS.crabber.spr='crabber';BOATS.crabber.sw=230;BOATS.crabber.draft=.22;
let PAT=null;const ICE={};
function icy(b){if(ICE[b.spr])return ICE[b.spr];const im=IMG[b.spr];if(!im.complete||!im.naturalWidth)return null;const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const x=c.getContext('2d');
 x.drawImage(im,0,0);x.globalCompositeOperation='source-atop';const gr=x.createLinearGradient(0,0,0,c.height);gr.addColorStop(0,'rgba(235,250,255,.95)');gr.addColorStop(.7,'rgba(190,230,250,.75)');gr.addColorStop(1,'rgba(190,230,250,.2)');x.fillStyle=gr;x.fillRect(0,0,c.width,c.height);
 x.fillStyle='rgba(255,255,255,.9)';for(let i=0;i<300;i++)x.fillRect(Math.random()*c.width,Math.random()*c.height*.8,2+Math.random()*5,1+Math.random()*3);return ICE[b.spr]=c}
function drawSprite(x,b,ang,ice,bob){const im=IMG[b.spr];if(!im.complete||!im.naturalWidth)return drawBoat(x,b,1,ang,ice);const w=Math.min(b.sw,W*.72),h=w*im.naturalHeight/im.naturalWidth;
 x.save();x.rotate(ang);x.translate(0,bob||0);if(b.filt)x.filter=b.filt;x.drawImage(im,-w/2,-h*(1-b.draft),w,h);if(ice>3){const ic=icy(b);if(ic){x.globalAlpha=Math.min(.9,ice/90);x.filter='none';x.drawImage(ic,-w/2,-h*(1-b.draft),w,h);x.globalAlpha=1}}x.filter='none';x.restore();return h}
function band(cam,t,k,yoff,amp,alpha,dark,step){X.beginPath();X.moveTo(0,H);for(let sx=0;sx<=W+step;sx+=step)X.lineTo(sx,yoff+waveY(k===1?sx+cam:sx/k+cam*k+k*900,t*(.6+k*.4))*amp);X.lineTo(W,H);X.closePath();
 if(PAT){const m=new DOMMatrix();m.translateSelf(-(cam*k)%1024+t*8*k,yoff-40);m.scaleSelf(.55+k*.45,.55+k*.45);PAT.setTransform(m);X.globalAlpha=alpha;X.fillStyle=PAT;X.fill()}
 X.globalAlpha=1;X.fillStyle=dark;X.fill()}
function draw(){const g=G,Wt=WEATHER[g.w],t=g.t;g.cam+=(g.x-W*.5-g.cam)*.3;const cam=g.cam,sea=H*(W>H?.62:.5),tuna=g.gr.method==='rod',uw=sea+Math.min(90,H*.12);
 g.amp+=(Wt.a-g.amp)*.01;if(!PAT&&IMG.seatex.complete&&IMG.seatex.naturalWidth)PAT=X.createPattern(IMG.seatex,'repeat');
 const hr=(6+tripHours(g))%24,day=Math.max(0,Math.min(1,(Math.sin((hr-6)/12*Math.PI)+.25)/.9)),dark=Math.min(1,g.w/4.5+(1-day)*.55);const sk=X.createLinearGradient(0,0,0,sea);sk.addColorStop(0,`hsl(${g.gr.sky},${tuna?50:25}%,${(tuna?62:46)-dark*36}%)`);sk.addColorStop(1,`hsl(${g.gr.sky-5},${tuna?40:18}%,${(tuna?80:66)-dark*42}%)`);X.fillStyle=sk;X.fillRect(0,0,W,sea+60);if(day>.05&&day<.6&&g.w<3){const sg=X.createLinearGradient(0,sea*.4,0,sea+40);sg.addColorStop(0,'rgba(255,140,60,0)');sg.addColorStop(1,`rgba(255,120,50,${.35*(1-Math.abs(day-.3)/.3)})`);X.fillStyle=sg;X.fillRect(0,0,W,sea+40)}
 X.fillStyle=`rgba(30,38,48,${.25+dark*.6})`;for(let i=0;i<7;i++){const cx=((i*230-cam*.15-t*(8+Wt.w*40))%(W+500)+W+500)%(W+500)-250;X.beginPath();X.ellipse(cx,50+i%3*34,170,34+dark*20,0,0,7);X.fill()}
 if(g.w>=3&&Math.random()<(g.w-2)*.006){g.flash=1;let x=Math.random()*W,y=0;g.bolt=[[x,y]];while(y<sea){y+=20+Math.random()*30;x+=(Math.random()-.5)*50;g.bolt.push([x,y])}setTimeout(()=>{sfx.thunder();buzz([40,30,120])},300+Math.random()*900)}
 if(g.bolt&&g.flash>.4){X.strokeStyle='#eef';X.lineWidth=3;X.shadowColor='#aaf';X.shadowBlur=18;X.beginPath();g.bolt.forEach(([x,y],i)=>i?X.lineTo(x,y):X.moveTo(x,y));X.stroke();X.shadowBlur=0}if(g.flash>0){X.fillStyle=`rgba(255,255,255,${g.flash*.7})`;X.fillRect(0,0,W,H);g.flash-=.08}
 const dx=-cam;if(dx>-300){X.fillStyle='#2b2118';X.fillRect(dx-300,sea-30,330,30);X.fillStyle='#3c4650';X.fillRect(dx-260,sea-100,90,70);X.fillStyle='#fff';X.font='bold 14px sans-serif';X.fillText('KODIAK',dx-250,sea-108)}
 // far parallax bands (texture)
 const tint=tuna?'rgba(10,70,110,.45)':'rgba(8,20,32,.45)';
 band(cam,t,.35,sea-26,.35,.9,tint,16);band(cam,t,.6,sea-12,.6,.9,tuna?'rgba(8,60,95,.35)':'rgba(6,18,28,.35)',12);
 // boat
 const bx=g.x-cam,y1=waveY(g.x-g.b.sw*.3,t),y2=waveY(g.x+g.b.sw*.3,t),yc=waveY(g.x,t);const amp=1-g.b.stab*.6-S.upg.stab*.12;
 const tgt=Math.atan2(y2-y1,g.b.sw*.6)*amp+(g.rogue&&!g.rogue.done?Math.sin(t*20)*.05:0)-(g.vx||0)/130*.03;const mass=Math.max(1,(g.b.sw||150)/150);g.angV=(g.angV||0)+((tgt-g.ang)*9/mass-(g.angV||0)*3)/60;g.ang+=g.angV/60*8;
 const wt=sea+6+yc;g.hv=(g.hv||0)+((wt-(g.hy||wt))*14/mass-(g.hv||0)*4)/60;g.hy=(g.hy||wt)+g.hv/60*6;const wl=g.hy;
 if(Math.abs(g.vx||0)>6)g.face=Math.sign(g.vx);g.face=g.face||1;g.flip=(g.flip??1)+(g.face-(g.flip??1))*Math.min(1,.06*90/Math.max(90,g.b.sw*.6));const fs=g.flip>=0?1:-1;
 X.save();X.translate(bx,wl);X.scale(Math.abs(g.flip)<.08?.08*fs:g.flip,1+(1-Math.abs(g.flip))*.04);drawSprite(X,g.b,g.ang*fs,g.ice,0);X.restore();
 // wake & bow spray
 const sp=Math.sign(g.dirv||0),bow=bx+fs*Math.cos(g.ang)*Math.min(g.b.sw,W*.72)*.45,by=wl+Math.sin(g.ang)*Math.min(g.b.sw,W*.72)*.45*fs;
 if(parts.length<500){if(sp&&Math.random()<.6)parts.push({x:bx-g.b.sw*.5*sp,y:wl,vx:-sp*(1+Math.random()*2),vy:-Math.random()*1.5,l:.8,c:'rgba(230,245,255,.7)',s:3});
  const dip=tgt-g.lastTgt;g.lastTgt=tgt;if((dip>.004||g.amp>18&&Math.random()<.08)&&Math.random()<.9)for(let i=0;i<(g.amp>25?6:3);i++)parts.push({x:bow,y:by-4,vx:fs*(1+Math.random()*3),vy:-2-Math.random()*4*(g.amp/20),l:1,c:'rgba(240,250,255,.85)',s:2+Math.random()*3})}
 // front band (cuts hull at waterline)
 X.globalAlpha=1;band(cam,t,1,sea+6,1,1,tuna?'rgba(6,70,100,.25)':'rgba(4,22,34,.25)',8);
 X.save();X.beginPath();X.moveTo(0,H);for(let sx=0;sx<=W+8;sx+=8)X.lineTo(sx,sea+6+waveY(sx+cam,t));X.lineTo(W,H);X.clip();const dg=X.createLinearGradient(0,sea,0,uw);dg.addColorStop(0,'rgba(0,0,0,0)');dg.addColorStop(1,tuna?'rgba(6,50,70,.85)':'rgba(4,20,28,.9)');X.fillStyle=dg;X.fillRect(0,sea-60,W,uw+30-sea+60);X.restore();
 // underwater cutaway
 const ug=X.createLinearGradient(0,uw-40,0,H);ug.addColorStop(0,tuna?'rgba(11,74,94,0)':'rgba(10,51,64,0)');ug.addColorStop(.18,tuna?'rgba(11,74,94,.93)':'rgba(10,51,64,.93)');ug.addColorStop(1,'#020a10');X.fillStyle=ug;X.fillRect(0,uw-40,W,H-uw+40);
 const bed=Math.max(H-175,uw+H*.2);X.fillStyle='#08161b';X.beginPath();X.moveTo(0,H);for(let sx=0;sx<=W+20;sx+=20)X.lineTo(sx,bedYf(sx+cam,uw,bed));X.lineTo(W,H);X.fill();
 for(let sx=0;sx<W&&tuna;sx+=24){const d=density(sx+cam);if(d>.25){X.fillStyle=`rgba(255,${tuna?200:80},60,${Math.min(.35,d*.3)})`;X.beginPath();X.ellipse(sx,tuna?uw+60:bed+4,14,tuna?30:8,0,0,7);X.fill()}}
 // light rays
 X.fillStyle='rgba(120,200,220,.04)';for(let i=0;i<4;i++){const rx=((i*170-cam*.3)%(W+200)+W+200)%(W+200)-100;X.beginPath();X.moveTo(rx,uw);X.lineTo(rx+40,uw);X.lineTo(rx+140,H);X.lineTo(rx+60,H);X.fill()}
 // buoys + lines + pots
 for(const b of g.buoys){const bx=b.x-cam;if(bx<-50||bx>W+50)continue;const by=sea+6+waveY(b.x,t)-4;X.strokeStyle='rgba(220,220,200,.45)';X.lineWidth=1;X.beginPath();X.moveTo(bx,by);X.quadraticCurveTo(bx+10,(by+bed)/2,bx,b.rod?uw+50:bedYf(b.x,uw,bed)-18);X.stroke();
  if(!b.rod){X.strokeStyle='#8a7a5a';X.lineWidth=1.5;X.strokeRect(bx-12,bedYf(b.x,uw,bed)-18,24,16);X.beginPath();X.moveTo(bx-12,bedYf(b.x,uw,bed)-10);X.lineTo(bx+12,bedYf(b.x,uw,bed)-10);X.stroke()}
  X.fillStyle=b.t>=b.soak?'#2f6':'#f62';X.beginPath();X.arc(bx,by,7,0,7);X.fill();X.fillStyle='#fff';X.font='bold 11px sans-serif';X.fillText(b.t>=b.soak?(b.rod?'BITE!':'READY'):Math.ceil(b.soak-b.t)+'s',bx-14,by-12)}
 lifeStep(g,1/60);{const uw2=uw,bed2=Math.max(H-175,uw+H*.2);drawLife(g,x=>x-cam,f=>LIFE[f.k].w?bedYf(f.x,uw2,bed2)-2:uw2+f.f*(bedYf(f.x,uw2,bed2)-uw2-6),SCL*.9);g._uw=uw2;g._bed=bed2}
 // crest foam / whitecaps
 X.strokeStyle='rgba(225,240,250,.35)';X.lineWidth=1.5;X.beginPath();let prev=null;
 for(let sx=0;sx<=W;sx+=6){const y=sea+6+waveY(sx+cam,t),yn=sea+6+waveY(sx+6+cam,t),crest=prev!==null&&y<prev&&y<yn;if(prev!==null&&(yn-y)<-.6*(g.amp/16)){X.moveTo(sx,y);X.lineTo(sx+6,yn)}
  if(crest&&g.amp>12){X.fillStyle='rgba(240,250,255,.8)';for(let j=0;j<4;j++)X.fillRect(sx-8+Math.random()*16,y-2+Math.random()*4,2,2);if(g.amp>24&&Math.random()<.05&&parts.length<500)for(let j=0;j<6;j++)parts.push({x:sx,y,vx:-(1+Wt.w*4)+Math.random()*2,vy:-2-Math.random()*5,l:.9,c:'rgba(235,248,255,.8)',s:2+Math.random()*2})}prev=y}
 X.stroke();
 if(g.rogue&&!g.rogue.done){const rx=g.rogue.d<0?bx-170:bx+170;const hgt=120+40*Math.sin(t*6);const gr=X.createLinearGradient(0,sea-hgt,0,sea+40);gr.addColorStop(0,'rgba(230,245,255,.95)');gr.addColorStop(.3,'rgba(40,80,100,.95)');gr.addColorStop(1,'rgba(5,20,30,1)');
  X.fillStyle=gr;X.beginPath();X.moveTo(rx-90,sea+40);X.bezierCurveTo(rx-40,sea-hgt*.6,rx+20*g.rogue.d,sea-hgt*1.1,rx+80*g.rogue.d,sea-hgt*.7);X.lineTo(rx+90,sea+40);X.fill();
  if(Math.random()<.5)parts.push({x:rx+70*g.rogue.d,y:sea-hgt*.8,vx:-g.rogue.d*3,vy:-2,l:.8,c:'rgba(255,255,255,.9)',s:3})}
 if(g._uw)drawPins(g,g._uw,g._bed);
 if(Wt.w>=.5){X.strokeStyle='rgba(220,230,240,.18)';X.lineWidth=1;X.beginPath();for(let i=0;i<Wt.w*14;i++){const y=(i*53+((t*40)|0))%(sea+40),x=((i*137-t*(500+Wt.w*600))%(W+200)+W+200)%(W+200)-100;X.moveTo(x,y);X.lineTo(x+40+Wt.w*40,y-3)}X.stroke()}
 if(Wt.fog){g.fogA=(g.fogA||0)+(Wt.fog-(g.fogA||0))*.01}else g.fogA=(g.fogA||0)*.99;if(g.fogA>.02){const fg2=X.createLinearGradient(0,0,0,sea+80);fg2.addColorStop(0,`rgba(150,160,170,${g.fogA*.9})`);fg2.addColorStop(1,`rgba(120,130,140,${g.fogA})`);X.fillStyle=fg2;X.fillRect(0,0,W,sea+80)}
 // particles
 for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.x+=p.vx;p.y+=p.vy;if(!p.w)p.vy+=.25;p.l-=.018;if(p.l<=0||p.y>H){parts.splice(i,1);continue}X.globalAlpha=Math.min(1,p.l);X.fillStyle=p.c;X.fillRect(p.x,p.y,p.s,p.s*(p.c==='#9cf8'?5:1))}X.globalAlpha=1;
 if(parts.length>600)parts.splice(0,parts.length-600);
 // HUD
 $('gF').style.width=g.fuel/g.maxF*100+'%';$('gH').style.width=Math.max(0,g.hull/g.maxH*100)+'%';$('gI').style.width=g.ice+'%';$('gC').textContent=(g.catch>=1000?(g.catch/1000).toFixed(1)+'k':g.catch)+(g.b.hold?'/'+(g.b.hold>=1e6?(g.b.hold/1e6).toFixed(1)+'M':Math.round(g.b.hold/1000)+'k'):'');$('gCi').textContent=g.gr.method==='rod'?'🐟':'🦀';$('gP').textContent=g.pots;$('gW').textContent=Wt.n.split(' ')[0];$('hM').textContent=fm(S.money);$('gT').textContent='⬇'+sdep(g.x)+'m '+clockStr(g).replace('Day ','D')+' 😓'+Math.round(g.fatigue||0);
 const rng=300+120*S.upg.sonar,cells=24;let s='';for(let i=0;i<cells;i++){const d=density(g.x-rng+i*2*rng/cells)+(Math.random()-.5)*.25/(1+S.upg.sonar);s+=`<span style="display:inline-block;width:${100/cells}%;height:14px;background:hsl(${120-Math.min(1,d)*120},90%,${15+Math.min(1,d)*40}%)"></span>`}
 $('sonar').innerHTML='<b style="float:right">'+(density(g.x)>.6?'🔥 HOTSPOT':density(g.x)>.3?'some crab':'empty')+'</b><div style="line-height:0">'+s+'</div>'}
function loop(ts){const rdt=Math.min(.05,(ts-last)/1000||0);last=ts;audioTick(rdt);if(G)G.rdt=rdt;{const q=!!(G&&G.sub);if(q!==loop.q){loop.q=q;document.body.classList.toggle('insub',q)}}const tot=rdt*SPDS[S.spd??1],n=Math.max(1,Math.ceil(tot/.05)),dt=tot/n;
 for(let i=0;i<n-1&&G&&!G.over;i++){safetyTick(dt);warnTick(dt);aiTick(dt);if(G.sub)subStep(dt);else step(dt)}
 if(G&&!G.over){safetyTick(dt);warnTick(dt);aiTick(dt)}if(G&&!G.over){if(G.sub){subStep(dt);if(G&&G.sub)subDraw()}else{step(dt);if(G&&!G.over&&!G.sub)draw()}}if(G&&G.fade>0){G.fade=Math.max(0,G.fade-rdt*2.5);X.fillStyle=`rgba(0,8,14,${G.fade})`;X.fillRect(0,0,W,H)}requestAnimationFrame(loop)}requestAnimationFrame(loop);
function endTrip(sunk,towed){const g=G;g.over=true;$('haul').style.display='none';hold.L=hold.R=0;
 for(const k of Object.keys(g.by).concat(g.gr.mix.map(m=>m[0])))mktAdj(k,g.storms*.04+(g.fc?g.fc.bonus/100:0)*.5);const lines=Object.entries(g.by).map(([k,l])=>({k,l,p:todayPrice(SP(k))*(SP(k).ea?(UL('chill')?1.5:1):1),live:SP(k).ea&&UL('chill')}));
 const lost=g.buoys.length+g.potsLost;let ordBonus=0;const ordLines=[];S.orders=S.orders||[];S.rep=S.rep??50;
 if(!sunk)for(const o of S.orders.slice()){const have=g.by[o.k]||0;if(have>=o.need){const pr=todayPrice(SP(o.k));const b=o.bonus.startsWith('$')?+o.bonus.slice(1):(parseFloat(o.bonus)-1)*o.need*pr;ordBonus+=b;ordLines.push(`✅ Order: ${o.who} (${o.need.toLocaleString()}${o.ea?' ×':' lb'} ${SP(o.k).n})`,b);S.orders.splice(S.orders.indexOf(o),1);S.rep=Math.min(100,S.rep+5);S.ordersDone=(S.ordersDone||0)+1}}
 for(const o of S.orders.slice()){o.left--;if(o.left<=0){S.orders.splice(S.orders.indexOf(o),1);S.rep=Math.max(0,S.rep-3);ordLines.push(`❌ Missed order: ${o.who}`,0)}}
 if(S.orders.length<4&&Math.random()<.6)S.orders.push(newOrder());const gross=sunk?0:lines.reduce((a,x)=>a+x.l*x.p,0)+ordBonus;const gal=(g.maxF-g.fuel)/g.maxF*(g.b.spec?g.b.spec.tripGal*2.5:400);const fuel=gal*3.6;const crew=gross*(S.test?0:crewShare(S.boat));g.fight=null;$('fight').style.display='none';
 const rep=Math.round(sunk?0:g.dmg/g.maxH*g.b.price*.03+g.dmg*20);const salvage=sunk&&!S.test?Math.round(g.b.price*.12+1500):0;const tow=towed?1200:0;const potc=lost*350;
 const subLoss=g.subLost?50000:0;const tdays=Math.max(1,Math.ceil(tripHours(g)/24));const sp0=g.b.spec||{};const food=35*g.b.crew*tdays,bait=(g.potsUsed||0)*(g.b.potLb>10?120:15),maint=Math.round(g.b.price*.0004*tdays),ins=Math.round(g.b.price*.0003*tdays),runC=S.test?0:food+bait+maint+ins;const fleet=S.test?{lines:[],net:0}:fleetRun(tdays,g);if(!S.test)crewGain(S.boat,tdays,gross>0&&!sunk);const injC=(g.injuries||0)*8000+(g.fatal||0)*50000;if(!S.test){S.safety=Math.max(0,Math.min(100,(S.safety??70)-(g.injuries||0)*4-(g.fatal||0)*20+(!(g.injuries||g.fatal)?1:0)))}WARN=null;$('warn').style.display='none';const profit=gross-fuel-crew-rep-salvage-tow-potc-subLoss-runC+fleet.net-injC;S.day=(S.day||1)+tdays;S.life=(S.life||0)+profit;S.lastExp={fuel,crew,food,bait,maint,ins,rep};S.money+=profit;S.trips++;if(!sunk)lines.forEach(x=>mktAdj(x.k,-x.l/40000));save();
 logTrip(g,sunk,profit,lines);$('sumT').textContent=sunk?'🌊 YOU SANK!':'Trip Summary';
 const r=(a,b,c='')=>`<tr><td>${a}</td><td style="text-align:right" class="${c}">${b}</td></tr>`;
 $('sumTab').innerHTML=(sunk?r('Catch lost to the sea',g.catch+' lb','dn'):lines.length?lines.map(x=>r(SP(x.k).ea?`${SP(x.k).n}: ${x.l} × ${fm(x.p)} <small>(today)</small>`:`${SP(x.k).n}: ${x.l} lb × $${x.p.toFixed(2)} <small>(today)</small>`,fm(x.l*x.p))).join(''):r('Catch','0 lb'))+(()=>{let o='';for(let i=0;i<ordLines.length;i+=2)o+=r(ordLines[i],ordLines[i+1]?'+'+fm(ordLines[i+1]):'⭐ -3',ordLines[i+1]?'up':'dn');return o})()+r(`Trip length`,tdays+' day'+(tdays>1?'s':''))+r('Gross sale',fm(gross),'up')+r(`Fuel (${Math.round(gal).toLocaleString()} gal @ $3.60)`,' -'+fm(fuel),'dn')+r(`Crew shares (${g.b.crew} crew, ${Math.round((S.test?0:crewShare(S.boat))*100)}%)`,'-'+fm(crew),'dn')+r('Repairs','-'+fm(rep),'dn')+
  (injC?r(`Medical & investigation (${g.injuries||0} injured${g.fatal?', '+g.fatal+' fatal':''})`,'-'+fm(injC),'dn'):'')+(runC?r(`Food (${g.b.crew} crew × ${tdays} d)`,'-'+fm(food),'dn')+r('Ice & bait','-'+fm(bait),'dn')+r('Maintenance','-'+fm(maint),'dn')+r('Insurance','-'+fm(ins),'dn'):'')+(fleet.lines.length?'<tr><td colspan=2 style="color:#f2b632;padding-top:8px">🚢 FLEET REPORT</td></tr>'+fleet.lines.map(l=>r(l[0],(l[1]>=0?'+':'-')+fm(Math.abs(l[1])),l[1]>=0?'up':'dn')).join(''):'')+(salvage?r('Salvage & boat recovery','-'+fm(salvage),'dn'):'')+(tow?r('Coast Guard tow','-'+fm(tow),'dn'):'')+(subLoss?r('Submarine lost (crushed) – replacement','-'+fm(subLoss),'dn'):'')+(potc?r(`Lost pots (${lost})`,'-'+fm(potc),'dn'):'')+
  `<tr><td><b>PROFIT</b></td><td style="text-align:right;font-size:22px" class="${profit>=0?'up':'dn'}"><b>${profit<0?'-':''}${fm(Math.abs(profit))}</b></td></tr>`+r('Bank',fm(S.money));
 if(S.test){S.boat=S.prevBoat||null;S.test=0;save();$('sumT').textContent+=' (test drive over)'}show('sSum');countUp();if(sunk){sfx.crash();buzz([200,100,300])}else if(profit>0){sfx.cash();buzz([30,40,30])}G=null}
$('bSumOk').onclick=()=>{if(S.money<0){S.money=1500;save();toast('The bank bailed you out with $1,500. Go fish!',2500)}S.boat?dock():boats()};
$('bDemo').onclick=()=>{S.prevBoat=S.test?S.prevBoat:S.boat;S.boat='dyscovery1';S.test=1;save();sail('bering');setTimeout(()=>toast('⭐ Dyscovery1 demo: tap 🟡 SUB, dive ▼, DROP CAGE on orange sonar blips, surface, then sail to 📍 buoys & HAUL',5000),2600)};
window.bedD=bedD;window.__bs={boatRect(){const g=G;if(!g||g.sub)return null;const im=IMG[g.b.spr],w=Math.min(g.b.sw,W*.72),h=w*im.naturalHeight/im.naturalWidth,bx=g.x-g.cam,wl=g.hy;return {left:bx-w/2,right:bx+w/2,top:wl-h*(1-g.b.draft),bottom:wl+h*g.b.draft*.3}},get G(){return G},S:()=>S,sail,endTrip};
{const r=$('bReel');const on=v=>e=>{e.preventDefault();if(G&&G.fight)G.fight.hold=v};r.onpointerdown=on(1);r.onpointerup=r.onpointerleave=r.onpointercancel=on(0)}
// ================= SUBMARINE MODE (Dyscovery1) =================
const UL=k=>S.test?Math.max(S.upg[k]||0,({subDepth:GK==='mariana'?3:2,claw:2,winch:2,chill:1,subsonar:1,stun:1,basket:2,harpoon:1,drone:1})[k]||0):(S.upg[k]||0);
const SCL=22,PXM=1.4;
function bedD(x){return sdep(x)}
function subLaunch(){G&&(G.scSnap=1,G.fade=1);if(!G||G.sub||!G.b.sub||G.haul||G.fight)return;if(G.subLost)return toast('Sub was lost this trip');
 const rating=DEPTHS[UL('subDepth')];if(!G.crit){G.crit=[];for(let i=0;i<(GK==='mariana'?80:34);i++){const sp=SPECIES.filter(s=>s.ea);let c=sp[Math.floor(Math.random()*sp.length)];const x=Math.random()*4000,bd=bedD(x);
  if(bd<c.dmin||Math.random()>c.r)continue;const lo=c.dmin,hi=Math.min(bd-5,c.dmax||bd);if(hi<=lo)continue;G.crit.push({hp:1+Math.round(Math.log2(1+c.sz*4))+(c.r<.15?2:0),stun:0,k:c.k,x,y:c.img==='goldcrab'||c.k==='isopod'||c.bot?bd-c.sz*.4:lo+Math.random()*(hi-lo),ph:Math.random()*6,dir:Math.random()<.5?-1:1})}}
 if(!G.fast){G.fast=[];const fk=['sailfish','marlin','bluefin','yellowfin','mahi'];for(let i=0;i<9;i++){const k=fk[i%5],n=k==='marlin'||k==='sailfish'?1:3+Math.floor(Math.random()*4),cx=300+Math.random()*3600,cy=20+Math.random()*160,dir=Math.random()<.5?-1:1;for(let j=0;j<n;j++)G.fast.push({k,x:cx+j*40,y:cy+(j%3)*10,ox:j*40*dir,oy:(j%3)*12,lead:j===0,grp:i,dir,ph:Math.random()*6})}}
 G.sub={ammo:3+UL('harpoon'),rl:0,harp:null,drone:null,x:G.x,y:2,face:1,batt:100,hull:100,cages:2+2*UL('cages'),basket:[],cd:0,carry:null,asc:0,rating,snow:[]};
 for(let i=0;i<70;i++)G.sub.snow.push({x:Math.random()*W,y:Math.random()*H,z:.3+Math.random(),c:Math.random()<.18?['#6cf','#4fa','#c7f'][i%3]:'#fff'});
 $('bDrop').textContent='🪤 DROP CAGE';$('bHaul').textContent='🦾 GRAB';
 sfx.splash();buzz(40);toast(`🟡 Sub launched · rated ${rating.toLocaleString()} m · ${G.sub.cages} cages`,2200)}
function subExit(){G.fade=1;G.scy=null;const u=G.sub;$('toast').style.display='none';banner('🟡 Sub docked on Dyscovery1',1400,'#9fe07a');if(u.basket.length){u.basket.forEach(k=>G.by[k]=(G.by[k]||0)+1);banner('🏆 '+u.basket.map(k=>SP(k).n).join(', '),2000,'#f2b632');sfx.cash()}G.sub=null;subUI()}
function subUI(){const m=METHODS[G.gr.method];$('bDrop').textContent=({pot:'🪤 ',rod:'🎣 ',longline:'🪝 ',trawl:'🕸 '})[G.gr.method]+m.drop;$('bHaul').textContent='⚙ '+m.haul}
$('bSub').onclick=subLaunch;
for(const [id,k] of [['bUp','U'],['bDn','D']]){const e=$(id);e.onpointerdown=()=>hold[k]=1;e.onpointerup=e.onpointerleave=e.onpointercancel=()=>hold[k]=0}
addEventListener('keydown',e=>{if(e.key==='ArrowUp')hold.U=1;if(e.key==='ArrowDown')hold.D=1});addEventListener('keyup',e=>{if(e.key==='ArrowUp')hold.U=0;if(e.key==='ArrowDown')hold.D=0});
function subDrop(){const u=G.sub;const bd=bedD(u.x);if(bd-u.y>30)return toast(`Get closer to the seabed (${Math.round(bd-u.y)} m above)`);if(u.cages<=0)return toast('No cages left on the sub');
 if(G.buoys.some(b=>Math.abs(b.x-u.x)<60))return toast('A cage is already set here');u.cages--;
 G.buoys.push({x:u.x,d:density(u.x)*1.3,deep:Math.round(bd),t:0,soak:12+Math.random()*6,cap:1+.3*UL('cages')});sfx.splash();buzz(40);
 toast(`🪤 Baited cage set at ${Math.round(bd).toLocaleString()} m · 📍 buoy marked`)}
function inLight(c){const u=G.sub,L=230+70*UL('lights');const dx=(c.x-u.x)*u.face,dy=Math.abs(c.y-u.y)*PXM;return dx>-20&&dx<L&&dy<dx*.5+30}
function subStun(){const u=G.sub;if(u.cd>0)return;if(u.batt<4)return toast('Battery too low');const c=G.crit.filter(inLight).sort((a,b)=>Math.abs(a.x-u.x)-Math.abs(b.x-u.x))[0];
 u.cd=1.2;u.batt-=3;u.zap={t:.25,c};sfx.zap();buzz(20);if(!c)return toast('Pulse missed – aim the light at a creature');
 const sp=SP(c.k);if((sp.stunReq||0)>UL('stun')){c.dir=Math.sign(c.x-u.x)||1;c.flee=3;return toast(`Too weak! ${sp.n} needs Stun Pulse level ${sp.stunReq}`)}
 c.hp-=1+UL('stun');if(c.hp<=0){c.stun=7;banner('⚡ STUNNED!',900,'#6cf');toast(sp.n+' stunned – GRAB it!')}else{toast(`⚡ Hit! ${sp.n} needs ${Math.ceil(c.hp/(1+UL('stun')))} more`);
  if(sp.fights&&Math.random()<.5){u.hull-=8;banner('🦑 IT FIGHTS BACK!',900,'#f44');sfx.crash();buzz([80,40,80])}else if(sp.flees&&Math.random()<.6){c.dir=Math.sign(c.x-u.x)||1;c.flee=2.5;toast(sp.n+' is fleeing!')}}}
function capTool(sp){return sp.sz<.5?['🫙','SLURP GUN']:sp.sz<1.6?['🕸','NET']:['🦾','CLAW']}
function capTarget(){const u=G.sub;return G.crit.filter(c=>Math.abs(c.x-u.x)<110&&Math.abs(c.y-u.y)<70).sort((a,b)=>Math.abs(a.x-u.x)+Math.abs(a.y-u.y)-Math.abs(b.x-u.x)-Math.abs(b.y-u.y))[0]}
function subClaw(){const u=G.sub;const cap=2+UL('basket');if(u.basket.length>=cap)return toast('🧪 Sample tank full – surface to sell!');
 const c=capTarget();if(!c)return toast('Get closer to a creature to capture it');const sp=SP(c.k),tl=capTool(sp);
 if((sp.stunReq||sp.fights)&&!(c.stun>0)){subStun();return}
 if(tl[1]==='CLAW'&&(sp.claw||1)>UL('claw'))return toast(`Need Claw Arm level ${SP(c.k).claw} for a ${SP(c.k).n}`);
 u.basket.push(c.k);G.crit.splice(G.crit.indexOf(c),1);banner(`${tl[0]} CAPTURED ALIVE!`,1200,'#f2b632');sfx.good();buzz([30,30,60]);toast(`${sp.n} in pressurized tank (${u.basket.length}/${cap}). Surface to sell live!`)}
function subStep(dt){const u=G.sub;G.t+=dt;G.buoys.forEach(b=>b.t+=dt);
 const mv=JOY.x||(hold.R-hold.L),vv=u.asc||u.batt<=0?-1:(JOY.y||(hold.D-hold.U));if(Math.abs(mv)>.2)u.face=Math.sign(mv);
 const th=1+.25*UL('thrust');u.x=Math.max(30,Math.min(4000,u.x+mv*150*th*dt));const bd=bedD(u.x);u.y=Math.max(0,Math.min(bd-6,u.y+vv*(u.asc?380:110)*th*dt));
 u.o2=(u.o2??100)-dt*.12/(1+.3*UL('batt'));if(u.o2<=0&&!u.lowo){u.lowo=1;u.asc=1;banner('🫁 O2 LOW – emergency ascent',1800,'#f44');sfx.alarm()}
 if(u.y>u.rating*1.12&&!u.imp){u.imp=1;u.hull=0}
 if(GK==='mariana'&&u.y>=10800&&!S.tro?.bottom){TROPHY.bottom=['🕳','Reached Challenger Deep'];trophy('bottom');S.money+=500000;banner('🏆 CHALLENGER DEEP! 10,9xx m · +$500,000',3500,'#ffe14d')}
 {const c=capTarget(),bt=$('bHaul');const l=c?(()=>{const sp=SP(c.k),tl=capTool(sp);return (sp.stunReq||sp.fights)&&!(c.stun>0)?`⚡ STUN ${sp.n}`:`${tl[0]} CAPTURE ${sp.n}`})():'🧪 CAPTURE';if(bt.textContent!==l){bt.textContent=l;bt.style.filter=c?'':'grayscale(.7)'}}
 u.batt-=dt*(.5+Math.abs(mv)*.6+Math.abs(vv)*.6+.15*UL('lights'))/(1+.35*UL('batt'));
 if(u.batt<=0&&!u.lowb){u.lowb=1;u.batt=0;banner('🔋 BATTERY DEAD – emergency ascent',1800,'#f44');sfx.alarm()}
 const over=u.y-u.rating;if(over>0){u.hull-=dt*(8+over/u.rating*90)*(1-.2*UL('press'));if(Math.random()<dt*3){sfx.alarm();buzz(80)}}
 if(u.hull<=0){banner('💥 SUB CRUSHED!',2200,'#f44');sfx.crash();buzz([200,100,300]);G.subLost=1;G.sub=null;subUI();return}
 if(u.y<=0.5&&vv<0){subExit();return}if(u.asc){$('toast').style.display='block';$('toast').innerHTML=`⬆ Surfacing… ${Math.round(u.y).toLocaleString()} m`}
 u.cd=Math.max(0,u.cd-dt);fastStep(dt);droneStep(dt);harpStep(dt);if(u.y<1)u.ammo=Math.max(u.ammo,3+UL('harpoon'));for(const c of G.crit){c.ph+=dt;if(c.stun>0){c.stun-=dt;if(c.stun<=0)c.hp=2;continue}const f=c.flee>0?(c.flee-=dt,60):8;c.x+=c.dir*dt*f;if(Math.random()<dt*.1&&!(c.flee>0))c.dir*=-1}
 if(G.fight)fightStep(dt);}
function subCam(){const u=G.sub,dt=Math.min(.05,G.rdt||.016),A=G.boss?H*.66:W>H?H*.5:H*.46;
 if(G.scy==null||G.scSnap){G.scy=u.y;G.scx=u.x-W*.5;G.scSnap=0;G.lk=0}
 G.lk+=((u.face||1)*W*.14-G.lk)*(1-Math.exp(-dt*1.5));const tx=u.x-W*.5+G.lk;const ddx=tx-G.scx,dz=W*.04;if(Math.abs(ddx)>dz)G.scx+=(ddx-Math.sign(ddx)*dz)*(1-Math.exp(-dt*5));
 G.scy+=(u.y-G.scy)*(1-Math.exp(-dt*(u.asc?12:5)));
 const lo=(A-H*.2)/PXM*-1,bd=Math.min(bedD(u.x),bedD(u.x-W*.4),bedD(u.x+W*.4)),hi=bd+30-(H-A)/PXM;let cy=Math.max(lo,Math.min(Math.max(lo,hi),G.scy));
 const ys=A+(u.y-cy)*PXM,t0=H*(W>H?.3:.24),b0=H*(W>H?.66:.62);if(ys<t0)cy=u.y-(t0-A)/PXM;else if(ys>b0)cy=u.y-(b0-A)/PXM;cy=Math.min(cy,Math.max(lo,hi));const y2=A+(u.y-cy)*PXM;{const bm=H*(W>H?.7:.72);if(y2>bm)cy=u.y-(bm-A)/PXM}
 G.scy=cy;return {A,cx:G.scx,cy}}
function subDraw(){const u=G.sub,t=G.t,C=subCam();G.cam=C.cx;const A=C.A,cx=C.cx,cy=C.cy,sy=d=>A+(d-cy)*PXM,sx=x=>x-cx;
 const dk=Math.min(1,u.y/1100);const bg=X.createLinearGradient(0,0,0,H);const top=y=>{const k=Math.min(1,Math.max(0,y/1100));return `rgb(${Math.round(12*(1-k)+2)},${Math.round(70*(1-k)+4)},${Math.round(90*(1-k)+8)})`};
 bg.addColorStop(0,top(cy-A/PXM));bg.addColorStop(1,top(cy+(H-A)/PXM));X.fillStyle=bg;X.fillRect(0,0,W,H);
 const surf=sy(0);if(surf>-40){X.fillStyle='rgba(150,210,230,.35)';X.fillRect(0,surf-4,W,6);X.fillStyle='#0d2a3a';X.fillRect(0,0,W,Math.max(0,surf-4))}
 if(u.y<350){X.globalCompositeOperation='lighter';for(let i=0;i<5;i++){const rx=((i*150-cx*.4+Math.sin(t*.3+i)*30)%(W+200)+W+200)%(W+200)-100;const gr=X.createLinearGradient(0,Math.max(0,surf),0,sy(350));gr.addColorStop(0,'rgba(120,200,210,.12)');gr.addColorStop(1,'rgba(120,200,210,0)');X.fillStyle=gr;X.beginPath();X.moveTo(rx,Math.max(0,surf));X.lineTo(rx+50,Math.max(0,surf));X.lineTo(rx+180,sy(350));X.lineTo(rx+80,sy(350));X.fill()}X.globalCompositeOperation='source-over'}
 // seabed
 X.fillStyle='#0b0d0c';X.beginPath();X.moveTo(0,H);for(let x=0;x<=W+10;x+=10)X.lineTo(x,sy(bedD(x+cx)));X.lineTo(W,H);X.fill();
 X.fillStyle='#1a1a16';for(let x=0;x<=W;x+=14){const y=sy(bedD(x+cx));X.fillRect(x+((x*7)%5),y+2+((x*13)%7),3,2)}
 // crab clusters
 for(const h of G.hs){const n=Math.round(h.q*7);for(let i=0;i<n;i++){const x=h.x+(i-n/2)*h.r*.12,X0=sx(x);if(X0<-40||X0>W+40)continue;const y=sy(bedD(x));const s=(bedD(x)>900?1.5:1)*SCL;
   if(IMG.goldcrab.complete)X.drawImage(IMG.goldcrab,X0-s/2,y-s*.5,s,s*.57)}}
 // cages
 for(const b of G.buoys)if(b.deep){const X0=sx(b.x),y=sy(b.deep);X.strokeStyle='rgba(200,190,150,.45)';X.beginPath();X.moveTo(X0,y-12);X.lineTo(X0,sy(0));X.stroke();X.strokeStyle='#b8a46a';X.lineWidth=2;X.strokeRect(X0-14,y-16,28,16);X.lineWidth=1;
  X.fillStyle='#f2b632';X.font='bold 10px sans-serif';X.fillText('📍'+(b.t>=b.soak?'FULL':Math.ceil(b.soak-b.t)+'s'),X0-16,y-20)}
 lifeStep(G,1/60);drawLife(G,sx,f=>sy(LIFE[f.k].w?bedD(f.x):f.f*Math.min(bedD(f.x)-10,GK==='abyss'?bedD(f.x):(GDEPTH[GK]||120)*1.6)),SCL);
 // creatures (realistic size: SCL px per meter, min 10px so tiny ones stay visible)
 for(const c of G.crit){const sp=SP(c.k),X0=sx(c.x),Y0=sy(c.y);if(X0<-300||X0>W+300||Y0<-300||Y0>H+300)continue;const s=Math.max(10,sp.sz*SCL);
  X.save();X.translate(X0,Y0+Math.sin(c.ph*2)*3);X.scale(c.dir,1);if(sp.img&&IMG[sp.img].complete){const im=IMG[sp.img];if(c.stun>0)X.drawImage(im,-s/2,-s*im.height/im.width/2,s,s*im.height/im.width);else drawWarp(im,s,s*im.height/im.width,c.ph,s*.04)}
  else{X.fillStyle=sp.col;X.beginPath();X.ellipse(0,0,s/2,s/4,0,0,7);X.fill();X.beginPath();X.moveTo(-s/2,0);X.lineTo(-s*.75,-s/5);X.lineTo(-s*.75,s/5);X.fill()}X.restore()}
 for(const f of G.fast||[]){if(f.caught)continue;const X0=sx(f.x),Y0=sy(f.y);if(X0<-80||X0>W+80||Y0<-60||Y0>H+60)continue;X.save();X.translate(X0,Y0);X.scale(f.dir,1);drawFish(SP(f.k),SP(f.k).sz*SCL,f.ph);X.restore()}
 if(u.drone){const d=u.drone,X0=sx(d.x),Y0=sy(d.y);X.fillStyle='#e8c030';X.beginPath();X.ellipse(X0,Y0,13,6,0,0,7);X.fill();X.fillStyle='#333';X.fillRect(X0-15,Y0-2,4,4);if(d.net>0){X.strokeStyle='#fff';X.beginPath();X.arc(X0,Y0,16,0,d.net/.8*6.28);X.stroke()}if(d.load){X.fillStyle='#f2b632';X.fillText('🐟',X0-6,Y0-10)}}
 if(u.harp){const h=u.harp,k=Math.min(1,h.t),hx=sx(h.x+(h.tx-h.x)*k),hy=sy(h.y+(h.ty-h.y)*k);X.strokeStyle='#ccc';X.lineWidth=1;X.beginPath();X.moveTo(sx(u.x+u.face*60),sy(u.y));X.lineTo(hx,hy);X.stroke();X.fillStyle='#ddd';X.fillRect(hx-4,hy-1,8,2)}
 // darkness mask with headlight cone
 const M=G.mask||(G.mask=document.createElement('canvas'));if(M.width!==W){M.width=W;M.height=H}const m=M.getContext('2d');m.globalCompositeOperation='source-over';m.clearRect(0,0,W,H);
 const da=Math.min(.86,.15+u.y/900);m.fillStyle=`rgba(0,0,0,${da})`;m.fillRect(0,0,W,H);m.globalCompositeOperation='destination-out';
 const bx=sx(u.x),by=sy(u.y),L=230+70*UL('lights'),nx=bx+u.face*70;const cg=m.createRadialGradient(nx,by,10,nx,by,L);cg.addColorStop(0,'rgba(0,0,0,1)');cg.addColorStop(1,'rgba(0,0,0,0)');m.fillStyle=cg;
 m.beginPath();m.moveTo(nx,by-6);m.lineTo(nx+u.face*L,by-L*.42);m.lineTo(nx+u.face*L,by+L*.48);m.closePath();m.fill();
 const hg=m.createRadialGradient(bx,by,0,bx,by,120);hg.addColorStop(0,'rgba(0,0,0,.8)');hg.addColorStop(1,'rgba(0,0,0,0)');m.fillStyle=hg;m.fillRect(bx-120,by-120,240,240);X.drawImage(M,0,0,W,H);
 // warm beam haze
 X.globalCompositeOperation='lighter';const wg=X.createRadialGradient(nx,by,5,nx,by,L);wg.addColorStop(0,'rgba(255,220,140,.35)');wg.addColorStop(1,'rgba(255,200,120,0)');X.fillStyle=wg;X.beginPath();X.moveTo(nx,by-6);X.lineTo(nx+u.face*L,by-L*.42);X.lineTo(nx+u.face*L,by+L*.48);X.fill();
 // bioluminescent + marine snow
 for(const p of u.snow){p.y-=(JOY.y||hold.D-hold.U)*p.z*2-.15*p.z;p.x-=(JOY.x||hold.R-hold.L)*p.z*2;p.x=(p.x+W)%W;p.y=(p.y+H)%H;X.globalAlpha=p.c==='#fff'?.25*p.z:.5+.4*Math.sin(t*3+p.x);X.fillStyle=p.c;X.fillRect(p.x,p.y,p.c==='#fff'?1.5:2.5,p.c==='#fff'?1.5:2.5)}
 for(const c of G.crit){const sp=SP(c.k);if(!sp.glow)continue;const X0=sx(c.x),Y0=sy(c.y);if(X0<-50||X0>W+50)continue;const gg=X.createRadialGradient(X0,Y0,0,X0,Y0,14);gg.addColorStop(0,sp.glow);gg.addColorStop(1,'rgba(0,0,0,0)');X.globalAlpha=.6+.4*Math.sin(t*4+c.ph);X.fillStyle=gg;X.fillRect(X0-14,Y0-14,28,28)}
 X.globalAlpha=1;X.globalCompositeOperation='source-over';
 X.strokeStyle='rgba(120,140,120,.35)';X.lineWidth=1.5;X.beginPath();for(let x=0;x<=W+10;x+=10){const y=sy(bedD(x+cx));x?X.lineTo(x,y):X.moveTo(x,y)}X.stroke();
 for(const c of G.crit){const X0=sx(c.x),Y0=sy(c.y);if(Math.abs(c.x-u.x)<L&&Math.abs(c.y-u.y)<90&&(c.x-u.x)*u.face>-60){X.fillStyle='#f2b632';X.font='bold 11px sans-serif';X.fillText(SP(c.k).n+' · '+fm(todayPrice(SP(c.k))),X0-40,Y0-Math.max(14,SP(c.k).sz*SCL*.3))}}
 if(u.zap&&u.zap.t>0){u.zap.t-=1/60;X.strokeStyle='#9ef';X.lineWidth=2;X.beginPath();const tx=u.zap.c?sx(u.zap.c.x):bx+u.face*200,ty=u.zap.c?sy(u.zap.c.y):by;X.moveTo(nx,by);for(let i=1;i<=6;i++)X.lineTo(nx+(tx-nx)*i/6+(Math.random()-.5)*14,by+(ty-by)*i/6+(Math.random()-.5)*14);X.stroke()}
 for(const c of G.crit)if(c.stun>0){const X0=sx(c.x),Y0=sy(c.y);X.fillStyle='#9ef';X.font='12px sans-serif';X.fillText('⚡💫',X0-10,Y0-14)}
 // sub sprite
 const im=IMG.sub;if(im.complete){const w=154,h=w*im.height/im.width;X.save();u.flip=(u.flip??1)+(u.face-(u.flip??1))*.12;X.translate(bx,by+Math.sin(t*2)*2);X.scale(Math.abs(u.flip)<.08?.08*Math.sign(u.flip||1):u.flip,1);X.drawImage(im,-w/2,-h/2,w,h);X.restore()}
 if(u.basket.length){X.fillStyle='#f2b632';X.font='bold 11px sans-serif';X.fillText('🧺 '+u.basket.length+'/'+(2+UL('basket')),bx-20,by+46)}
 // radar
 const R=46,rx=W-R-12,ry=H*.30;X.fillStyle='rgba(5,12,10,.85)';X.strokeStyle='#3d5a3d';X.lineWidth=1;X.beginPath();X.arc(rx,ry,R,0,7);X.fill();X.stroke();X.beginPath();X.arc(rx,ry,R/2,0,7);X.stroke();
 const sw=t*2%(Math.PI*2);X.strokeStyle='#b8f040';X.beginPath();X.moveTo(rx,ry);X.lineTo(rx+Math.cos(sw)*R,ry+Math.sin(sw)*R);X.stroke();
 const blip=(x,y,c)=>{const dx=(x-u.x)/12,dy=(y-u.y)*PXM/12;if(dx*dx+dy*dy<R*R){X.fillStyle=c;X.fillRect(rx+dx-1.5,ry+dy-1.5,3,3)}};
 for(const h of G.hs)blip(h.x,bedD(h.x),'#f90');for(const c of G.crit){const r=SP(c.k).r;if(r>=.2||UL('subsonar')>=(r<.1?2:1))blip(c.x,c.y,r<.2?'#f4f':'#6cf')}for(const b of G.buoys)if(b.deep)blip(b.x,b.deep,'#f2b632');
 X.fillStyle='#9a9';X.font='10px sans-serif';X.fillText('SONAR',rx-16,ry+R+12);
 // vignette
 const vg=X.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.6)');X.fillStyle=vg;X.fillRect(0,0,W,H);
 // HUD
 const pr=u.y/u.rating,bd=bedD(u.x);
 $('sonar').innerHTML=`<div class="row"><div><small>DEPTH</small> <b class="gold" style="font-size:24px">${Math.round(u.y).toLocaleString()} m</b></div><div style="text-align:right"><small>PRESSURE</small> <b class="${pr>1?'dn':''}">${Math.round(u.y*.0993+1).toLocaleString()} atm</b> <small>${Math.round((u.y*.0993+1)*14.7).toLocaleString()} psi</small></div></div><div class="row" style="font-size:11px"><span>${u.y<200?'☀️ Sunlight':u.y<1000?'🌆 Twilight':u.y<4000?'🌑 Midnight':u.y<6000?'⬛ Abyssal':'🕳 Hadal'} zone</span><span>🌡 ${(u.y<200?18-u.y*.05:u.y<1000?8-(u.y-200)*.005:Math.max(1.1,4-(u.y-1000)*.0006)).toFixed(1)}°C · 🫁 O2 ${Math.round(u.o2??100)}% · ⬆ ${Math.ceil(u.y/80/60)} min up</span></div>${pr>.85&&pr<=1?'<div class=dn style="font-size:11px">⚠ HULL STRESS – creaking! near rated depth</div>':''}
 <div class="bar" style="height:9px"><i style="width:${Math.min(100,pr*100)}%;background:${pr>1?'#e33':pr>.8?'linear-gradient(90deg,#d9a520,#e33)':'#d9a520'}"></i></div>
 <div class="row" style="font-size:11px;margin-top:3px"><span class="${pr>1?'dn':''}">${pr>1?'⚠ CRITICAL – CRUSH DEPTH':'Rated '+u.rating.toLocaleString()+' m'}</span><span>🔋${Math.max(0,Math.round(u.batt))}% · 🛡${Math.round(u.hull)}% · 🧪${u.basket.length}/${2+UL('basket')} · 🪤${u.cages} · bed ${Math.round(bd-u.y)} m</span></div>`}
// hook into loop/actions
{const oDrop=$('bDrop').onclick,oHaul=$('bHaul').onclick,oHome=$('bHome').onclick;
 $('bDrop').onclick=()=>G&&G.sub?subDrop():oDrop();$('bHaul').onclick=()=>G&&G.sub?subClaw():oHaul();$('bHome').onclick=()=>{if(G&&G.sub){G.sub.asc=1;toast('Ascending…')}else oHome()}}

// ---- joystick ----
const JOY={x:0,y:0,id:null};{const j=$('joy'),k=$('knob');const mv=e=>{const r=j.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const R=r.width/2-20,d=Math.hypot(dx,dy);if(d>R){dx*=R/d;dy*=R/d}
 JOY.x=Math.abs(dx)<8?0:dx/R;JOY.y=Math.abs(dy)<8?0:dy/R;k.style.transform=`translate(${dx}px,${dy}px)`};
 j.addEventListener('pointerdown',e=>{e.preventDefault();JOY.id=e.pointerId;try{j.setPointerCapture(e.pointerId)}catch(_){}mv(e)});j.addEventListener('pointermove',e=>{if(e.pointerId===JOY.id)mv(e)});
 const end=e=>{if(e.pointerId!==JOY.id)return;JOY.id=null;JOY.x=JOY.y=0;k.style.transform=''};j.addEventListener('pointerup',end);j.addEventListener('pointercancel',end);j.addEventListener('lostpointercapture',end)}
$('bSurf').onclick=()=>{if(G&&G.sub){G.sub.asc=1;sfx.good();buzz(30)}};
// ---- route bar / autopilot ----
function nextHot(){const g=G;const free=g.hs.filter(h=>!g.buoys.some(b=>Math.abs(b.x-h.x)<h.r));const L=(free.length?free:g.hs).slice().sort((a,b)=>Math.abs(a.x-g.x)-Math.abs(b.x-g.x));return L.find(h=>Math.abs(h.x-g.x)>40)||L[0]}
$('bGo').onclick=()=>{if(!G||G.sub)return;const h=nextHot();G.auto=h.x;G.autoPort=0;toast(`⛵ Sailing to hotspot · ${((Math.abs(h.x-G.x))/40).toFixed(1)} nm`)};
$('bPort').onclick=()=>{if(!G||G.sub)return;if(G.buoys.length)toast(`⚠ ${G.buoys.length} pot(s)/cage(s) still out – lost if you leave ($350 each)`,2200);G.auto=60;G.autoPort=1};
function near(b){return Math.abs(b.x-G.x)<70}
function updCtl(){const g=G;if(!g)return;const sub=!!g.sub,sh=(id,v)=>{const e=$(id);const d=v?(id==='route'||id==='joy'?'block':''):'none';if(e.style.display!==d)e.style.display=d};
 sh('bL',!sub);sh('bSkip',!sub&&isNight(g));if(!sub){sh('bStun',0);sh('bHarp',0);sh('bDrone',0)}sh('bR',!sub);sh('joy',sub);sh('bSurf',sub);sh('route',!sub);sh('bIce',!sub&&g.ice>8);sh('bSub',!sub&&g.b.sub&&!g.subLost);
 if(sub){const u=g.sub;sh('bDrop',u.cages>0&&bedD(u.x)-u.y<30&&!u.asc);sh('bHaul',!!capTarget()&&!u.asc);sh('bStun',UL('stun')>=0&&g.crit.some(inLight));sh('bHarp',UL('harpoon')>0);$('bHarp').textContent=u.rl>0?'🎯 RELOAD':'🎯 HARPOON '+u.ammo;sh('bDrone',UL('drone')>0&&!u.drone&&u.y<260&&(G.fast||[]).some(f=>!f.caught));$('bStun').textContent=u.cd>0?'⚡ …':'⚡ STUN';$('bSurf').textContent=u.asc?'⬆ SURFACING…':'⬆ SURFACE'}
 else{const nb=g.buoys.find(near);sh('bDrop',g.pots>0&&!nb&&!g.haul&&!g.fight&&!g.winch);sh('bHaul',!!nb&&!g.haul&&!g.fight&&!g.winch);
  if(nb)$('bHaul').textContent=nb.t>=nb.soak?(nb.rod?'🎣 REEL IN':'⚙ HAUL'+(nb.deep?' CAGE':'')):'⏳ '+Math.ceil(nb.soak-nb.t)+'s';
  const P=x=>Math.max(1,Math.min(99,x/4000*100))+'%';let hp='<div id="rline"></div><span class="pin" style="left:2%">⚓</span>';
  for(const h of g.hs)hp+=`<span class="pin" style="left:${P(h.x)};font-size:${10+h.q*8}px">🔥</span>`;for(const b of g.buoys)hp+=`<span class="pin" style="left:${P(b.x)};top:14px;font-size:12px">📍</span>`;
  {let pts='';for(let x=0;x<=4000;x+=200)pts+=`${x/40},${30-Math.min(28,Math.log(1+sdep(x))/Math.log(1+(DEEP[GK]||3000))*27)} `;hp+=`<svg viewBox="0 0 100 30" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%"><polygon points="0,0 ${pts} 100,0" fill="rgba(20,60,90,.55)"/><polyline points="${pts}" fill="none" stroke="#8a7a5a" stroke-width="1"/></svg>`}hp+=`<span class="pin" style="left:${P(g.x)};top:1px;font-size:20px">⛴</span>`;if(g._hp!==hp){$('rmap').innerHTML=hp;g._hp=hp}
  const h=nextHot();const hn=(Math.abs(h.x-g.x)/40).toFixed(1),pn=(g.x/40).toFixed(1);$('bGo').textContent=g.auto!=null&&!g.autoPort?'⛵ SAILING…':`⛵ HOTSPOT ${hn} nm`;$('bPort').textContent=g.autoPort?'⚓ HOMEWARD…':`⚓ PORT ${pn} nm`;
  $('rsum').textContent=(g.autoPort?'⚓ Heading home ':g.auto!=null?'⛵ Sailing… ':'🔥 '+hn+'nm · ⚓ '+pn+'nm ')+($('route').classList.contains('open')?'▲':'▼')}
  document.body.classList.toggle('sub',sub);}
const PRI=['bSurf','bHaul','bDrop','bStun','bHarp','bDrone','bIce','bSub','bSkip'];
function limitActs(){let n=0;const mx=G&&G.sub&&W<H?2:3;for(const id of PRI){const e=$(id);if(e.style.display!=='none'&&getComputedStyle(e).display!=='none'){n++;if(n>mx)e.style.display='none'}}}
setInterval(()=>{updCtl();if(G)limitActs()},150);
$('rsum').onclick=()=>$('route').classList.toggle('open');$('bGo').addEventListener('click',()=>$('route').classList.remove('open'));$('bPort').addEventListener('click',()=>$('route').classList.remove('open'));
$('bEye').onclick=()=>{document.body.classList.toggle('nohud');$('bEye').textContent=document.body.classList.contains('nohud')?'🙈':'👁'};
$('bStun').onclick=()=>G&&G.sub&&subStun();

// ---- realistic specs (approx. industry figures) -> gameplay ----
const SPECS={skiff:{L:"22 ft",hold:1500,real:"6 pots",gal:60,crew:2,kn:20,tripGal:40,potLb:3,price:4500},
 crabber:{L:"58 ft (used)",hold:40000,real:"60 pots (7×7 ft)",gal:6000,crew:4,kn:10,tripGal:1500,potLb:25,price:150000},
 ironTitan:{L:"165 ft",hold:250000,real:"220 pots",gal:40000,crew:7,kn:11,tripGal:8000,potLb:60,price:2500000},
 longliner:{L:"125 ft freezer longliner",hold:400000,real:"40,000 hooks",gal:50000,crew:20,kn:11,tripGal:6000,potLb:60,price:1800000},
 trawler:{L:"75 ft shrimp trawler",hold:60000,real:"4 nets on outriggers",gal:15000,crew:4,kn:9,tripGal:2500,potLb:30,price:600000},
 seiner:{L:"230 ft purse seiner",hold:2400000,real:"1.5 km purse seine (1,200 short tons)",gal:300000,crew:25,kn:15,tripGal:30000,potLb:600,price:8000000},
 dyscovery1:{L:"328 ft (100 m) research vessel",hold:300000,real:"160 cages + deep-sea submersible",gal:400000,crew:40,kn:13,tripGal:15000,potLb:50,price:25000000}};
const ENDUR={skiff:1,crabber:7,ironTitan:21,longliner:30,trawler:14,seiner:60,dyscovery1:45};
for(const k in SPECS){const p=SPECS[k];p.days=ENDUR[k];Object.assign(BOATS[k],{price:p.price,potLb:p.potLb,crew:p.crew,hold:p.hold,spec:p})}
BOATS.crabber.pots=12;BOATS.ironTitan.pots=20;BOATS.dyscovery1.pots=16;

// ---- swimming: draw image in vertical slices with sine warp (tail wag) ----
function drawWarp(im,w,h,ph,amp){const N=8,sw=im.width/N;for(let i=0;i<N;i++){const f=i/N,off=Math.sin(ph*6+f*3)*amp*(1-f)*(1-f);X.drawImage(im,i*sw,0,sw+1,im.height,-w/2+f*w,-h/2+off,w/N+1,h)}}
function drawFish(sp,len,ph){const L=len,Hh=L*(sp.k==='mahi'?.32:.22),wag=Math.sin(ph*9)*L*.12;X.fillStyle=({sailfish:'#1d3f6b',marlin:'#163050',bluefin:'#1b2b45',yellowfin:'#24405e',mahi:'#2f8a4a'})[sp.k];
 X.beginPath();X.moveTo(L/2,0);X.quadraticCurveTo(L*.1,-Hh,-L*.32,-Hh*.25);X.lineTo(-L*.5,-Hh*.8+wag);X.lineTo(-L*.42,wag*.5);X.lineTo(-L*.5,Hh*.8+wag);X.lineTo(-L*.32,Hh*.25);X.quadraticCurveTo(L*.1,Hh,L/2,0);X.fill();
 X.fillStyle=sp.k==='yellowfin'||sp.k==='mahi'?'#e6c640':'#9ab';X.fillRect(-L*.2,-Hh*.05,L*.5,Hh*.12);
 if(sp.k==='sailfish'){X.fillStyle='rgba(40,80,150,.8)';X.beginPath();X.moveTo(L*.3,-Hh*.6);X.quadraticCurveTo(0,-Hh*3,-L*.25,-Hh*.4);X.fill()}
 if(sp.k==='sailfish'||sp.k==='marlin'){X.strokeStyle=X.fillStyle;X.lineWidth=2;X.beginPath();X.moveTo(L/2,0);X.lineTo(L*.78,-2);X.stroke()}}
function fastStep(dt){const u=G.sub;if(!G.fast)return;const leads={};for(const f of G.fast){const sp=SP(f.k);f.ph+=dt;if(f.caught)continue;
  if(f.lead){const d=u.drone,thr=d&&Math.hypot(d.x-f.x,d.y-f.y)<160;if(thr){f.dir=Math.sign(f.x-d.x)||1;f.vy=Math.sign(f.y-d.y)*sp.spd*.3}else f.vy=(f.vy||0)*.98;f.x+=f.dir*(thr?sp.spd:sp.spd*.25)*dt;f.y=Math.max(8,Math.min(220,f.y+(f.vy||0)*dt+Math.sin(f.ph)*6*dt));if(f.x<40||f.x>3960)f.dir*=-1;leads[f.grp]=f}}
 for(const f of G.fast){if(f.lead||f.caught)continue;const L=leads[f.grp];if(!L)continue;const tx=L.x-L.dir*Math.abs(f.ox)+Math.sin(f.ph*2)*8,ty=L.y+f.oy+Math.cos(f.ph*1.7)*6;f.x+=(tx-f.x)*Math.min(1,dt*3);f.y+=(ty-f.y)*Math.min(1,dt*3);f.dir=L.dir}}
function droneLaunch(){const u=G.sub;if(UL('drone')<1)return toast('Buy the Drone Sub upgrade');if(u.drone)return;if(u.y>260)return toast('Fast fish swim near the surface – rise above 250 m');
 u.drone={x:u.x+u.face*40,y:u.y,vx:0,vy:0,batt:8+4*UL('drone'),net:0,tgt:null,ret:0};sfx.good();toast('🛸 Drone out! It chases the nearest fast fish – steer with the joystick to help')}
function droneStep(dt){const u=G.sub,d=u.drone;if(!d)return;d.batt-=dt;const sp=230+45*UL('drone');
 if(!d.ret){if(!d.tgt||d.tgt.caught){d.tgt=G.fast.filter(f=>!f.caught).sort((a,b)=>Math.hypot(a.x-d.x,a.y-d.y)-Math.hypot(b.x-d.x,b.y-d.y))[0]}
  const t=d.tgt;if(t){let ax=t.x-d.x,ay=t.y-d.y;const n=Math.hypot(ax,ay)||1;ax=ax/n+(JOY.x||0)*.8;ay=ay/n+(JOY.y||0)*.8;d.vx+=(ax*sp-d.vx)*dt*3;d.vy+=(ay*sp-d.vy)*dt*3;
   if(n<26){d.net+=dt;if(d.net>.8){t.caught=1;const s2=SP(t.k);d.load={k:t.k,wt:Math.round(s2.w[0]+Math.random()*(s2.w[1]-s2.w[0]))};d.ret=1;banner('🕸 NETTED!',1000,'#f2b632');sfx.good();buzz([30,30,60])}}else d.net=Math.max(0,d.net-dt*.5)}
  if(d.batt<=0){d.ret=1;toast('🛸 Drone battery low – returning')}}
 else{let ax=u.x-d.x,ay=u.y-d.y;const n=Math.hypot(ax,ay)||1;d.vx+=(ax/n*sp-d.vx)*dt*3;d.vy+=(ay/n*sp-d.vy)*dt*3;if(n<30){if(d.load){G.by[d.load.k]=(G.by[d.load.k]||0)+d.load.wt;G.catch+=d.load.wt;toast(`🛸 Drone delivered ${d.load.wt} lb ${SP(d.load.k).n} to the boat`)}u.drone=null;return}}
 d.x+=d.vx*dt;d.y=Math.max(2,d.y+d.vy*dt)}
function harpoonFire(){const u=G.sub;if(UL('harpoon')<1)return toast('Buy the Harpoon Gun upgrade');if(u.rl>0||u.harp)return;if(u.ammo<=0)return toast('Out of harpoons – surface to reload');
 const R=220+80*UL('harpoon');const all=G.crit.concat(G.fast.filter(f=>!f.caught));const c=all.filter(c=>{const dx=(c.x-u.x)*u.face;return dx>0&&dx<R&&Math.abs(c.y-u.y)*PXM<dx*.4+30}).sort((a,b)=>Math.abs(a.x-u.x)-Math.abs(b.x-u.x))[0];
 u.ammo--;u.rl=2;sfx.harpoon();buzz(30);u.harp={x:u.x+u.face*60,y:u.y,tx:c?c.x:u.x+u.face*R,ty:c?c.y:u.y,c,t:0}}
function harpStep(dt){const u=G.sub,h=u.harp;u.rl=Math.max(0,u.rl-dt);if(!h)return;h.t+=dt*3;if(h.t<1)return;u.harp=null;const c=h.c;if(!c)return toast('Missed!');const sp=SP(c.k);
 if(sp.fast){c.caught=1;const wt=Math.round(sp.w[0]+Math.random()*(sp.w[1]-sp.w[0]));G.by[c.k]=(G.by[c.k]||0)+wt;G.catch+=wt;banner('🎯 HARPOONED!',1000,'#f2b632');return toast(`+${wt} lb ${sp.n} reeled in`)}
 if((sp.stunReq||0)>UL('harpoon'))return toast(`Bounced off! ${sp.n} needs Harpoon level ${sp.stunReq}`);c.hp-=2+UL('harpoon');
 if(c.hp<=0){const cap=2+UL('basket');if(u.basket.length>=cap)return toast('Basket full – it escaped');u.basket.push(c.k);G.crit.splice(G.crit.indexOf(c),1);banner('🎯 REELED IN!',1000,'#f2b632');toast(sp.n+' in the basket')}
 else{toast(`🎯 Hit! ${sp.n} still fighting`);if(sp.fights&&Math.random()<.5){u.hull-=8;banner('IT FIGHTS BACK!',900,'#f44')}else{c.dir=Math.sign(c.x-u.x)||1;c.flee=2}}}
$('bHarp').onclick=()=>G&&G.sub&&harpoonFire();$('bDrone').onclick=()=>G&&G.sub&&droneLaunch();

const HOURSEC=2.5;function tripHours(g){return g.t/HOURSEC+(g.skipH||0)}
function clockStr(g){const h=6+tripHours(g);const d=Math.floor(h/24)+1,hh=Math.floor(h%24),mm=Math.floor((h*60)%60);return `Day ${d} · ${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`}
function isNight(g){const hh=(6+tripHours(g))%24;return hh>=21||hh<5}
function skipNight(){const g=G;if(!g||g.sub)return;const h=(6+tripHours(g))%24;const add=h>=21?24-h+6:6-h;g.skipH=(g.skipH||0)+add;g.buoys.forEach(b=>b.t+=add*HOURSEC*4);g.fatigue=Math.max(0,(g.fatigue||0)-60);g.fuel-=add*.05*g.maxF/100;banner('🌅 Morning – crew rested',1500,'#ffd27a');toast(`⏩ Skipped ${add.toFixed(1)} h · pots soaked overnight`)}
$('bSkip').onclick=skipNight;

// ================= FLEET / TYCOON =================
const TIERS=[['Deckhand',0],['Skipper',2],['Captain',5],['Fleet Owner',10],['Seafood Tycoon',20],['Ocean Empire',35]];
function tier(){const n=S.ordersDone||0;let t=0;TIERS.forEach((x,i)=>{if(n>=x[1])t=i});return t}
function fleetRun(days,g){S.fleet=S.fleet||{};const lines=[];let net=0;for(const k of S.owned){if(k===S.boat)continue;const f=S.fleet[k];if(!f||!f.cap||!f.ground)continue;const b=BOATS[k],gr=GROUNDS[f.ground];if(gr.sub&&!b.sub)continue;
  const capt=crewOf(k).find(m=>m.r===4),cs=capt?Math.min(100,80+capt.xp/50):30;const fcl=forecast(0).lv,risk=[.01,.02,.05,.1,.18][fcl]*(1-b.stab*.5)*(1.3-cs/150);f.morale=f.morale??70;
  if(Math.random()<risk*.25){const c=Math.round(b.price*.08);net-=c;lines.push([`🆘 ${b.name}: damaged in storm, towed in`,-c]);f.morale-=15;continue}
  const tripD=Math.min(days,b.spec.days),fillPct=Math.min(1,(.08+Math.random()*.22)*tripD/Math.max(1,b.spec.days*.5))*(.7+f.morale/250)*(.7+sk/200);const lbs=Math.round(b.hold*fillPct);
  let gross=0;const mix=gr.mix;for(const [sk,p] of mix)gross+=lbs*p*todayPrice(SP(sk));
  const sk=crewSkill(k);const costs=gross*crewShare(k)+b.spec.tripGal*tripD/b.spec.days*3.6+35*b.crew*tripD+b.price*.0007*tripD+f.capPay*tripD;const p=gross-costs;net+=p;f.morale=Math.max(10,Math.min(100,f.morale+(p>0?5:-10)));f.last=p;crewGain(k,tripD,p>0);
  lines.push([`${b.name} @ ${gr.n}: ${lbs.toLocaleString()} lb · ${tripD} d · morale ${Math.round(f.morale)}%`,p])}
 return {lines,net}}
function company(){show('sCo');S.fleet=S.fleet||{};const t=tier();$('coHead').innerHTML=`<div class=row style="margin-bottom:4px"><small>🦺 Safety reputation <b>${Math.round(S.safety??70)}</b>/100</small><small>Hiring season ${season()}</small></div>`+`<div class=row><div><small>COMPANY BANK</small><div class=money>${fm(S.money)}</div></div><div style="text-align:right"><small>RANK</small><div class=gold><b>${TIERS[t][0]}</b></div><small>${t<TIERS.length-1?`${S.ordersDone||0}/${TIERS[t+1][1]} orders → ${TIERS[t+1][0]}`:'MAX'}</small></div></div>
 <div class=row style="margin-top:6px"><small>📅 Day ${S.day||1}</small><small>⭐ Rep ${S.rep??50}</small><small>Lifetime profit ${fm(S.life||0)}</small></div>`+(S.lastExp?`<small style="opacity:.75">Last trip costs – fuel ${fm(S.lastExp.fuel)} · crew ${fm(S.lastExp.crew)} · food ${fm(S.lastExp.food)} · bait ${fm(S.lastExp.bait)} · maint ${fm(S.lastExp.maint)} · insurance ${fm(S.lastExp.ins)}</small>`:'');
 const L=$('coFleet');L.innerHTML='';for(const k of Object.keys(BOATS)){const b=BOATS[k],own=S.owned.includes(k),f=S.fleet[k]||(S.fleet[k]={});const d=document.createElement('div');d.className='card';
  const st=!own?'Not owned':k===S.boat?'🧑‍✈️ You are skipper':f.cap&&f.ground?`🌊 Fishing ${GROUNDS[f.ground].n}`:f.cap?'⚓ Docked (assign a map)':'⚓ Docked (no captain)';
  d.innerHTML=`<div class=row><b>${b.name}</b><small>${st}</small></div><small>${b.spec.L} · hold ${b.hold.toLocaleString()} lb · crew ${b.crew} · endurance ${b.spec.days} d${f.last!=null?` · last trip <span class=${f.last>=0?'up':'dn'}>${fm(f.last)}</span>`:''}${f.morale!=null?` · morale ${Math.round(f.morale)}%`:''}</small><div class=row style="margin-top:6px;gap:6px"></div>`;
  const row=d.querySelector('.row:last-child');
  if(!own){const bt=document.createElement('button');bt.className='btn';bt.textContent='Buy '+fm(b.price);bt.disabled=S.money<b.price;bt.onclick=()=>{S.money-=b.price;S.owned.push(k);sfx.cash();pickCaptain(k).then(()=>{save();company()})};row.appendChild(bt)}
  else{const sel=document.createElement('select');sel.style.cssText='flex:1;min-height:48px;background:#111;color:#f3d27a;border:1px solid #7a6330;border-radius:10px;font-size:15px';sel.innerHTML='<option value="">— assign map —</option>'+Object.keys(GROUNDS).filter(gk=>!GROUNDS[gk].sub||b.sub).map(gk=>`<option value=${gk} ${f.ground===gk?'selected':''}>${GROUNDS[gk].n}</option>`).join('');sel.onchange=()=>{f.ground=sel.value;save();company()};row.appendChild(sel);
   if(!f.cap){const pay=Math.round(150+b.crew*60);const bt=document.createElement('button');bt.className='btn green';bt.textContent=`Hire captain ${fm(pay*10)}`;bt.disabled=S.money<pay*10;bt.onclick=()=>{S.money-=pay*10;f.cap=1;f.capPay=pay;f.morale=70;sfx.cash();save();company()};row.appendChild(bt)}
   if(k!==S.boat){const bt=document.createElement('button');bt.className='btn blue';bt.textContent='Skipper this';bt.onclick=()=>{S.boat=k;S.test=0;save();company()};row.appendChild(bt)}}
  if(own){const c=crewOf(k),cl=document.createElement('details');cl.innerHTML=`<summary style="padding:8px 0;font-size:15px">👥 Crew (${c.length}) · skill ${Math.round(crewSkill(k))} · share ${Math.round(crewShare(k)*100)}%</summary>`;
   c.forEach((m,i)=>{const nx=RANKS[m.r+1],need=nx?nx[2]:null,row=document.createElement('div');row.className='row';row.style.cssText='padding:4px 0;border-top:1px solid #222';
    row.innerHTML=`<div style="flex:1"><b>${m.n}</b> <small class=gold>${RANKS[m.r][0]}</small><div class="bar" style="height:6px"><i style="width:${need?Math.min(100,m.xp/need*100):100}%;background:#d9a520"></i></div><small>XP ${Math.round(m.xp)}${need?'/'+need:''} · share ${(RANKS[m.r][1]*100).toFixed(1)}% · morale ${Math.round(m.m)}%</small><br><small>${m.att==='good'?'😊 Good attitude':'😠 Bad attitude'} · 📚 Discipline ${Math.round(m.disc*100)} · ${m.reck>.5?'<span class=dn>⚠ Reckless '+Math.round(m.reck*100)+'</span>':'🦺 Careful'}${m.out>0?' · <span class=dn>🤕 out '+m.out+' d</span>':''}</small></div>`;
    if(nx){const bt=document.createElement('button');bt.className='btn green';bt.style.cssText='min-width:0;min-height:48px;padding:6px 10px;font-size:12px';bt.textContent='Promote';bt.disabled=m.xp<need;bt.onclick=()=>{m.r++;m.m=Math.min(100,m.m+15);sfx.good();save();company()};row.appendChild(bt)}
    const fb=document.createElement('button');fb.className='btn gray';fb.style.cssText='min-width:0;min-height:48px;padding:6px 10px;font-size:12px';fb.textContent='Fire';fb.onclick=async()=>{if(!await ask(`Fire <b>${m.n}</b>? A greenhorn will replace them.`,'Fire','Keep'))return;c.splice(c.indexOf(m),1);crewOf(k);save();company()};row.appendChild(fb);cl.appendChild(row)});d.appendChild(cl)}
  L.appendChild(d)}L.insertBefore(poolCard(),L.firstChild)}
$('bCo').onclick=company;$('bCoBack').onclick=dock;

$('vol').value=S.vol??.7;$('bMute').textContent=S.mute?'🔇':'🔊';$('vol').oninput=e=>{S.vol=+e.target.value;S.mute=false;$('bMute').textContent='🔊';setVol()};$('bMute').onclick=()=>{S.mute=!S.mute;$('bMute').textContent=S.mute?'🔇':'🔊';setVol()};

async function pickCaptain(k){const b=BOATS[k];let best=null,from=null;for(const bk of S.owned){if(bk===k)continue;for(const m of crewOf(bk)){if(!best||m.r*1000+m.xp>best.r*1000+best.xp){best=m;from=bk}}}
 const f=(S.fleet=S.fleet||{})[k]||(S.fleet[k]={});const nc=crewOf(k);
 if(best&&await ask(`New boat: <b>${b.name}</b>\n\nBest candidate for CAPTAIN: <b>${best.n}</b> (${RANKS[best.r][0]}, XP ${Math.round(best.xp)}, morale ${Math.round(best.m)}%) from ${BOATS[from].name}.\n\nPromote to Captain? Their share rises to ${RANKS[4][1]*100}% and a greenhorn fills their old spot.`,'Promote','Hire outside')){
  const oc=S.crew[from];oc.splice(oc.indexOf(best),1);best.r=4;best.m=Math.min(100,best.m+20);nc[0]=best;crewOf(from);f.cap=1;f.capPay=0;f.morale=75;toast(`🧑‍✈️ ${best.n} is now Captain of ${b.name}`,2500)}
 else{nc[0].r=4;nc[0].xp=200;f.cap=1;f.capPay=Math.round(150+b.crew*60);f.morale=60;toast(`Hired an outside captain for ${b.name} (${fm(f.capPay)}/day)`,2500)}}

// ================= CREW =================
const RANKS=[['Greenhorn',.02,0],['Deckhand',.035,120],['Senior Deckhand',.05,300],['Engineer / Bosun',.07,600],['Captain',.10,1000]];
const NAMES=['Mike','Jake','Sig','Elliott','Josh','Rosa','Nate','Kenji','Ana','Luis','Ivan','Tom','Bree','Carlos Jr.','Dmitri','Kai','Lena','Omar','Pete','Sam','Tasha','Wes','Yuri','Zoe','Hank','Marco','Nils','Ray'];
function crewOf(k){S.crew=S.crew||{};const b=BOATS[k];let c=S.crew[k];if(!c)c=S.crew[k]=[];while(c.length<b.crew)c.push({n:NAMES[Math.floor(Math.random()*NAMES.length)]+' '+'ABCDEFGHJKLMNPRSTW'[Math.floor(Math.random()*18)]+'.',r:0,xp:0,m:70});if(c.length>b.crew)c.length=b.crew;for(const m of c)if(m.att==null){m.att=Math.random()<.75?'good':'bad';m.disc=Math.round(Math.random()*100)/100;m.reck=Math.round(Math.random()**2*100)/100}return c}
function crewSkill(k){const c=crewOf(k).filter(m=>!(m.out>0));if(!c.length)return 0;return c.reduce((a,m)=>a+Math.min(100,m.r*20+m.xp/12)*(.6+m.m/250),0)/c.length}
function crewShare(k){return Math.min(.5,crewOf(k).reduce((a,m)=>a+RANKS[m.r][1],0))}
function crewGain(k,days,good){for(const m of crewOf(k)){if(m.out>0){m.out=Math.max(0,m.out-days);continue}m.xp+=(days*12+(good?10:0))*(1+m.disc)*(m.att==='bad'?.7:1);if(m.att==='bad')m.m-=3;m.m=Math.max(5,Math.min(100,m.m+(good?6:-8)))}}

// ---- crew safety events ----
const HAZ=['is standing under the swinging crane load','is working the rail with no safety line in heavy seas','is crossing an iced-over deck without crampons','is reaching into the pot launcher while it cycles','is nodding off on wheel watch'];
let WARN=null;
function safetyTick(dt){const g=G;if(!g||g.sub||S.test||WARN||g.over)return;const c=crewOf(S.boat).filter(m=>!(m.out>0));if(!c.length)return;const Wt=WEATHER[g.w];
 const avgR=c.reduce((a,m)=>a+m.reck,0)/c.length;if(Math.random()>dt*.012*(.3+avgR+(g.fatigue||0)/100)*(1+Wt.w))return;
 let pick=c[0],best=-1;for(const m of c){const v=Math.random()*(m.reck+.2+(m.att==='bad'?.3:0));if(v>best){best=v;pick=m}}
 WARN={m:pick,t:4.5-Math.min(2,g.w*.4),sev:(Wt.w+pick.reck)/2};$('warnTxt').innerHTML=`⚠ <b>${pick.n}</b> ${HAZ[Math.floor(Math.random()*HAZ.length)]}!`;$('warn').style.display='block';sfx.alarm();buzz([60,40,60])}
function warnTick(dt){if(!WARN)return;WARN.t-=dt;$('warnT').style.width=Math.max(0,WARN.t/4.5*100)+'%';if(WARN.t>0)return;const m=WARN.m,g=G;$('warn').style.display='none';
 if(Math.random()<.12*WARN.sev){const c=crewOf(S.boat);c.splice(c.indexOf(m),1);c.forEach(x=>x.m=Math.max(5,x.m-25));g.fatal=(g.fatal||0)+1;banner('🕯 FATAL ACCIDENT',2500,'#f44');toast(`${m.n} was lost in an accident. Crew morale has dropped and the Coast Guard will investigate.`,4000)}
 else{m.out=2+Math.floor(Math.random()*4);m.m=Math.max(5,m.m-10);g.injuries=(g.injuries||0)+1;banner('🤕 CREW INJURED',1600,'#f84');toast(`${m.n} is injured – out for ${m.out} days`,3000)}WARN=null;g.sk=crewSkill(S.boat)}
$('bCorrect').onclick=()=>{if(!WARN)return;const m=WARN.m;m.reck=Math.max(0,m.reck-.05);WARN=null;$('warn').style.display='none';sfx.good();buzz(20);toast(`✅ Corrected – ${m.n} is working safely`)};

// ---- safety reputation & applicant pool (one hiring season = 30 days) ----
function season(){return Math.floor(((S.day||1)-1)/30)+1}
function makePool(){const sf=S.safety??70,n=Math.max(1,Math.round(2+sf/15)),P=[];for(let i=0;i<n;i++){const q=Math.random()*.5+sf/200;
 P.push({n:NAMES[Math.floor(Math.random()*NAMES.length)]+' '+'ABCDEFGHJKLMNPRSTW'[Math.floor(Math.random()*18)]+'.',r:q>.85?2:q>.65?1:0,xp:Math.round(q*q*250),m:60+Math.round(q*30),att:Math.random()<.45+q*.5?'good':'bad',disc:Math.round(Math.min(1,Math.random()*.6+q*.5)*100)/100,reck:Math.round(Math.max(0,Math.random()*.9-q*.5)*100)/100})}
 S.pool={season:season(),list:P}}
function lvl(v){return v>.66?'High':v>.33?'Med':'Low'}
function poolCard(){if(!S.pool||S.pool.season!==season())makePool();const sf=S.safety??70;const el=document.createElement('div');el.className='card';
 el.innerHTML=`<div class=row><b>📋 Applicants – season ${season()}</b><small>🦺 Safety rep <b class="${sf<40?'dn':sf>70?'up':''}">${Math.round(sf)}</b></small></div><small style="opacity:.75">${sf<40?'Your accident record scares off good hands – few, risky applicants.':sf>70?'Strong safety record – more and better applicants.':'Average record.'} New pool every 30 days. Hiring replaces the weakest hand on ${BOATS[S.boat].name}.</small>`;
 if(!S.pool.list.length)el.innerHTML+='<div><small>No applicants left this season.</small></div>';
 S.pool.list.forEach((a,i)=>{const row=document.createElement('div');row.className='row';row.style.cssText='border-top:1px solid #222;padding:5px 0';
  row.innerHTML=`<div style="flex:1"><b>${a.n}</b> <small class=gold>${RANKS[a.r][0]}</small><br><small>Discipline ~${lvl(a.disc)} · Attitude ${Math.random()<.5?(a.att==='good'?'😊 seems good':'😠 ?'):'?'} · Recklessness ${a.reck>.5&&Math.random()<.5?'⚠ references mixed':'?'}</small></div>`;
  const bt=document.createElement('button');bt.className='btn green';bt.style.cssText='min-width:0;min-height:48px;padding:6px 10px;font-size:12px';bt.textContent='Hire';
  bt.onclick=()=>{const c=crewOf(S.boat);let wi=0;c.forEach((m,j)=>{if(m.r*1000+m.xp-m.reck*200<c[wi].r*1000+c[wi].xp-c[wi].reck*200)wi=j});const gone=c[wi];if(gone.r===4)return toast('That would replace your captain – promote someone first');c[wi]=a;S.pool.list.splice(i,1);toast(`Hired ${a.n} · let go ${gone.n}`);save();company()};row.appendChild(bt);el.appendChild(row)});return el}

// ================= SPEED & AUTOPLAY =================
function spdUI(){$('spdV').textContent=SPDS[S.spd??1]+'×';$('bAuto').textContent='🤖';$('bAuto').classList.toggle('on',!!S.auto)}
$('spdM').onclick=()=>{S.spd=Math.max(0,(S.spd??1)-1);save();spdUI()};$('spdP').onclick=()=>{S.spd=Math.min(SPDS.length-1,(S.spd??1)+1);save();spdUI()};
$('bAuto').onclick=()=>{S.auto=!S.auto;save();spdUI();toast(S.auto?'🤖 Captain AI is driving – tap again to take the wheel':'You have the wheel')};spdUI();
let aiT=0;
function aiTick(dt){const g=G;if(!S.auto||!g||g.over)return;
 if(WARN){$('bCorrect').onclick();return}
 if(g.rogue&&!g.rogue.done&&g.t>g.rogue.end-1.2){onSteer(g.rogue.d);return}
 if(g.haul){const h=g.haul,c=h.zs+h.zw/2;if(Math.abs(h.p-c)<h.zw*.1)$('hStop').onclick();return}
 if(g.fight){g.fight.hold=(!g.fight.run&&g.fight.ten<70)?1:0;return}
 if(g.sub){if(!g.sub.asc)g.sub.asc=1;return}
 g.odo=(g.odo||0)+Math.abs(g.x-(g.lx??g.x));g.lx=g.x;aiT-=dt;if(aiT>0)return;aiT=.35;if(g.winch)return;
 if(g.ice>25){for(let i=0;i<4;i++)chip()}
 const full=g.b.hold&&g.catch>=g.b.hold*.95,storm=g.nextW>=4&&g.wT<10&&g.nextW>g.w,burn=(g.maxF-g.fuel)/Math.max(200,g.odo||0),low=g.fuel<g.maxF*.1+burn*Math.max(0,g.x-60)*1.5;g.burn=burn;
 const ready=g.buoys.filter(b=>b.t>=b.soak&&!(b.deep&&b.deep>WINCH[UL('winch')]));
 if((full||storm||low||g.provWarn)&&!g.autoPort){if(ready.length&&!full&&!low&&!storm){}else{toast(full?'🤖 Hold full – heading home':storm?'🤖 Storm coming – running for port':'🤖 Low fuel/provisions – heading home',2500);g.auto=60;g.autoPort=1;return}}
 if(g.autoPort)return;
 if(ready.length){const b=ready.sort((a,c)=>Math.abs(a.x-g.x)-Math.abs(c.x-g.x))[0];if(Math.abs(b.x-g.x)<60){g.auto=null;$('bHaul').onclick()}else{g.auto=b.x;g.autoPort=0}return}
 if(g.pots>0){const d=density(g.x);if(d>.3&&!g.buoys.some(b=>Math.abs(b.x-g.x)<70)&&g.auto==null){$('bDrop').onclick();return}
  if(g.auto==null){const pin=(g.pins||[]).filter(p=>p.known&&!g.buoys.some(b=>Math.abs(b.x-p.x)<70)&&density(p.x)>.3&&(g.burn||0)*(Math.abs(p.x-g.x)+Math.max(p.x,g.x)*1.5)<g.fuel*.8).sort((a,b)=>b.lbs-a.lbs)[0];if(pin){g.auto=pin.x;g.autoPort=0;toast(`🤖 Sonar: heading for ${LNAME[pin.k]} school`,1500);return}const h=nextHot();let tx=h.x;for(let k=-3;k<=3;k++){const x=h.x+k*75;if(!g.buoys.some(b=>Math.abs(b.x-x)<70)&&density(x)>.45){tx=x;break}}g.auto=tx;g.autoPort=0}return}
 if(g.buoys.length){if(isNight(g))skipNight();return}
 g.auto=60;g.autoPort=1}

// ================= MARINE LIFE (schools + seabed walkers) =================
const LIFE={cod:{c:'#a8a27a',sz:.8,s:1},pollock:{c:'#9aaab4',sz:.5,s:1},acod:{c:'#b0aa82',sz:.8,s:1},snapper:{c:'#c0453a',sz:.6,s:1},shrimp:{c:'#e8a6a0',sz:.15,s:1},
 tunaS:{c:'#5a7fa8',sz:1.5,s:1},mahiS:{c:'#2f8a4a',sz:1.1,s:1},sailS:{c:'#4f7fb8',sz:2.8,s:1},squidS:{c:'#c86a6a',sz:.5,s:1,sq:1},lantern:{c:'#6a7590',sz:.1,s:1,glow:'#7cf'},
 kingC:{c:'#e0603a',sz:1.2,w:1},snowC:{c:'#e8a060',sz:.6,w:1},lobster:{c:'#8a5a40',sz:.45,w:1,lob:1},halibut:{c:'#8a7d62',sz:1.4,w:1,flat:1},isopodW:{c:'#c9b9a0',sz:.4,w:1},goldC:{c:'#d6a63a',sz:1.4,w:1}};
const LIFEMIX={bering:[['cod',.35],['pollock',.4],['kingC',.15],['snowC',.1]],gulfak:[['cod',.45],['pollock',.25],['halibut',.3]],natl:[['acod',.45],['lobster',.55]],
 gulfmx:[['shrimp',.6],['snapper',.4]],tuna:[['tunaS',.35],['mahiS',.25],['squidS',.3],['sailS',.1]],abyss:[['lantern',.5],['goldC',.3],['isopodW',.2]]};
function spawnLife(g){const mix=LIFEMIX[GK]||LIFEMIX.bering,cap=(innerWidth*innerHeight<500000?220:340),L=[];let grp=0;
 const add=(x,k,n,frac)=>{const sp=LIFE[k];grp++;const dir=Math.random()<.5?-1:1;for(let j=0;j<n&&L.length<cap;j++)L.push({k,g:grp,x:x+(Math.random()-.5)*(sp.w?160:60+n*3),f:sp.w?1:Math.min(.92,Math.max(.05,frac+(Math.random()-.5)*.12)),ox:(Math.random()-.5)*n*3,of:(Math.random()-.5)*.08,dir,ph:Math.random()*6,v:sp.w?6+Math.random()*6:25+Math.random()*20})};
 for(const h of g.hs){for(const [k,p] of mix){const sp=LIFE[k];const n=Math.round(h.q*p*(sp.w?14:45));if(n>0)add(h.x+(Math.random()-.5)*h.r,k,n,.25+Math.random()*.6)}}
 for(let i=0;i<14;i++){const [k]=mix[Math.floor(Math.random()*mix.length)];add(Math.random()*4000,k,LIFE[k].w?1:2+Math.floor(Math.random()*3),.2+Math.random()*.7)}return L}
function lifeStep(g,dt){if(!g.life)g.life=spawnLife(g);const C={};for(const f of g.life){f.ph+=dt;const sp=LIFE[f.k];if(sp.w){f.x+=f.dir*f.v*dt*.3;if(Math.random()<dt*.2)f.dir*=-1;continue}
  const c=C[f.g]||(C[f.g]={x:0,f:0,n:0,dir:f.dir});c.x+=f.x;c.f+=f.f;c.n++}
 for(const k in C){const c=C[k];c.x/=c.n;c.f/=c.n}
 for(const f of g.life){const sp=LIFE[f.k];if(sp.w)continue;const c=C[f.g];if(Math.random()<dt*.05)f.dir*=-1;// cohesion + alignment + separation-ish wobble
  f.x+=(f.dir*f.v+(c.x+f.ox-f.x)*.6)*dt;f.f+=((c.f+f.of-f.f)*.5+Math.sin(f.ph*1.3+f.g)*.02)*dt;f.f=Math.max(.04,Math.min(.95,f.f));if(f.x<20||f.x>3980)f.dir*=-1}}
function drawLife(g,toX,toY,scale,inView){const t=g.t;for(const f of g.life||[]){const sp=LIFE[f.k],X0=toX(f.x);if(X0<-40||X0>W+40)continue;const Y0=toY(f);if(Y0<-20||Y0>H+20)continue;const L=Math.max(3,sp.sz*scale);
  X.save();X.translate(X0,Y0);X.scale(f.dir,1);X.fillStyle=sp.c;X.globalAlpha=.92;
  if(sp.w){const st=Math.sin(f.ph*8)*L*.08;if(sp.flat){X.beginPath();X.ellipse(0,-L*.08,L/2,L*.12,0,0,7);X.fill()}else if(sp.lob){X.fillRect(-L/2,-L*.12,L*.8,L*.16);X.beginPath();X.moveTo(L*.3,-L*.06);X.lineTo(L*.55,-L*.25+st);X.lineTo(L*.55,L*.1-st);X.fill()}
   else{X.beginPath();X.ellipse(0,-L*.12,L*.22,L*.13,0,0,7);X.fill();X.strokeStyle=sp.c;X.lineWidth=Math.max(1,L*.05);X.beginPath();for(let i=-2;i<=2;i++){if(!i)continue;X.moveTo(i*L*.06,-L*.1);X.lineTo(i*L*.22,-L*.2+(i%2?st:-st));X.lineTo(i*L*.3,0)}X.stroke()}}
  else if(sp.sq){const w=Math.sin(f.ph*5)*L*.1;X.beginPath();X.ellipse(L*.15,0,L*.3,L*.09,0,0,7);X.fill();X.fillRect(-L*.45,-L*.04+w,L*.35,L*.02);X.fillRect(-L*.45,L*.02-w,L*.35,L*.02)}
  else{const wag=Math.sin(f.ph*10+f.x*.05)*L*.1,hh=L*.2;X.beginPath();X.moveTo(L/2,0);X.quadraticCurveTo(0,-hh,-L*.3,0);X.quadraticCurveTo(0,hh,L/2,0);X.fill();X.beginPath();X.moveTo(-L*.28,0);X.lineTo(-L/2,-hh*.8+wag);X.lineTo(-L/2,hh*.8+wag);X.fill();X.fillStyle='rgba(235,245,255,.55)';X.fillRect(-L*.2,hh*.05,L*.55,Math.max(1,hh*.3));
   if(sp.glow){X.fillStyle=sp.glow;X.globalAlpha=.6+.4*Math.sin(t*4+f.ph);X.fillRect(L*.2,-1,2,2);X.globalAlpha=1}}
  X.restore()}}

// ---- sonar pins ----
const LW={cod:10,pollock:3,acod:10,snapper:8,shrimp:.05,tunaS:90,mahiS:25,sailS:90,squidS:2,lantern:.01,kingC:7,snowC:1.5,lobster:1.5,halibut:40,isopodW:3,goldC:6};
const LICON={cod:'🐟',pollock:'🐟',acod:'🐟',snapper:'🐠',shrimp:'🦐',tunaS:'🐟',mahiS:'🐠',sailS:'🗡',squidS:'🦑',lantern:'✨',kingC:'🦀',snowC:'🦀',lobster:'🦞',halibut:'🐡',isopodW:'🪲',goldC:'🦀'};
const LNAME={cod:'Cod',pollock:'Pollock',acod:'Atlantic Cod',snapper:'Red Snapper',shrimp:'Shrimp',tunaS:'Tuna',mahiS:'Mahi-mahi',sailS:'Sailfish',squidS:'Squid',lantern:'Lanternfish',kingC:'King Crab',snowC:'Snow Crab',lobster:'Lobster',halibut:'Halibut',isopodW:'Giant Isopod',goldC:'Golden King Crab'};
const GDEPTH={mariana:3000,bering:120,gulfak:180,natl:90,gulfmx:40,tuna:300,abyss:3000};
function sonarPins(g){const lv=S.upg.sonar||0,R=420+180*lv,G2={};for(const f of g.life||[]){if(Math.abs(f.x-g.x)>R)continue;const k=f.k+'|'+f.g;const c=G2[k]||(G2[k]={k:f.k,x:0,f:0,n:0});c.x+=f.x;c.f+=f.f;c.n++}
 const P=[];for(const key in G2){const c=G2[key];if(c.n<3&&!LIFE[c.k].w)continue;c.x/=c.n;c.f/=c.n;const err=(1-lv/4)*(Math.abs(c.x-g.x)/R);const known=Math.random()>err*.9;
  const lbs=c.n*LW[c.k]*(LIFE[c.k].w?40:120)*(1+(Math.random()-.5)*err*1.2);P.push({x:c.x,f:c.f,k:c.k,known,lbs,depth:Math.round((LIFE[c.k].w?1:c.f)*sdep(c.x)*(1+(Math.random()-.5)*err*.4)),w:!!LIFE[c.k].w})}
 return P.sort((a,b)=>b.lbs-a.lbs).slice(0,W>H?3:5)}
function drawPins(g,uw,bed){g.pinT=(g.pinT||0)-1/60;if(g.pinT<=0){g.pins=sonarPins(g);g.pinT=3;g.ring=1}
 if(g.ring>0){const bx=g.x-g.cam;X.strokeStyle=`rgba(120,255,160,${g.ring*.5})`;X.lineWidth=2;X.beginPath();X.arc(bx,uw,(1-g.ring)*(420+180*(S.upg.sonar||0)),0,Math.PI);X.stroke();g.ring-=.02}
 g.pinHit=[];for(const p of g.pins||[]){const px=p.x-g.cam,py=p.w?bedYf(p.x,uw,bed)-2:uw+p.f*(bedYf(p.x,uw,bed)-uw-6);if(px<-60||px>W+60)continue;const sel=g.auto!=null&&Math.abs(g.auto-p.x)<5;
  X.fillStyle=sel?'rgba(242,182,50,.95)':'rgba(10,30,20,.8)';X.strokeStyle=sel?'#fff':'#7dffa8';X.lineWidth=1.5;const lbl=(p.known?LICON[p.k]+' '+LNAME[p.k]:'❓ unknown')+` ~${p.lbs>=1000?(p.lbs/1000).toFixed(1)+'k':Math.round(p.lbs)} lb · ${p.depth} m`;
  X.font='bold 10px sans-serif';const tw=X.measureText(lbl).width+10,bx2=Math.max(4,Math.min(W-tw-4,px-tw/2));let by2=py-30,skip=0;for(const o of g.pinHit)if(bx2<o.x1&&o.x0<bx2+tw&&Math.abs(o.y0+6-by2)<18){by2=o.y0+6-20;skip++}if(skip>1||by2<(W>H?70:110))continue;X.beginPath();X.roundRect?X.roundRect(bx2,by2,tw,16,8):X.rect(bx2,by2,tw,16);X.fill();X.stroke();
  X.beginPath();X.moveTo(px,by2+16);X.lineTo(px,py-4);X.stroke();X.beginPath();X.arc(px,py,4,0,7);X.stroke();X.fillStyle=sel?'#111':'#cfe';X.fillText(lbl,bx2+5,by2+11.5);g.pinHit.push({x0:bx2,y0:by2-6,x1:bx2+tw,y1:py+8,p})}
 if(g.bossPin&&!g.sub){const B=BOSSES[GK],px=g.bossX-g.cam,cl=Math.max(40,Math.min(W-40,px)),py=uw+40,pu=.6+.4*Math.sin(G.t*6);X.fillStyle=`rgba(220,30,30,${pu})`;X.beginPath();X.arc(cl,py,12,0,7);X.fill();X.font='bold 11px sans-serif';const l=`🐉 ${B.n} · ${((g.bossX-g.x)/40).toFixed(1)} nm`+(px<0?' ◀':px>W?' ▶':''),tw=X.measureText(l).width+10,bx=Math.max(4,Math.min(W-tw-4,cl-tw/2));X.fillStyle='rgba(120,0,0,.9)';X.fillRect(bx,py-34,tw,17);X.fillStyle='#fff';X.fillText(l,bx+5,py-22);g.pinHit.push({x0:bx,y0:py-40,x1:bx+tw,y1:py+14,p:{x:g.bossX,known:0}})}}
cv.addEventListener('pointerdown',e=>{const g=G;if(!g||g.sub||!g.pinHit)return;const h=g.pinHit.find(h=>e.clientX>=h.x0&&e.clientX<=h.x1&&e.clientY>=h.y0&&e.clientY<=h.y1);if(!h)return;
 g.auto=h.p.x;g.autoPort=0;sfx.good();buzz(15);toast(`🎯 Target: ${h.p.known?LNAME[h.p.k]:'unknown school'} · ${((Math.abs(h.p.x-g.x))/40).toFixed(1)} nm – drop pots when you arrive`)});

function pickSpX(mix,x){const f=Math.min(1,x/4000);const w=mix.map(([k,p])=>{const sp=SP(k);return [k,p,sp?(sp.lo+sp.hi)/2:1]});const avg=w.reduce((a,v)=>a+v[2],0)/w.length;
 const ww=w.map(([k,p,pr])=>[k,p*(pr>avg?(.35+f*1.3):(1.5-f))]);const tot=ww.reduce((a,v)=>a+v[1],0);let r=Math.random()*tot;for(const [k,p] of ww){if((r-=p)<0)return k}return ww[0][0]}

function ask(msg,ok='OK',cancel='Cancel'){return new Promise(res=>{const d=$('dlg');$('dlgT').innerHTML=msg.replace(/\n/g,'<br>');$('dlgOk').textContent=ok;$('dlgNo').textContent=cancel;$('dlgNo').style.display=cancel?'':'none';d.style.display='flex';
 $('dlgOk').onclick=()=>{d.style.display='none';res(true)};$('dlgNo').onclick=()=>{d.style.display='none';res(false)}})}

// ===== Achievements, log, encyclopedia, daily bonus =====
const TROPHY={first:['🎣','First catch sold'],king:['👑','First king crab'],hurr:['🌀','Survived a hurricane'],big:['💰','$100k trip'],deep:['🌑','Caught a deep-sea creature'],tuna:['🐟','Landed a tuna'],boss:['🐉','Defeated a legendary boss'],allboss:['🏆','Defeated every boss'],rescue:['🛟','Answered a mayday'],fleet:['🚢','Own 2+ boats']};
function trophy(k){S.tro=S.tro||{};if(S.tro[k])return;S.tro[k]=Date.now();save();banner(`🏆 ${TROPHY[k][0]} ${TROPHY[k][1]}`,2200,'#ffe14d');sfx.cash()}
function logTrip(g,sunk,profit,lines){S.log=S.log||[];S.dex=S.dex||{};for(const x of lines){if(x.l>0){S.dex[x.k]=(S.dex[x.k]||0)+x.l;if(x.k==='king')trophy('king');if(SP(x.k).ea)trophy('deep');if(/tuna|bluefin|yellowfin/.test(x.k))trophy('tuna')}}
 if(!sunk&&lines.some(x=>x.l>0))trophy('first');if(profit>=1e5)trophy('big');if(g.sawHurr&&!sunk)trophy('hurr');if((S.owned||[]).length>1)trophy('fleet');
 S.log.unshift({d:new Date().toLocaleDateString(),gr:g.gr.n,b:g.b.name,p:Math.round(profit),c:g.catch,s:!!sunk,boss:g.bossWon||''});S.log=S.log.slice(0,30);save()}
function countUp(){const el=[...document.querySelectorAll('#sumTab b')].find(b=>/\$/.test(b.textContent)&&b.parentElement.style.fontSize==='22px');if(!el)return;const t=el.textContent,v=+t.replace(/[^0-9]/g,''),neg=t.startsWith('-');let i=0;const n=30,iv=setInterval(()=>{i++;el.textContent=(neg?'-':'')+fm(Math.round(v*i/n));if(i%3==0)tone(900+i*20,.03,'square',.03);if(i>=n)clearInterval(iv)},33)}
function logbook(){const L=S.log||[],D=S.dex||{},T=S.tro||{};$('lbBody').innerHTML='<b class=gold>🏆 TROPHIES</b><div style="display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 12px">'+Object.entries(TROPHY).map(([k,v])=>`<span style="padding:6px 8px;border-radius:10px;background:${T[k]?'#2c5a85':'#1a1a1a'};opacity:${T[k]?1:.45}">${v[0]} ${v[1]}</span>`).join('')+'</div>'+
 '<b class=gold>📖 SPECIES ENCYCLOPEDIA</b><div style="margin:6px 0 12px">'+SPECIES.filter(x=>!x.soon).map(x=>`<div class=row style="opacity:${D[x.k]?1:.4};border-bottom:1px solid #223;padding:3px 0"><span>${D[x.k]?x.n:'??? '+(x.ea?'(deep-sea)':'')}</span><small>${D[x.k]?D[x.k].toLocaleString()+(x.ea?' caught':' lb total'):'not yet caught'}</small></div>`).join('')+'</div>'+
 '<b class=gold>📜 CAPTAIN\'S LOG</b>'+(L.length?L.map(t=>`<div class=row style="border-bottom:1px solid #223;padding:3px 0"><span><small>${t.d}</small> ${t.b} · ${t.gr}${t.boss?' · 🐉 '+t.boss:''}${t.s?' · 🌊 sank':''}</span><b class="${t.p>=0?'up':'dn'}">${t.p<0?'-':''}${fm(Math.abs(t.p))}</b></div>`).join(''):'<div><small>No trips yet. Go fish!</small></div>');show('sLog')}
function daily(){const k=dayKey(0);if(S.daily===k)return;S.daily=k;const pool=SPECIES.filter(x=>!x.soon&&!x.ea),sp=pool[Math.abs(Math.floor(hash(k+'cotd')*1e6))%pool.length];S.cotd=sp.k;const bonus=1000+(S.streak=(S.streak||0)+1)*250;S.money+=bonus;save();
 setTimeout(()=>ask(`⚓ <b>Welcome back, Captain!</b>\n\nDaily bonus: <b class=gold>+${fm(bonus)}</b> (streak ${S.streak})\n\n⭐ Catch of the Day: <b>${sp.n}</b> sells for <b class=up>+30%</b> today.`,'Let\'s fish',''),400)}
// ===== Tutorial hints =====
const HINTS=[['sea','👨‍✈️ Captain: Steer with ◀ ▶ (or AUTO 🤖). Sonar pins show fish – tap one to sail there.'],['drop','👨‍✈️ Over a school? Hit DROP POT. Each pot gets a buoy 📍.'],['haul','👨‍✈️ Sail back to a buoy and HAUL. Stop the winch in the green zone – gold = PERFECT.'],['storm','👨‍✈️ Weather turning. Watch ice 🧊 – tap the boat to chip it. Run for port if it gets bad.']];
function hint(k){S.hint=S.hint||{};if(S.hint[k]||(S.trips||0)>3)return;S.hint[k]=1;save();const h=HINTS.find(x=>x[0]===k);if(h)toast(h[1],5000)}
// ===== LEGENDARY BOSSES =====
const BOSSES={bering:{n:'Old Ironclaw',d:'Record red king crab · 2.1 m leg span, 12 kg',hp:100,tool:'⚡ STUN & CLAW',pay:60000,ph:['Shell armored – stun it!','It\'s clawing the cage!','Exposed – grab it!']},
 gulfak:{n:'The Grabber',d:'Giant Pacific octopus · 6 m arm span, 70 kg',hp:110,tool:'🪝 PULL CAGE',pay:45000,ph:['Arms wrapped on a cage','Ink cloud! Hold on','Tiring – haul now!']},
 natl:{n:'Giant of Prince Edward',d:'Atlantic bluefin record · 679 kg (1,496 lb)',hp:140,tool:'🎣 REEL',pay:120000,ph:['First run – 300 m of line!','Deep sounding dive','Circling at the boat – gaff it!']},
 gulfmx:{n:'Black Ghost',d:'Greenland shark · 6.4 m, 1,000 kg, ~400 yrs old (tag & release)',hp:120,tool:'🏷 TAG',pay:70000,ph:['Slow giant circling','Rolling on the line','Alongside – tag it!']},
 tuna:{n:'Choy\'s Marlin',d:'Black marlin record · 707 kg (1,560 lb)',hp:150,tool:'🎣 REEL',pay:150000,ph:['Tail-walking!','Greyhounding away','Exhausted – leader time!']},
 abyss:{n:'Architeuthis',d:'Giant squid · 12 m, 275 kg, eye 27 cm',hp:160,tool:'⚡ STUN & CLAW',pay:250000,ph:['Tentacles on the hull!','Pressure dive','Lights in its eye – grab it!']}};
const STORMBOSS={n:'The Widowmaker',d:'Rogue mega-storm · 30 m waves',hp:100,tool:'🧭 HOLD HEADING',pay:30000,ph:['Wall of water ahead','Eye passing over','Last squall line!']};
function bossSpawn(g){if(g.boss!==undefined)return;setTimeout(()=>hint('sea'),3000);setTimeout(()=>hint('drop'),11000);setTimeout(()=>hint('haul'),22000);g.boss=null;const B=BOSSES[GK];if(!B)return;g.bossX=2600+Math.random()*1800;g.bossPin=1;setTimeout(()=>{if(G===g){toast(`🔴 Sonar: LEGENDARY signal – ${B.n}! Red pin.`,3500);sfx.alarm&&sfx.alarm()}},9000)}
function bossStart(B){const g=G;g.boss={B,hp:B.hp,t:0,tele:0,next:2.5,ph:0};$('boss').style.display='block';$('bsN').textContent='🐉 '+B.n;$('bsD').textContent=B.d;$('bsA').textContent=B.tool;banner('⚠ LEGENDARY ENCOUNTER',1800,'#f33');buzz([100,60,100])}
function bossTick(dt){const g=G;if(!g||g.over)return;if(g.boss===undefined)bossSpawn(g);
 if(!g.boss&&g.bossPin&&Math.abs((g.sub?g.sub.x:g.x)-g.bossX)<90){g.bossPin=0;bossStart(BOSSES[GK])}
 if(!g.boss&&!g.stormBoss&&g.w>=5){g.stormBoss=1;bossStart(STORMBOSS)}
 if(g.w>=5)g.sawHurr=1;const b=g.boss;if(!b)return;b.t+=dt;b.ph=b.hp>b.B.hp*.66?0:b.hp>b.B.hp*.33?1:2;const sp=1+b.ph*.35;
 if(b.tele>0){b.tele-=dt;if(b.tele<=0){if(!b.braced){g.dmg=Math.min(g.maxH*.95,g.dmg+g.maxH*.06);b.hp=Math.min(b.B.hp,b.hp+6);banner('💥 HIT! It fought back',900,'#f84');sfx.crash();buzz(120)}b.braced=0;b.next=1.6+Math.random()*2/sp}}
 else{b.next-=dt;if(b.next<=0){b.tele=.9/sp+.35;b.braced=0;tone(220,.15,'sawtooth',.08)}}
 if(S.auto){if(b.tele>0&&b.tele<.5)bossBrace();else if(b.tele<=0&&Math.random()<dt*4)bossHit()}
 $('bsHp').style.width=Math.max(0,b.hp/b.B.hp*100)+'%';$('bsP').innerHTML=`Phase ${b.ph+1}/3 · ${b.B.ph[b.ph]}`+(b.tele>0?' <b class=dn>⚠ BRACE!</b>':'');
 $('bsB').style.background=b.tele>0?'#d33':'#555';if(b.t>90)bossEnd(0)}
function bossHit(){const b=G&&G.boss;if(!b)return;if(b.tele>0){b.hp=Math.min(b.B.hp,b.hp+3);toast('Wait! Brace first',700);return}b.hp-=4+(G.sk||0)/40+Math.random()*2;tone(500+Math.random()*200,.05,'square',.05);buzz(8);if(b.hp<=0)bossEnd(1)}
function bossBrace(){const b=G&&G.boss;if(!b||b.tele<=0)return;b.braced=1;b.tele=Math.min(b.tele,.05);tone(700,.08,'triangle',.06)}
function bossEnd(w){const g=G,b=g.boss;g.boss=null;$('boss').style.display='none';if(w){const pay=Math.round(b.B.pay*(S.test?.2:1));S.money+=pay;g.bossWon=b.B.n;S.bossD=S.bossD||{};S.bossD[b.B.n]=1;save();banner(`🏆 ${b.B.n} DEFEATED! +${fm(pay)}`,3000,'#ffe14d');sfx.cash();trophy('boss');if(Object.keys(BOSSES).every(k=>S.bossD[BOSSES[k].n]))trophy('allboss')}else banner(`${b.B.n} escaped…`,1800,'#f84')}
$('bsA').onclick=bossHit;$('bsB').onclick=bossBrace;$('bLog')&&($('bLog').onclick=logbook);$('bLogBack').onclick=dock;
window.__bs.bossStart=k=>bossStart(k==='storm'?STORMBOSS:BOSSES[k]);
