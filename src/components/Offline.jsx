import {useEffect,useState} from 'react';
export default function Offline(){
 const [on,setOn]=useState(typeof navigator==='undefined'||navigator.onLine);
 useEffect(()=>{const a=()=>setOn(true),b=()=>setOn(false);window.addEventListener('online',a);window.addEventListener('offline',b);return()=>{window.removeEventListener('online',a);window.removeEventListener('offline',b)}},[]);
 return on?null:<div className="offline" role="alert">You’re offline. Please check your internet connection. We’ll reconnect automatically.</div>;}
