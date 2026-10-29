import {useState} from 'react';
export default function Img({src,alt='',...p}){
 const [ok,setOk]=useState(false),[bad,setBad]=useState(false);
 if(bad)return <span aria-hidden="true">⌚</span>;
 return <img src={src} alt={alt} loading="lazy" onLoad={()=>setOk(true)} onError={()=>setBad(true)} className={ok?'loaded':'fadein'} {...p}/>;}
