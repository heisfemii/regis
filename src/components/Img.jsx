import {useState} from 'react';import {loaded} from '../services/preload';import {opt} from '../services/cdn';
export default function Img({src,alt='',w=700,...p}){
 const [ok,setOk]=useState(()=>loaded(opt(src,w))),[bad,setBad]=useState(false);
 if(bad)return <span aria-hidden="true">⌚</span>;
 return <img src={opt(src,w)} alt={alt} loading="lazy" decoding="async" onLoad={()=>setOk(true)} onError={()=>setBad(true)} className={ok?'loaded':'fadein'} {...p}/>;}