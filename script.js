const T=THREE,$=s=>document.querySelector(s),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const R=new T.WebGLRenderer({canvas:$('#c'),antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
const S=new T.Scene();S.background=new T.Color(0xcfd2d8);
const cam=new T.PerspectiveCamera(55,1,.1,80);
const W=26,D=18,H=4.6,cols=[];
const lam=c=>new T.MeshLambertMaterial({color:c});
const box=(w,h,d,c,x,y,z,p=S)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),lam(c));m.position.set(x,y,z);p.add(m);return m};
S.add(new T.HemisphereLight(0xffffff,0xb8b4ae,.85));
[[-8,-4],[8,-4],[-8,5],[8,5]].forEach(([x,z])=>{const l=new T.PointLight(0xfff1dc,.5,16);l.position.set(x,H-.4,z);S.add(l)});
const fl=new T.Mesh(new T.PlaneGeometry(W,D),lam(0xf0eeea));fl.rotation.x=-Math.PI/2;S.add(fl);
box(W,H,.2,0xe7e7ea,0,H/2,-D/2-.1);box(W,H,.2,0xe7e7ea,0,H/2,D/2+.1);
box(.2,H,D,0xe7e7ea,-W/2-.1,H/2,0);box(.2,H,D,0xe7e7ea,W/2+.1,H/2,0);box(W,.2,D,0x24272f,0,H+.1,0);
const gr=new T.GridHelper(W,13,0x3a3e48,0x3a3e48);gr.position.y=H-.01;gr.scale.z=D/W;S.add(gr);
box(7,H-.4,.3,0x1b1c22,0,(H-.4)/2,-1.5);cols.push({x:0,z:-1.5,hw:3.5,hd:.15});
box(5,.5,3,0xffffff,8.5,.25,5.5);cols.push({x:8.5,z:5.5,hw:2.5,hd:1.5});
const benches=[];
function bench(x,z,ry){const g=new T.Group();box(2.2,.1,.6,0xb99a72,0,.42,0,g);box(.1,.4,.5,0x2a2a2e,-.9,.2,0,g);box(.1,.4,.5,0x2a2a2e,.9,.2,0,g);
 g.position.set(x,0,z);g.rotation.y=ry;S.add(g);g.updateMatrixWorld(true);
 benches.push({g,ry,slots:[-.5,.5].map(s=>g.localToWorld(new T.Vector3(s,0,0)))});
 const side=Math.abs(Math.sin(ry))>.5;cols.push({x,z,hw:side?.45:1.2,hd:side?1.2:.45})}
bench(-10.8,2.5,-Math.PI/2);bench(3,2,Math.PI);
const frames=[],pick=[];
const pal=[['#f6b3a1','#c2415b'],['#f3d9a4','#e07a5f'],['#b9c6f2','#7b5ea7'],['#f7c6d9','#d1495b'],['#ffd8a8','#bc6c25'],['#c3e6cb','#3c8d7d']];
function drawArt(f,i){const c=f.cv.getContext('2d'),w=f.cv.width,h=f.cv.height,p=pal[i%6],g=c.createLinearGradient(0,0,w,h);
 g.addColorStop(0,p[0]);g.addColorStop(1,p[1]);c.fillStyle=g;c.fillRect(0,0,w,h);
 const s=Math.min(w,h)*.2;c.save();c.translate(w/2,h*.44);c.fillStyle='rgba(255,255,255,.92)';c.beginPath();c.moveTo(0,s*.9);
 c.bezierCurveTo(-s*1.6,-s*.2,-s*.7,-s*1.3,0,-s*.5);c.bezierCurveTo(s*.7,-s*1.3,s*1.6,-s*.2,0,s*.9);c.fill();c.restore();
 c.fillStyle='#fff';c.textAlign='center';c.font='italic '+h*.07+'px Georgia,serif';c.fillText(f.cap,w/2,h*.82);
 c.font=h*.038+'px sans-serif';c.fillText('add your photo here',w/2,h*.89)}
function frame(x,z,ry,w,h,cap,y=2.1){const i=frames.length,cv=document.createElement('canvas');cv.width=Math.round(w*300);cv.height=Math.round(h*300);
 const f={cv,cap,pos:new T.Vector3(x,y,z),tex:new T.CanvasTexture(cv)},g=new T.Group();
 box(w+.16,h+.16,.06,0x15151a,0,0,0,g);
 const m=new T.Mesh(new T.PlaneGeometry(w+.07,h+.07),new T.MeshBasicMaterial({color:0xffffff}));m.position.z=.032;g.add(m);
 const ph=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:f.tex}));ph.position.z=.036;ph.userData.i=i;g.add(ph);pick.push(ph);
 g.position.set(x,y,z);g.rotation.y=ry;S.add(g);frames.push(f);drawArt(f,i);f.tex.needsUpdate=true}
