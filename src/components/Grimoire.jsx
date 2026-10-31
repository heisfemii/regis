import {useEffect,useLayoutEffect,useRef,useState} from 'react';import {Link} from 'react-router-dom';
import {naira} from '../services/config';import {cover} from '../services/watches';import Pic from './Pic';import '../grimoire.css';
const AUTO=7;
const BITS=Array.from({length:10},(_,i)=>({y:6+i*9,s:5+(i*7)%7,bx:-(30+(i*17)%60),by:((i*37)%90)-45,br:((i*83)%360)-180}));
const Card=({w})=><><span className="eyebrow">{w.brand||'New'}</span><b className="gname">{w.name}</b><Pic w={w}/><span className="gprice">From {naira(w.price)}</span></>;
const calm=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export default function Grimoire({items}){
 const n=items.length,step=360/Math.max(n,4);
 const [open,setOpen]=useState(false),[sel,setSel]=useState(null),[mend,setMend]=useState(null);
 const stage=useRef(null),book=useRef(null),focus=useRef(null),pages=useRef([]);
 const rot=useRef(-8),vel=useRef(0),selR=useRef(null),down=useRef(false),hover=useRef(false),moved=useRef(false),drag=useRef({x:0,t:0,id:0}),fx=useRef({rect:null,dir:0});
 selR.current=sel;
 const apply=()=>{if(book.current)book.current.style.transform=`translateY(-8px) rotateX(-9deg) rotateY(${rot.current.toFixed(2)}deg)`};
 useEffect(()=>{items.forEach(x=>{const s=cover(x);if(s){const i=new Image();i.src=s}})},[items]);
 // opening + slow idle turn; only runs while the book is on screen
 useEffect(()=>{
  const el=stage.current;if(!el)return undefined;
  let raf=0,last=0,vis=false,openedAt=0;
  const tick=t=>{
   const dt=Math.min(.05,(t-(last||t))/1000);last=t;
   if(selR.current===null&&!document.hidden&&!down.current){
    let d=vel.current*dt;vel.current*=Math.exp(-3*dt);
    if(!hover.current&&openedAt&&t-openedAt>1900&&!calm())d+=AUTO*dt;
    if(d){rot.current+=d;apply()}}
   raf=requestAnimationFrame(tick)};
  const io=new IntersectionObserver(([e])=>{
   if(e.isIntersecting&&!vis){vis=true;last=0;raf=requestAnimationFrame(tick)}
   if(!e.isIntersecting&&vis){vis=false;cancelAnimationFrame(raf)}
   if(e.isIntersecting&&!openedAt){openedAt=performance.now();setOpen(true)}
  },{rootMargin:'0px 0px 60% 0px',threshold:[0]});
  io.observe(el);apply();
  return()=>{io.disconnect();cancelAnimationFrame(raf)};
 },[]);
 // the card is yanked out of the book: grab, rip free, then glide to the centre
 useLayoutEffect(()=>{
  if(sel===null||!focus.current||calm()||!focus.current.animate)return undefined;
  const el=focus.current,f=fx.current,r=el.getBoundingClientRect();let dx,dy,k;
  if(f.rect&&r.width){k=Math.min(1,Math.max(.35,f.rect.width/r.width));dx=f.rect.left+f.rect.width/2-(r.left+r.width/2);dy=f.rect.top+f.rect.height/2-(r.top+r.height/2)}
  else{k=.96;dx=f.dir*70;dy=0}
  f.rect=null;
  const T=(x,y,s,a)=>`translate(${x}px,${y}px) scale(${s}) rotate(${a}deg)`,E='cubic-bezier(.22,1,.36,1)';
  const a=el.animate([
   {transform:T(dx,dy,k,0),opacity:.6,offset:0,easing:'ease-out'},
   {transform:T(dx+4,dy+2,k,-2),opacity:1,offset:.14,easing:'ease-in'},
   {transform:T(dx*.9-10,dy*.9-6,k*1.04,-6),opacity:1,offset:.3,easing:E},
   {transform:T(dx*.12,dy*.12,1.02,2.5),opacity:1,offset:.72,easing:E},
   {transform:T(0,0,1,0),opacity:1,offset:1}],{duration:900});
  return()=>a.cancel();
 },[sel]);
 useEffect(()=>{if(mend===null)return undefined;const t=setTimeout(()=>setMend(null),700);return()=>clearTimeout(t)},[mend]);
 const pick=(i,dir=0)=>{const pg=pages.current[i];fx.current={rect:dir===0&&pg?pg.getBoundingClientRect():null,dir};if(sel!==null&&sel!==i)setMend(sel);setSel(i)};
 const go=d=>pick((sel+d+n)%n,d),close=()=>{if(sel!==null)setMend(sel);setSel(null)};
 useEffect(()=>{
  if(sel===null)return undefined;
  const k=e=>{if(e.key==='Escape')close();else if(e.key==='ArrowRight')go(1);else if(e.key==='ArrowLeft')go(-1)};
  window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k);
 },[sel,n]);
 const onDown=e=>{if(selR.current!==null||(e.pointerType==='mouse'&&e.button!==0))return;down.current=true;moved.current=false;drag.current={x:e.clientX,t:performance.now(),id:e.pointerId};vel.current=0};
 const onMove=e=>{
  if(!down.current)return;const d=drag.current,dx=e.clientX-d.x;
  if(!moved.current){if(Math.abs(dx)<6)return;moved.current=true;try{e.currentTarget.setPointerCapture(d.id)}catch{}}
  const now=performance.now(),dt=Math.max(8,now-d.t);rot.current+=dx*.4;vel.current=vel.current*.5+(dx*.4/dt*1000)*.5;d.x=e.clientX;d.t=now;apply()};
 const onUp=e=>{if(!down.current)return;down.current=false;try{e.currentTarget.releasePointerCapture(drag.current.id)}catch{}if(moved.current)setTimeout(()=>{moved.current=false},50)};
 const key=(e,i)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(i)}};
 const w=sel!==null?items[sel]:null;
 return <div ref={stage} className={'gstage'+(open?' open':'')+(sel!==null?' focus':'')}>
  <div className="gscene" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
   onPointerEnter={e=>{if(e.pointerType==='mouse')hover.current=true}} onPointerLeave={()=>{hover.current=false}} onDragStart={e=>e.preventDefault()}>
   <div className="gbook" ref={book}>
    <i className="gspine"/><i className="gspine b"/><i className="gcord"/><i className="gcord b"/>
    {items.map((x,i)=><div key={x.id} ref={el=>{pages.current[i]=el}} role="button" tabIndex={0} className={'gpage'+(sel===i?' gone':'')+(mend===i&&sel!==i?' mend':'')} style={{'--a':i*step+'deg','--i':i}}
     aria-label={`${x.name}, from ${naira(x.price)}`} onClick={()=>{if(!moved.current)pick(i)}} onKeyDown={e=>key(e,i)}>
     <span className="gface"><Card w={x}/></span><span className="gface b"><Card w={x}/></span></div>)}
   </div>
  </div>
  <p className="ghint">Drag to turn the pages · tap a page to open it</p>
  {w&&<div className="gover" onClick={close}>
   <div className="gfocus" key={w.id} ref={focus} onClick={e=>e.stopPropagation()}>
    <i className="gfiber"/><div className="gcard"><Card w={w}/></div>
    {BITS.map((b,i)=><i key={i} className="gbit" style={{'--y':b.y,'--s':b.s+'px','--bx':b.bx+'px','--by':b.by+'px','--br':b.br+'deg'}}/>)}
   </div>
   <div className="gbtns" onClick={e=>e.stopPropagation()}>
    <button type="button" onClick={()=>go(-1)}>‹ Prev</button><Link className="gview" to={'/watch/'+w.id}>View watch ›</Link><button type="button" onClick={()=>go(1)}>Next ›</button><button type="button" onClick={close} aria-label="Close">✕ Close</button>
   </div></div>}
 </div>;}