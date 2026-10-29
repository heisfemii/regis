const seen=new Set();
export const loaded=u=>seen.has(u);
export function preload(urls,max=10000){
 const list=[...new Set(urls.filter(Boolean))].filter(u=>!seen.has(u));
 if(!list.length)return Promise.resolve();
 const all=Promise.all(list.map(u=>new Promise(r=>{const i=new Image();i.onload=i.onerror=()=>{seen.add(u);r()};i.src=u})));
 return Promise.race([all,new Promise(r=>setTimeout(r,max))]);}