const P=Math.PI;
frame(-8,-8.9,0,1.4,1.8,'Where it began');frame(-4.5,-8.9,0,1.4,1.8,'Our first trip');frame(0,-8.9,0,3.6,2.2,'Hand in hand');
frame(4.5,-8.9,0,1.4,1.8,'Little moments');frame(8,-8.9,0,1.4,1.8,'Home is you');
frame(-12.9,2.5,P/2,3.4,2.1,'Sunsets with you');
frame(12.9,-3,-P/2,1.4,1.8,'Your smile');frame(12.9,1,-P/2,1.4,1.8,'Us, always');
frame(-1.3,-1.31,0,1.2,1.6,'Forever starts here');frame(1.3,-1.31,0,1.2,1.6,'You & me');frame(0,-1.69,P,2.4,1.5,'The long way home');
function avatar(shirt,pants,hair,long){
 const g=new T.Group(),j={},skin=0xf0c8a8;
 const cyl=(a,b,h,c)=>new T.Mesh(new T.CylinderGeometry(a,b,h,12),lam(c));
 const leg=sx=>{const up=new T.Group();up.position.set(sx*.1,.85,0);const a=cyl(.075,.065,.42,pants);a.position.y=-.21;up.add(a);
  const lo=new T.Group();lo.position.y=-.42;const b=cyl(.062,.05,.4,pants);b.position.y=-.2;lo.add(b);box(.12,.07,.22,0x222226,0,-.4,.04,lo);up.add(lo);g.add(up);return[up,lo]};
 [j.uL,j.lL]=leg(1);[j.uR,j.lR]=leg(-1);
 const to=cyl(.2,.17,.55,shirt);to.position.y=1.12;g.add(to);
 const arm=sx=>{const p=new T.Group();p.position.set(sx*.27,1.37,0);const a=cyl(.055,.05,.5,shirt);a.position.y=-.25;p.add(a);
  const h=new T.Mesh(new T.SphereGeometry(.055,8,8),lam(skin));h.position.y=-.52;p.add(h);g.add(p);return p};
 j.aL=arm(1);j.aR=arm(-1);
 const hd=new T.Mesh(new T.SphereGeometry(.17,16,16),lam(skin));hd.position.y=1.62;g.add(hd);
 const hr=new T.Mesh(new T.SphereGeometry(.185,16,16,0,P*2,0,P*.62),lam(hair));hr.position.y=1.63;hr.rotation.x=-.25;g.add(hr);
 if(long)box(.34,.5,.1,hair,0,1.42,-.13,g);
 [-.06,.06].forEach(x=>{const e=new T.Mesh(new T.SphereGeometry(.018,6,6),lam(0x222222));e.position.set(x,1.64,.16);g.add(e)});
 const tc=document.createElement('canvas');tc.width=256;tc.height=64;const tt=new T.CanvasTexture(tc),sp=new T.Sprite(new T.SpriteMaterial({map:tt,depthTest:false}));
 sp.scale.set(1.2,.3,1);sp.position.y=2.05;g.add(sp);S.add(g);
 return{g,j,mode:'idle',ph:0,ry:0,sw:0,sp:3,dance:0,tc,tt}}
function setTag(a,t){const x=a.tc.getContext('2d');x.clearRect(0,0,256,64);x.fillStyle='rgba(20,20,26,.75)';x.fillRect(0,8,256,48);
 x.fillStyle='#fff';x.font='500 26px sans-serif';x.textAlign='center';x.fillText(t,128,42);a.tt.needsUpdate=true}
const me=avatar(0x23303f,0x1e2230,0x2b1d14,false),her=avatar(0xc0392b,0x20222a,0x3a2216,true);
me.g.position.set(0,0,6);her.g.position.set(-1.4,0,6.6);me.ry=her.ry=P;her.dance=1.2;
setTag(me,'Daniel');setTag(her,'Emma');
function animAv(a,dt,t,moving){
 const j=a.j,k=Math.min(1,dt*10),L=(o,p,v)=>{o.rotation[p]+=(v-o.rotation[p])*k};
 let tu=[0,0],tl=[0,0],ta=[0,0],tz=[.08,.08],by=0,sw=0;
 if(a.mode==='sit'){tu=[-1.57,-1.57];tl=[1.57,1.57];ta=[-.4,-.4];tz=[.05,.05]}
 else if(a.mode==='dance'){const s=Math.sin(t*7+a.dance);tu=[s*.35,-s*.35];tl=[Math.max(0,-s)*.6,Math.max(0,s)*.6];
  tz=[2.4+Math.sin(t*7)*.3,2.4-Math.sin(t*7)*.3];by=Math.abs(s)*.1;sw=Math.sin(t*3.5)*.4}
 else if(moving){a.ph+=dt*a.sp*3.2;const s=Math.sin(a.ph);tu=[s*.7,-s*.7];tl=[Math.max(0,-s)*.8,Math.max(0,s)*.8];ta=[-s*.6,s*.6];by=Math.abs(Math.cos(a.ph))*.04}
 L(j.uL,'x',tu[0]);L(j.uR,'x',tu[1]);L(j.lL,'x',tl[0]);L(j.lR,'x',tl[1]);L(j.aL,'x',ta[0]);L(j.aR,'x',ta[1]);L(j.aL,'z',tz[0]);L(j.aR,'z',-tz[1]);
 a.g.position.y=(a.mode==='sit'?-.33:0)+by;a.g.rotation.y=a.ry+sw}
