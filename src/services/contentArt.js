// Admin-only Content Studio: draws branded 1080px Instagram posters (feed 4:5 or story 9:16).
const TH={
 olive:{bg:'#232818',lift:'#3a4226',deep:'#161a0e',acc:'#b9bfa6',hi:'#f5f4f0',pop:'#4a5232',onpop:'#f5f4f0',pc:'#4a5232',paper:'#f5f4f0',ink:'#111111',mute:'#6a6a64'},
 christmas:{bg:'#10281c',lift:'#1f4a33',deep:'#08170f',acc:'#d9b765',hi:'#f7f3e8',pop:'#b3202a',onpop:'#f7f3e8',pc:'#b3202a',paper:'#f7f3e8',ink:'#14110d',mute:'#6b6558'},
 noir:{bg:'#111111',lift:'#262626',deep:'#050505',acc:'#c9a45c',hi:'#f4f1ea',pop:'#c9a45c',onpop:'#0d0d0d',pc:'#0d0d0d',paper:'#f4f1ea',ink:'#0d0d0d',mute:'#6a665d'}};
export const THEMES=[['olive','Regis olive'],['christmas','Christmas'],['noir','Noir gold']];
export const TYPES=[['promo','Promo'],['spotlight','Watch spotlight'],['versus','This or that'],['quote','Quote'],['tip','Tip']];
export const FIELDS={
 promo:[['tag','Small label, e.g. CHRISTMAS'],['headline','Big headline, e.g. 25% OFF'],['sub','Supporting line'],['code','Offer line, e.g. a code or DM TO ORDER'],['deadline','Deadline, e.g. 25 DEC']],
 spotlight:[['tag','Small label, e.g. JUST LANDED'],['headline','Watch name'],['sub','One-line tagline'],['price','Price text']],
 versus:[['tag','Small label (optional)'],['headline','Question, e.g. WHICH ONE’S YOURS?']],
 quote:[['headline','The quote'],['sub','Small line (optional)']],
 tip:[['tag','Small label, e.g. WATCH TIP'],['headline','Tip headline'],['sub','The tip']]};
export const blank=(type='promo')=>({type,theme:'olive',format:'feed',tag:'',headline:'',sub:'',code:'',deadline:'',price:'',imgs:['','','',''],labels:['','','',''],style:'photo',count:1,labelsOn:true});
const load=s=>new Promise(r=>{if(!s)return r(null);const i=new Image();i.crossOrigin='anonymous';i.onload=()=>r(i);i.onerror=()=>r(null);i.src=s});
function ring(x,cx,cy,r,unit,px,col,w=600){
 x.save();x.font=`${w} ${px}px Inter,sans-serif`;x.fillStyle=col;x.textAlign='center';x.textBaseline='middle';
 const circ=2*Math.PI*r,k=Math.max(1,Math.floor(.84*circ/x.measureText(unit).width)),ch=[...unit.repeat(k)],ws=ch.map(c=>x.measureText(c).width),gap=(circ-ws.reduce((a,b)=>a+b,0))/ch.length;
 let s=0;ch.forEach((c,i)=>{x.save();x.translate(cx,cy);x.rotate((s+ws[i]/2)/r);x.fillText(c,0,-r);x.restore();s+=ws[i]+gap});x.restore()}
