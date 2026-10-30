import {useState} from 'react';import {Link} from 'react-router-dom';
const K='regis_cookie_ok',seen=()=>{try{return localStorage.getItem(K)==='1'}catch{return false}};
export default function CookieNotice(){
 const [show,setShow]=useState(()=>!seen());
 if(!show)return null;
 const ok=()=>{try{localStorage.setItem(K,'1')}catch{}setShow(false)};
 return <div className="cookie" role="dialog" aria-label="Cookie notice"><p>We use essential storage to keep your cart and login working. No ads, no tracking. <Link to="/privacy">Learn more</Link></p><button className="pill" onClick={ok}>Got it</button></div>;}