const lerpAng=(a,b,t)=>a+((((b-a+P)%(2*P))+2*P)%(2*P)-P)*t;
function collide(p){const r=.35;p.x=clamp(p.x,-W/2+r,W/2-r);p.z=clamp(p.z,-D/2+r,D/2-r);
 cols.forEach(c=>{const dx=p.x-c.x,dz=p.z-c.z,ox=c.hw+r-Math.abs(dx),oz=c.hd+r-Math.abs(dz);
  if(ox>0&&oz>0){if(ox<oz)p.x+=(dx<0?-1:1)*ox;else p.z+=(dz<0?-1:1)*oz}})}
let yaw=0,pit=.42,sitIdx=-1,dancing=false,started=false,vi=0,repMode=false;
const keys={},joy={x:0,y:0};
function toast(t){const e=$('#toast');e.textContent=t;e.style.opacity=1;clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.opacity=0,2200)}
function stand(){const b=benches[sitIdx];sitIdx=-1;[me,her].forEach((a,i)=>{const v=b.g.localToWorld(new T.Vector3(i?.5:-.5,0,1.1));a.g.position.set(v.x,0,v.z)})}
function sit(){if(sitIdx>=0){stand();return}
 let bi=-1,bd=3.4;benches.forEach((b,i)=>{const d=b.g.position.distanceTo(me.g.position);if(d<bd){bd=d;bi=i}});
 if(bi<0){toast('Walk close to a bench, then press E');return}
 dancing=false;sitIdx=bi;const b=benches[bi];[me,her].forEach((a,i)=>{a.g.position.set(b.slots[i].x,0,b.slots[i].z);a.ry=b.ry})}
function dance(){if(sitIdx>=0){toast('Stand up first');return}dancing=!dancing}
function nearFrame(){let b=-1,bd=6;frames.forEach((f,i)=>{const d=Math.hypot(f.pos.x-me.g.position.x,f.pos.z-me.g.position.z);if(d<bd){bd=d;b=i}});return b}
function openView(i){if(i<0){toast('Walk closer to a photo, or click one');return}vi=i;$('#lbi').src=frames[i].cv.toDataURL('image/jpeg',.9);$('#lbc').textContent=frames[i].cap;$('#lb').hidden=false}
function loadImg(file,i){return new Promise(r=>{const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{
 const f=frames[i],c=f.cv.getContext('2d'),w=f.cv.width,h=f.cv.height,s=Math.max(w/im.width,h/im.height);
 c.drawImage(im,(w-im.width*s)/2,(h-im.height*s)/2,im.width*s,im.height*s);f.tex.needsUpdate=true;f.custom=true;r()};im.src=fr.result};fr.readAsDataURL(file)})}
$('#fi').onchange=async e=>{const fs=[...e.target.files];e.target.value='';
 if(repMode){await loadImg(fs[0],vi);openView(vi)}
 else{let n=0;for(const f of fs){const i=frames.findIndex(x=>!x.custom);if(i<0)break;await loadImg(f,i);n++}toast(n+' photo'+(n==1?'':'s')+' added to the walls')}};
$('#bAdd').onclick=()=>{repMode=false;$('#fi').click()};$('#rep').onclick=()=>{repMode=true;$('#fi').click()};
$('#cls').onclick=()=>$('#lb').hidden=true;$('#bSit').onclick=sit;$('#bDance').onclick=dance;$('#bView').onclick=()=>openView(nearFrame());
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;const k=e.key.toLowerCase();keys[k]=1;
 if(k==='e')sit();if(k==='f')dance();if(k===' '){e.preventDefault();$('#lb').hidden?openView(nearFrame()):$('#lb').hidden=true}if(k==='escape')$('#lb').hidden=true});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=0});
