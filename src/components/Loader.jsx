import {useEffect,useState} from 'react';import {createPortal} from 'react-dom';
const MSG=['We’re getting the watches ready…','Polishing every dial…','Setting the time just right…','Almost there…'];
export default function Loader(){
 const [i,setI]=useState(0);
 useEffect(()=>{const t=setInterval(()=>setI(n=>(n+1)%MSG.length),2200),o=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{clearInterval(t);document.body.style.overflow=o}},[]);
 return createPortal(<div className="loader" role="status" aria-live="polite">
  <svg className="wface" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" className="rim"/><circle cx="50" cy="50" r="36" className="ticks"/><line className="hh" x1="50" y1="50" x2="50" y2="30"/><line className="mh" x1="50" y1="50" x2="50" y2="20"/><circle cx="50" cy="50" r="3.5" className="pin"/></svg>
  <div className="lword" aria-hidden="true">{'REGIS'.split('').map((l,n)=><span key={n} style={{'--d':n*120+'ms'}}>{l}</span>)}</div>
  <p className="lmsg" key={i}>{MSG[i]}</p><div className="lbar" aria-hidden="true"><i/></div></div>,document.body);}