export async function drawContent(s,mk=()=>document.createElement('canvas'),ld=load){
 if(typeof document!=='undefined'&&document.fonts)await Promise.all([document.fonts.load('100px Anton'),document.fonts.load('500 40px Inter'),document.fonts.load('600 40px Inter')]);
 const P=TH[s.theme]||TH.olive,st=s.format==='story',W=1080,H=st?1920:1350,c=mk();c.width=W;c.height=H;const x=c.getContext('2d');
 const ims=await Promise.all([0,1,2,3].map(i=>ld(s.imgs?.[i])));
 const T=(t,px,X,Y,col=P.hi,w=600,f='Inter',al='center')=>{x.font=`${w} ${px}px ${f},sans-serif`;x.fillStyle=col;x.textAlign=al;x.textBaseline='alphabetic';x.fillText(t,X,Y)};
 const rr=(X,Y,w,h,r)=>{x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath()};
 const wrap=(t,max,font)=>{x.font=font;const out=[];let l='';for(const w of String(t||'').split(/\s+/).filter(Boolean)){const n=l?l+' '+w:w;if(x.measureText(n).width>max&&l){out.push(l);l=w}else l=n}if(l)out.push(l);return out};
 const fit=(t,px,max,w,f,min=24)=>{while(px>min){x.font=`${w} ${px}px ${f},sans-serif`;if(x.measureText(t).width<=max)break;px-=2}return px};
 const block=(t,max,maxH,w,f,start,min,lh)=>{let px=start,L;for(;;){L=wrap(t,max,`${w} ${px}px ${f},sans-serif`);if((L.length*px*lh<=maxH&&L.every(l=>x.measureText(l).width<=max))||px<=min)break;px-=2}return{px,L}};
 const lines=(L,px,lh,X,Y,col,w,f,al='center')=>L.forEach((l,i)=>T(l,px,X,Y+i*px*lh,col,w,f,al));
 // background, frame, snow
 const g=x.createRadialGradient(W/2,H*.32,60,W/2,H*.32,H*.9);g.addColorStop(0,P.lift);g.addColorStop(.6,P.bg);g.addColorStop(1,P.deep);x.fillStyle=g;x.fillRect(0,0,W,H);
 if(s.theme==='christmas'){let h=7;const rnd=()=>(h=(h*1664525+1013904223)>>>0)/4294967296;x.fillStyle=P.hi;for(let i=0;i<90;i++){x.globalAlpha=.12+rnd()*.35;x.beginPath();x.arc(rnd()*W,rnd()*H,2+rnd()*5,0,7);x.fill()}x.globalAlpha=1}
 x.save();x.globalAlpha=.35;x.strokeStyle=P.acc;x.lineWidth=2;x.strokeRect(28,28,W-56,H-56);x.restore();
 const fy=H-(st?250:84),top=st?300:190,bot=fy-60;
 T('REGIS',68,72,st?226:126,P.hi,400,'Anton','left');T('@regiswatch.ng',26,W-72,st?222:122,P.acc,500,'Inter','right');
 const dup=/curated watches/i.test(s.sub||'');if(!dup)T('Curated watches, delivered across Nigeria',30,W/2,fy,P.hi,500);T('regiswatch.vercel.app',26,W/2,dup?fy+10:fy+40,P.acc,600);
 const chip=(t,Y)=>{if(!t)return 0;const u=t.toUpperCase();x.font='600 26px Inter,sans-serif';const w=x.measureText(u).width+64;x.strokeStyle=P.acc;x.lineWidth=2;rr(W/2-w/2,Y,w,56,28);x.stroke();T(u,26,W/2,Y+37,P.acc,600);return 56};
 const ticks=(cx,cy,R)=>{for(let i=0;i<60;i++){const a=i/60*Math.PI*2,mj=i%5===0,r1=R-14-R*(mj?.12:.06),r2=R-14;x.strokeStyle=mj?P.hi:P.acc+'88';x.lineWidth=mj?3.5:1.6;x.lineCap='round';x.beginPath();x.moveTo(cx+Math.sin(a)*r1,cy-Math.cos(a)*r1);x.lineTo(cx+Math.sin(a)*r2,cy-Math.cos(a)*r2);x.stroke()}};
 const dial=(cx,cy,R,im,txt,mono='R')=>{
  x.save();x.shadowColor='rgba(0,0,0,.55)';x.shadowBlur=60;x.shadowOffsetY=26;x.fillStyle=P.deep;x.beginPath();x.arc(cx,cy,R,0,7);x.fill();x.restore();
  x.strokeStyle=P.acc;x.lineWidth=3;x.beginPath();x.arc(cx,cy,R-2,0,7);x.stroke();ticks(cx,cy,R);
  if(txt&&R>=150)ring(x,cx,cy,R*.8,txt,R<200?14:18,P.acc);
  const pr=R*.62;x.save();x.beginPath();x.arc(cx,cy,pr,0,7);x.clip();x.fillStyle=P.pop;x.fillRect(cx-pr,cy-pr,pr*2,pr*2);
  if(im){const q=Math.min(im.width,im.height);x.drawImage(im,(im.width-q)/2,(im.height-q)/2,q,q,cx-pr,cy-pr,pr*2,pr*2)}else T(mono,pr,cx,cy+pr*.35,P.onpop,400,'Anton');x.restore();
  x.strokeStyle=P.hi;x.lineWidth=2;x.beginPath();x.arc(cx,cy,pr,0,7);x.stroke()};
 const ticket=Y=>{const w=860,X=(W-w)/2,h=150,n=22,m=Y+h/2;
  x.save();x.shadowColor='rgba(0,0,0,.45)';x.shadowBlur=40;x.shadowOffsetY=18;x.fillStyle=P.paper;x.beginPath();x.moveTo(X,Y);x.lineTo(X+w,Y);x.lineTo(X+w,m-n);x.arc(X+w,m,n,-Math.PI/2,Math.PI/2,true);x.lineTo(X+w,Y+h);x.lineTo(X,Y+h);x.lineTo(X,m+n);x.arc(X,m,n,Math.PI/2,-Math.PI/2,true);x.closePath();x.fill();x.restore();
  const both=s.code&&s.deadline,cL=both?X+w*.31:W/2,cR=both?X+w*.81:W/2;
  if(both){x.save();x.setLineDash([8,8]);x.strokeStyle=P.mute+'88';x.lineWidth=2;x.beginPath();x.moveTo(X+w*.62,Y+22);x.lineTo(X+w*.62,Y+h-22);x.stroke();x.restore()}
  if(s.code){const u=s.code.toUpperCase(),p=fit(u,72,both?w*.54:w-120,400,'Anton',34);T('OFFER',22,cL,Y+46,P.mute,600);T(u,p,cL,Y+46+p*.98,P.pc,400,'Anton')}
  if(s.deadline){const u=s.deadline.toUpperCase(),p=fit(u,60,both?w*.32:w-120,400,'Anton',30);T('ENDS',22,cR,Y+46,P.mute,600);T(u,p,cR,Y+46+p*.98,P.ink,400,'Anton')}};
 const edge=im=>{try{const e=mk();e.width=e.height=32;const q=e.getContext('2d');q.drawImage(im,0,0,32,32);const px=[[1,1],[30,1],[1,30],[30,30]].map(([a,b])=>q.getImageData(a,b,1,1).data),m=i=>Math.round(px.reduce((s,p)=>s+p[i],0)/4),sp=Math.max(...[0,1,2].map(i=>Math.max(...px.map(p=>p[i]))-Math.min(...px.map(p=>p[i]))));return{col:`rgb(${m(0)},${m(1)},${m(2)})`,plain:sp<40}}catch{return{col:P.paper,plain:false}}};
 const panel=(X,Y,w,h,q)=>{x.save();x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=40;x.shadowOffsetY=18;rr(X,Y,w,h,28);x.fillStyle=P.deep;x.fill();x.restore();
  x.save();rr(X,Y,w,h,28);x.clip();
  if(q.im){const e=edge(q.im);x.fillStyle=e.col;x.fillRect(X,Y,w,h);const iw=q.im.width,ih=q.im.height,k=e.plain?Math.min(w/iw,h/ih):Math.max(w/iw,h/ih),dw=iw*k,dh=ih*k;x.drawImage(q.im,X+(w-dw)/2,Y+(h-dh)/2,dw,dh)}
  else{x.fillStyle=P.pop;x.fillRect(X,Y,w,h);const m=Math.min(w,h);T(q.mono||'R',m*.5,X+w/2,Y+h/2+m*.18,P.onpop,400,'Anton')}
  x.restore();x.strokeStyle=P.acc+'99';x.lineWidth=2;rr(X,Y,w,h,28);x.stroke()};
 const gallery=(X,Y,w,h,sl,o={})=>{const n=sl.length,g=o.gap??20,cols=o.cols||(n===4&&st?2:n),rows=Math.ceil(n/cols),lab=o.labels&&sl.some(q=>q.label)?64:0,cw=(w-(cols-1)*g)/cols,
   ph=Math.max(120,Math.min((h-(rows-1)*g)/rows-lab,cw*(o.cap||(n===1?1.3:1.6)))),cellH=ph+lab,total=rows*cellH+(rows-1)*g,Y0=o.top?Y:Y+(h-total)/2,m={Y0,ph,total,cw,cellH};
  if(o.dry)return m;
  sl.forEach((q,i)=>{const pw=n===1?Math.min(cw,ph):cw,bx=X+(i%cols)*(cw+g),cy=Y0+Math.floor(i/cols)*(cellH+g);panel(bx+(cw-pw)/2,cy,pw,ph,q);if(lab&&q.label){const p=fit(q.label,28,cw-8,600,'Inter',16);T(q.label,p,bx+cw/2,cy+ph+40,P.hi,600)}});
  return m};
 const sl=[0,1,2,3].filter(i=>ims[i]).map(i=>({im:ims[i],label:(s.labels?.[i]||'').trim()})),n=sl.length,dialMode=n===0||(s.style==='dial'&&n===1),lb=s.labelsOn!==false&&n>1;
 const hc=s.theme==='olive'?P.hi:P.acc;
 if(s.type==='promo'){
  let y=top;if(s.tag)y+=chip(s.tag,y)+36;
  const h=(s.headline||'').toUpperCase(),hp=fit(h,n?(st?230:170):(st?300:250),W-120,400,'Anton',70);T(h,hp,W/2,y+hp*.82,hc,400,'Anton');y+=hp*.9+24;
  if(s.sub){const b=block(s.sub,W-200,st?200:150,500,'Inter',40,28,1.35);lines(b.L,b.px,1.35,W/2,y+b.px,P.hi,500,'Inter');y+=b.L.length*b.px*1.35+20}
  const tk=s.code||s.deadline,tY=bot-150,av=(tk?tY-24:bot)-y;
  if(dialMode){if(av>=240){const R=Math.min(av/2,st?330:250);dial(W/2,y+av/2,R,sl[0]?.im,`${(s.tag||'REGIS').toUpperCase()}  ·  `)}}
  else if(av>=200)gallery(72,y,W-144,av,sl,{labels:lb});
  if(tk)ticket(tY);
 }else if(s.type==='spotlight'){
  let y=top;if(s.tag)y+=chip(s.tag,y)+30;
  const h=(s.headline||'').toUpperCase(),hp=fit(h,st?104:92,W-120,400,'Anton',50),sb=s.sub?block(s.sub,W-220,110,500,'Inter',36,26,1.35):{L:[],px:0},pill=s.price?84:0;
  const low=hp*.95+(sb.L.length?sb.L.length*sb.px*1.35+16:0)+(pill?pill+26:0)+30;
  if(dialMode){const R=Math.max(130,Math.min((bot-y-low)/2,st?370:310));dial(W/2,y+R,R,sl[0]?.im,`${(s.tag||'REGIS').toUpperCase()}  ·  `);y+=2*R+34}
  else{const ah=Math.max(260,bot-y-low-34),m=gallery(72,y,W-144,ah,sl,{labels:lb,dry:true});y+=Math.max(0,(ah-m.total)/2);gallery(72,y,W-144,m.total,sl,{labels:lb,top:true});y+=m.total+34}
  T(h,hp,W/2,y+hp*.82,P.hi,400,'Anton');y+=hp*.95;
  if(sb.L.length){lines(sb.L,sb.px,1.35,W/2,y+sb.px+4,P.acc,500,'Inter');y+=sb.L.length*sb.px*1.35+16}
  if(pill){x.font='400 54px Anton,sans-serif';const pw=x.measureText(s.price).width+80;rr(W/2-pw/2,y+16,pw,pill,pill/2);x.fillStyle=P.paper;x.fill();T(s.price,54,W/2,y+16+pill*.72,P.ink,400,'Anton')}
 }else if(s.type==='versus'){
  let y=top;if(s.tag)y+=chip(s.tag,y)+28;
  const h=(s.headline||'WHICH ONE’S YOURS?').toUpperCase(),hp=fit(h,st?140:116,W-120,400,'Anton',60);T(h,hp,W/2,y+hp*.82,P.hi,400,'Anton');y+=hp*.95+30;
  const two=[0,1].map(i=>({im:ims[i],label:(s.labels?.[i]||'').trim(),mono:'AB'[i]})),m=gallery(72,y,W-144,bot-y,two,{labels:s.labelsOn!==false,gap:50,cols:2,cap:st?1.5:1.3}),vx=W/2,vy=m.Y0+m.ph/2;
  x.save();x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=24;x.fillStyle=P.pop;x.beginPath();x.arc(vx,vy,40,0,7);x.fill();x.restore();x.strokeStyle=P.hi;x.lineWidth=3;x.beginPath();x.arc(vx,vy,40,0,7);x.stroke();T('VS',38,vx,vy+14,P.onpop,400,'Anton');
 }else if(s.type==='quote'){
  const mid=(top+bot)/2;x.save();x.globalAlpha=.14;ticks(W/2,mid,Math.min(W*.52,(bot-top)/2+160));x.restore();
  const b=block((s.headline||'').toUpperCase(),W-170,bot-top-260,400,'Anton',st?150:128,54,1.1),tot=b.L.length*b.px*1.1,sy=mid-tot/2-30;
  T('“',200,W/2,sy+10,P.acc,400,'Anton');lines(b.L,b.px,1.1,W/2,sy+b.px*.9+40,P.hi,400,'Anton');
  const y2=sy+tot+70;x.fillStyle=P.acc;x.fillRect(W/2-60,y2,120,4);if(s.sub)T(s.sub,30,W/2,y2+56,P.acc,600);
 }else{
  const th=(s.headline||'').toUpperCase(),hb=block(th,W-150,st?420:330,400,'Anton',st?132:110,56,1.05),bb=block(s.sub||'',W-144-112-24,st?520:380,500,'Inter',40,26,1.45);
  const cardH=bb.L.length*bb.px*1.45+100,total=(s.tag?90:0)+hb.L.length*hb.px*1.05+36+cardH;
  let y=top+Math.max(0,(bot-top-total)/2);if(s.tag)y+=chip(s.tag,y)+34;
  lines(hb.L,hb.px,1.05,W/2,y+hb.px*.86,hc,400,'Anton');y+=hb.L.length*hb.px*1.05+36;
  const X=72,w=W-144;x.save();x.shadowColor='rgba(0,0,0,.4)';x.shadowBlur=40;x.shadowOffsetY=18;rr(X,y,w,cardH,28);x.fillStyle=P.paper;x.fill();x.restore();
  x.fillStyle=P.pc;rr(X+28,y+36,10,cardH-72,5);x.fill();lines(bb.L,bb.px,1.45,X+72,y+50+bb.px,P.ink,500,'Inter','left');
 }
 return c}