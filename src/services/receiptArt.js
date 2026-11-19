import {fmtDate,firstName} from './config';
// Admin-only "content receipt": a branded 1080px poster for Instagram (feed 4:5 or story 9:16).
const G={bg:'#232818',lift:'#3a4226',deep:'#161a0e',olive:'#4a5232',paper:'#f5f4f0',bone:'#dcd9cf',ink:'#111',mute:'#6a6a64',sage:'#b9bfa6'};
const naira=n=>'₦'+Number(n||0).toLocaleString('en-NG');
const load=s=>new Promise(r=>{if(!s)return r(null);const i=new Image();i.crossOrigin='anonymous';i.onload=()=>r(i);i.onerror=()=>r(null);i.src=s});
export const nameFor=(n,mode)=>mode==='hidden'||!n?null:mode==='initials'?n.trim().split(/\s+/).map(p=>p[0].toUpperCase()+'.').join(''):firstName(n);
function ring(x,cx,cy,r,unit,px,col,w=600){
 x.save();x.font=`${w} ${px}px Inter,sans-serif`;x.fillStyle=col;x.textAlign='center';x.textBaseline='middle';
 const circ=2*Math.PI*r,k=Math.max(1,Math.floor(.84*circ/x.measureText(unit).width)),ch=[...unit.repeat(k)],ws=ch.map(c=>x.measureText(c).width),gap=(circ-ws.reduce((a,b)=>a+b,0))/ch.length;
 let s=0;ch.forEach((c,i)=>{x.save();x.translate(cx,cy);x.rotate((s+ws[i]/2)/r);x.fillText(c,0,-r);x.restore();s+=ws[i]+gap});x.restore()}
