const K='regis_theme';
const saved=()=>{try{const s=localStorage.getItem(K);return s==='dark'||s==='light'?s:null}catch{return null}};
export const getTheme=()=>saved()||(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
export const applyTheme=t=>{
 document.documentElement.setAttribute('data-theme',t);
 const m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='dark'?'#121311':'#f5f4f0');};
export const setTheme=t=>{try{localStorage.setItem(K,t)}catch{}applyTheme(t)};
applyTheme(getTheme());                                   // runs as soon as the app loads
if(window.matchMedia)window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',e=>{if(!saved())applyTheme(e.matches?'dark':'light')});
