import {useEffect,useRef,useState} from 'react';import {naira} from '../services/config';
export default function CountUp({to}){
 const r=useRef(),[v,setV]=useState(0);
 useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(!e.isIntersecting)return;o.disconnect();const t0=performance.now();
  const f=t=>{const k=Math.min(1,(t-t0)/1400);setV(Math.round(to*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)},{threshold:.3});
  o.observe(r.current);return()=>o.disconnect()},[to]);
 return <span ref={r}>{naira(v)}</span>;}