function zig(x,X,Y,w,h,t=20,d=12){const n=w/t;x.beginPath();for(let i=0;i<=n;i++)x.lineTo(X+i*t,Y+(i%2?0:d));for(let i=n;i>=0;i--)x.lineTo(X+i*t,Y+h-(i%2?0:d));x.closePath()}
function bars(id,max){let h=0;for(const ch of id)h=(h*31+ch.charCodeAt(0))>>>0;const b=[];let w=0;while(w<max){h=(h*1664525+1013904223)>>>0;const k=2+(h%4)*2;if(w+k>max)break;b.push([w,k,h%7===0]);w+=k+3}return b}
export async function drawStudio(o,{format='feed',nameMode='first',prices=true,city=''}={},mk=()=>document.createElement('canvas'),ld=load){
 if(typeof document!=='undefined'&&document.fonts)await Promise.all([document.fonts.load('100px Anton'),document.fonts.load('500 40px Inter'),document.fonts.load('600 40px Inter'),document.fonts.load('400 40px Inter')]);
 const W=1080,H=format==='story'?1920:1350,c=mk();c.width=W;c.height=H;const x=c.getContext('2d');
 const items=o.items||[],it=items[0]||{},rows=items.slice(0,format==='story'?4:items.length<=2?2:1),more=items.length-rows.length;
 const im=await ld(it.image),who=nameFor(o.customer,nameMode),id='#'+o.id.slice(0,8).toUpperCase(),date=fmtDate(o.paidAt||o.createdAt);
 const T=(s,px,X,Y,col=G.ink,w=600,f='Inter',al='left')=>{x.font=`${w} ${px}px ${f},sans-serif`;x.fillStyle=col;x.textAlign=al;x.textBaseline='alphabetic';x.fillText(s,X,Y)};
 const fit=(s,px,max,w,f)=>{x.font=`${w} ${px}px ${f},sans-serif`;while(px>22&&x.measureText(s).width>max){px-=2;x.font=`${w} ${px}px ${f},sans-serif`}let t=s;while(t.length>3&&x.measureText(t).width>max)t=t.slice(0,-1);return [t===s?s:t.trimEnd()+'…',px]};
 // background
 const g=x.createRadialGradient(W/2,H*.3,60,W/2,H*.3,H*.85);g.addColorStop(0,G.lift);g.addColorStop(.6,G.bg);g.addColorStop(1,G.deep);x.fillStyle=g;x.fillRect(0,0,W,H);
 T('REGIS',68,72,126,G.paper,400,'Anton');T('@regiswatch.ng',26,W-72,122,G.sage,500,'Inter','right');
 // layout: strip height first, then size the dial to fit
 const stripH=562+rows.length*50+(more>0?50:0),top=format==='story'?280:150,foot=140,ov=56,SW=800,SX=(W-SW)/2;
 const D=Math.max(300,Math.min(format==='story'?800:540,H-foot-top+ov-stripH)),R=D/2,cx=W/2,cy=top+D/2,SY=top+D-ov;
 // dial
 x.save();x.shadowColor='rgba(0,0,0,.55)';x.shadowBlur=70;x.shadowOffsetY=30;x.fillStyle=G.deep;x.beginPath();x.arc(cx,cy,R,0,7);x.fill();x.restore();
 x.strokeStyle=G.paper;x.lineWidth=3;x.beginPath();x.arc(cx,cy,R-2,0,7);x.stroke();
 for(let i=0;i<60;i++){const a=i/60*Math.PI*2,mj=i%5===0,r1=R-14-R*(mj?.12:.06),r2=R-14;x.strokeStyle=mj?G.paper:G.sage+'88';x.lineWidth=mj?3.5:1.6;x.lineCap='round';x.beginPath();x.moveTo(cx+Math.sin(a)*r1,cy-Math.cos(a)*r1);x.lineTo(cx+Math.sin(a)*r2,cy-Math.cos(a)*r2);x.stroke()}
 ring(x,cx,cy,R*.8,`ORDER ${id}  ·  ${city?city.toUpperCase()+'  ·  ':''}${date.toUpperCase()}  ·  `,D<450?15:19,G.sage);
 const pr=R*.62;x.save();x.beginPath();x.arc(cx,cy,pr,0,7);x.clip();x.fillStyle=G.olive;x.fillRect(cx-pr,cy-pr,pr*2,pr*2);
 if(im){const s=Math.min(im.width,im.height);x.drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,cx-pr,cy-pr,pr*2,pr*2)}else T('R',pr,cx,cy+pr*.35,G.paper,400,'Anton','center');x.restore();
 x.strokeStyle=G.paper;x.lineWidth=2;x.beginPath();x.arc(cx,cy,pr,0,7);x.stroke();
 // receipt strip (slightly tilted)
 x.save();x.translate(W/2,SY+stripH/2);x.rotate(-.021);x.translate(-W/2,-(SY+stripH/2));
 x.save();x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=50;x.shadowOffsetY=26;x.fillStyle=G.paper;zig(x,SX,SY,SW,stripH);x.fill();x.restore();
 const L=SX+56,Rt=SX+SW-56,dash=y=>{x.save();x.setLineDash([9,8]);x.strokeStyle=G.bone;x.lineWidth=2;x.beginPath();x.moveTo(L,y);x.lineTo(Rt,y);x.stroke();x.restore()};
 let y=SY+56;
 const [nt,np]=fit((it.name||'Watch').toUpperCase(),58,SW-112-96,400,'Anton');T(nt,np,L,y+50,G.ink,400,'Anton');y+=62;
 const sub=[it.brand,it.color,it.strap].filter(Boolean).join('  ·  ');if(sub)T(fit(sub,24,SW-112-96,400,'Inter')[0],24,L,y+24,G.mute,400);y+=40;
 dash(y+20);y+=40;
 rows.forEach(i=>{T(fit(`${i.qty} x ${i.name}`,25,prices?470:SW-112,500,'Inter')[0],25,L,y+30,G.ink,500);if(prices)T(naira(i.price*i.qty),25,Rt,y+30,G.ink,500,'Inter','right');y+=50});
 if(more>0){T(`+ ${more} more`,25,L,y+30,G.mute,500);y+=50}
 x.fillStyle=G.ink;x.fillRect(L,y+6,Rt-L,2);y+=36;
 T(prices?'Total paid':'Status',26,L,y+50,G.ink,600);prices?T(naira(o.total),64,Rt,y+56,G.olive,400,'Anton','right'):T('PAID IN FULL',50,Rt,y+54,G.olive,400,'Anton','right');y+=80;
 dash(y+12);y+=36;
 T(fit(`NOW ON ${who?who.toUpperCase()+'’S':'A NEW'} WRIST.`,44,SW-112,400,'Anton')[0],44,L,y+42,G.ink,400,'Anton');y+=56+36;
 bars(id,300).forEach(([bx,bw,tall])=>{x.fillStyle=G.ink;x.fillRect(L+bx,y+(tall?0:10),bw,tall?64:54)});
 T(id,22,Rt,y+28,G.mute,500,'Inter','right');T(date,22,Rt,y+60,G.mute,500,'Inter','right');
 // stamp
 x.save();x.translate(SX+SW-36,SY+30);x.rotate(.25);x.shadowColor='rgba(0,0,0,.35)';x.shadowBlur=18;x.shadowOffsetY=6;x.fillStyle=G.olive;x.beginPath();x.arc(0,0,82,0,7);x.fill();x.shadowColor='transparent';
 x.strokeStyle=G.paper;x.lineWidth=3;x.beginPath();x.arc(0,0,74,0,7);x.stroke();x.lineWidth=1.5;x.beginPath();x.arc(0,0,40,0,7);x.stroke();
 ring(x,0,0,56,'REGIS  ·  SOLD  ·  ',14,G.paper,600);T('SOLD',27,0,10,G.paper,400,'Anton','center');x.restore();
 x.restore();
 T('Curated watches, delivered across Nigeria',30,W/2,H-80,G.paper,500,'Inter','center');T('regiswatch.com',26,W/2,H-40,G.sage,600,'Inter','center');
 return c}
export function captionFor(o,{nameMode='first',prices=true,city=''}={}){
 const who=nameFor(o.customer,nameMode),n=(o.items||[]).length,w=n>1?`${n} watches`:(o.items?.[0]?.name||'A new piece');
 return `Another one found its wrist.\n\n${w} ${n>1?'are':'is'} now with ${who||'a new owner'}${city?` in ${city}`:''}.${prices?` ${naira(o.total)}, paid in full.`:''}\n\nThank you for trusting Regis.\n\nFind yours: @regiswatch.ng · regiswatch.com\n\n#regis #regiswatch #watchesnigeria #watchesofinstagram #nigeriawatches #watchcollector #wristcheck`}