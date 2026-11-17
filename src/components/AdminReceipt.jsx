import {useEffect,useState} from 'react';import {drawStudio,captionFor} from '../services/receiptArt';import {useToast} from '../context/ToastContext';
// Admin-only popup: builds the Instagram-ready receipt, lets you print or save it, and copies a caption.
export default function AdminReceipt({o,onClose}){
 const toast=useToast(),[fmt,setFmt]=useState('feed'),[nm,setNm]=useState('first'),[pr,setPr]=useState(true),[city,setCity]=useState(''),[url,setUrl]=useState('');
 const opt={format:fmt,nameMode:nm,prices:pr,city:city.trim()},tag=o.id.slice(0,8).toUpperCase();
 useEffect(()=>{let live=true;const t=setTimeout(()=>drawStudio(o,opt).then(c=>live&&setUrl(c.toDataURL('image/png'))).catch(()=>live&&toast('We couldn’t draw the receipt. Please try again.')),150);return()=>{live=false;clearTimeout(t)}},[o,fmt,nm,pr,city]);
 useEffect(()=>{const k=e=>e.key==='Escape'&&onClose();addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[]);
 const save=()=>{const a=document.createElement('a');a.href=url;a.download=`regis-post-${tag}-${fmt}.png`;a.click()};
 const print=()=>{const w=window.open('');if(!w)return toast('Allow pop-ups to print');w.document.write(`<title>Regis ${tag}</title><style>@page{margin:0}body{margin:0;display:flex;justify-content:center}img{max-width:100%;max-height:100vh}</style><img src="${url}" onload="setTimeout(()=>print(),150)">`);w.document.close()};
 const copy=()=>navigator.clipboard.writeText(captionFor(o,opt)).then(()=>toast('Caption copied'),()=>toast('Could not copy'));
 const B=(v,set,list)=><div className="chips">{list.map(([k,l])=><button type="button" key={k} className={v===k?'on':''} aria-pressed={v===k} onClick={()=>set(k)}>{l}</button>)}</div>;
 return <div role="dialog" aria-modal="true" aria-label="Content receipt" style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(20,24,12,.9)',display:'flex',flexWrap:'wrap',gap:20,alignItems:'center',justifyContent:'center',padding:16,overflow:'auto'}}>
  <div style={{flex:'0 1 auto'}}>{url?<img src={url} alt="Receipt preview" style={{display:'block',maxWidth:'100%',maxHeight:'88vh',borderRadius:12}}/>:<p style={{color:'#f5f4f0'}}>Drawing…</p>}</div>
  <div style={{background:'#f5f4f0',borderRadius:16,padding:20,width:'min(340px,100%)',display:'flex',flexDirection:'column',gap:12}}>
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b>Content receipt · #{tag}</b><button className="pill ghost" onClick={onClose}>Close</button></div>
   <p className="muted">Format</p>{B(fmt,setFmt,[['feed','Post 4:5'],['story','Story 9:16']])}
   <p className="muted">Customer name on the post</p>{B(nm,setNm,[['first','First name'],['initials','Initials'],['hidden','Hidden']])}
   <label><input type="checkbox" checked={pr} onChange={e=>setPr(e.target.checked)}/> Show prices and total</label>
   <input placeholder="City (optional), e.g. Ilorin" value={city} onChange={e=>setCity(e.target.value)} maxLength={30}/>
   <p className="muted">Email, phone and address are never on this image.</p>
   <div className="ctas left"><button className="pill" disabled={!url} onClick={save}>Save image</button><button className="pill ghost" disabled={!url} onClick={print}>Print</button><button className="pill ghost" onClick={copy}>Copy caption</button></div>
  </div></div>}