let drag=null;const cv=$('#c'),ray=new T.Raycaster();
cv.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,m:0};cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.m+=Math.abs(dx)+Math.abs(dy);drag.x=e.clientX;drag.y=e.clientY;yaw-=dx*.006;pit=clamp(pit+dy*.004,.1,1)});
cv.addEventListener('pointerup',e=>{if(drag&&drag.m<6&&started){ray.setFromCamera({x:e.clientX/innerWidth*2-1,y:-(e.clientY/innerHeight)*2+1},cam);const h=ray.intersectObjects(pick)[0];if(h)openView(h.object.userData.i)}drag=null});
const jy=$('#joy'),kn=jy.firstElementChild;let jd=false;
function jm(e){const r=jy.getBoundingClientRect(),dx=e.clientX-(r.left+55),dy=e.clientY-(r.top+55),l=Math.min(1,Math.hypot(dx,dy)/45),a=Math.atan2(dy,dx);
 joy.x=Math.cos(a)*l;joy.y=-Math.sin(a)*l;kn.style.transform='translate('+joy.x*35+'px,'+(-joy.y*35)+'px)'}
jy.addEventListener('pointerdown',e=>{jd=true;jy.setPointerCapture(e.pointerId);jm(e)});jy.addEventListener('pointermove',e=>{if(jd)jm(e)});
jy.addEventListener('pointerup',()=>{jd=false;joy.x=joy.y=0;kn.style.transform=''});
function step(dt,t){
 let ix=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+joy.x,iy=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0)+joy.y;
 const len=Math.hypot(ix,iy);let mv=false,hm=false;
 if(!started)yaw+=dt*.1;
 else if(len>.12&&$('#lb').hidden){if(sitIdx>=0)stand();dancing=false;const n=Math.max(1,len);ix/=n;iy/=n;
  const dx=-Math.sin(yaw)*iy+Math.cos(yaw)*ix,dz=-Math.cos(yaw)*iy-Math.sin(yaw)*ix,sp=3.4*Math.min(1,len);
  me.g.position.x+=dx*sp*dt;me.g.position.z+=dz*sp*dt;me.sp=sp;me.ry=lerpAng(me.ry,Math.atan2(dx,dz),Math.min(1,dt*12));mv=true;collide(me.g.position)}
 if(sitIdx<0){const p=her.g.position,q=me.g.position,dx=q.x-p.x,dz=q.z-p.z,d=Math.hypot(dx,dz),want=dancing?1.4:1.9;
  if(d>want){const sp=Math.min(4.2,2.2+(d-want)*1.1);p.x+=dx/d*sp*dt;p.z+=dz/d*sp*dt;hm=true;her.sp=sp;collide(p)}
  her.ry=lerpAng(her.ry,Math.atan2(dx,dz),Math.min(1,dt*8))}
 me.mode=sitIdx>=0?'sit':dancing?'dance':'idle';her.mode=me.mode;
 animAv(me,dt,t,mv);animAv(her,dt,t,hm);
 const q=me.g.position,dist=5.2,cp=new T.Vector3(q.x+Math.sin(yaw)*Math.cos(pit)*dist,1.3+Math.sin(pit)*dist,q.z+Math.cos(yaw)*Math.cos(pit)*dist);
 cp.x=clamp(cp.x,-W/2+.3,W/2-.3);cp.z=clamp(cp.z,-D/2+.3,D/2-.3);cp.y=Math.min(cp.y,H-.3);
 cam.position.lerp(cp,Math.min(1,dt*8));cam.lookAt(q.x,1.2,q.z)}
function resize(){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.fov=cam.aspect<1?72:55;cam.updateProjectionMatrix()}
addEventListener('resize',resize);resize();cam.position.set(0,3,11);
const clk=new T.Clock();(function loop(){requestAnimationFrame(loop);step(Math.min(clk.getDelta(),.05),clk.elapsedTime);R.render(S,cam)})();
let pr=0;const iv=setInterval(()=>{pr=Math.min(100,pr+2+Math.random()*4);$('#pb').style.width=pr+'%';$('#pc').textContent=Math.round(pr)+'%';
 if(pr>=100){clearInterval(iv);const g=$('#go');g.style.opacity=1;g.style.pointerEvents='auto'}},60);
$('#go').onclick=()=>{const a=$('#n1').value.trim()||'Daniel',b=$('#n2').value.trim()||'Emma';setTag(me,a);setTag(her,b);document.title='Our Museum · '+a+' & '+b;
 const i=$('#intro');i.style.opacity=0;i.style.pointerEvents='none';setTimeout(()=>i.remove(),800);started=true;toast('Use WASD to walk — '+b+' follows you')};