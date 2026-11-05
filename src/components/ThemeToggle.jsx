import {useState} from 'react';import {getTheme,setTheme} from '../theme';import '../dark.css';
const Moon=()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>;
const Sun=()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>;
export default function ThemeToggle(){
 const [t,setT]=useState(()=>document.documentElement.getAttribute('data-theme')||getTheme());
 const flip=()=>{const n=t==='dark'?'light':'dark';setTheme(n);setT(n)};
 const label=t==='dark'?'Switch to light mode':'Switch to dark mode';
 return <button type="button" className="theme-toggle" onClick={flip} aria-label={label} title={label}>{t==='dark'?<Sun/>:<Moon/>}</button>;}
