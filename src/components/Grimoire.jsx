import {useEffect,useLayoutEffect,useRef,useState} from 'react';import {Link} from 'react-router-dom';
import {naira} from '../services/config';import Pic from './Pic';import '../grimoire.css';
const AUTO=7;
const Card=({w})=><><span className="eyebrow">{w.brand||'New'}</span><b className="gname">{w.name}</b><Pic w={w}/><span className="gprice">From {naira(w.price)}</span></>;
const calm=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export default function Grimoire({items}){
 const n=items.length,step=360/Math.max(n,4);
 const [open,setOpen]=useState(false),[sel,setSel]=useState(null);
 const stage=useRef(null),book=useRef(null),focus=useRef(null),pages=useRef([]);
 const rot=useRef(-8),vel=useRef(0),selR=useRef(null),down=useRef(false),hover=useRef(false),moved=useRef(false),drag=useRef({x:0,t:0,id:0}),fx=useRef({rect:null,dir:0});
 selR.current=sel;
 const apply=()=>{if(book.current)book.current.style.setProperty('--r',rot.current.toFixed(2)+'deg')};
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
   if(e.intersectionRatio>=.3&&!openedAt){openedAt=performance.now();setOpen(true)}
  },{threshold:[0,.3]});
  io.observe(el);apply();
  return()=>{io.disconnect();cancelAnimationFrame(raf)};
 },[]);
 // the chosen card slides out of the fan (or in from the side on Prev/Next)
 useLayoutEffect(()=>{
  if(sel===null||!focus.current||calm()||!focus.current.animate)return undefined;
  const el=focus.current,f=fx.current,r=el.getBoundingClientRect();let from;
  if(f.rect&&r.width){const k=Math.min(1,Math.max(.35,f.rect.width/r.width));from={transform:`translate(${f.rect.left+f.rect.width/2-(r.left+r.width/2)}px,${f.rect.top+f.rect.height/2-(r.top+r.height/2)}px) scale(${k})`,opacity:.4}}
  else from={transform:`translateX(${f.dir*70}px) scale(.96)`,opacity:0};
  f.rect=null;
  const a=el.animate([from,{transform:'none',opacity:1}],{duration:520,easing:'cubic-bezier(.22,1,.36,1)'});
  return()=>a.cancel();
 },[sel]);
 const pick=(i,dir=0)=>{const pg=pages.current[i];fx.current={rect:dir===0&&pg?pg.getBoundingClientRect():null,dir};setSel(i)};
 const go=d=>pick((sel+d+n)%n,d),close=()=>setSel(null);
 useEffect(()=>{
  if(sel===null)return undefined;
  const k=e=>{if(e.key==='Escape')setSel(null);else if(e.key==='ArrowRight')go(1);else if(e.key==='ArrowLeft')go(-1)};
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
    {items.map((x,i)=><div key={x.id} ref={el=>{pages.current[i]=el}} role="button" tabIndex={0} className={'gpage'+(sel===i?' gone':'')} style={{'--a':i*step+'deg','--i':i}}
     aria-label={`${x.name}, from ${naira(x.price)}`} onClick={()=>{if(!moved.current)pick(i)}} onKeyDown={e=>key(e,i)}>
     <span className="gface"><Card w={x}/></span><span className="gface b"><Card w={x}/></span></div>)}
   </div>
  </div>
  <p className="ghint">Drag to turn the pages · tap a page to open it</p>
  {w&&<div className="gover" onClick={close}>
   <div className="gfocus" ref={focus} onClick={e=>e.stopPropagation()}><div className="gcard"><Card key={w.id} w={w}/></div></div>
   <div className="gbtns" onClick={e=>e.stopPropagation()}>
    <button type="button" onClick={()=>go(-1)}>‹ Prev</button><Link className="gview" to={'/watch/'+w.id}>View watch ›</Link><button type="button" onClick={()=>go(1)}>Next ›</button><button type="button" onClick={close} aria-label="Close">✕ Close</button>
   </div></div>}
 </div>;}
