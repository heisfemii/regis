import {useEffect,useState} from 'react';
import {listWatches,addWatch,updateWatch,deleteWatch,uploadImage,colorsOf,cover} from '../services/watches';
import {allOrders,listUsers,confirmOrder,setStage,stageOf,cancelOrder} from '../services/orders';import {LABEL} from '../components/Tracker';import {auth} from '../services/firebase';
import {useToast} from '../context/ToastContext';import {naira,fmtDate} from '../services/config';import {msg} from '../services/errors';
const blank=()=>({name:'',brand:'',strap:'',price:'',description:'',inStock:true,featured:false,colors:[{name:'',images:[]}]});
const NEXT={packaging:['out_for_delivery','Mark out for delivery'],out_for_delivery:['delivered','Mark delivered']};
const TABS=['Overview','Watches','Orders','Customers'];
const Thumb=({s})=>s?<img className="thumb" src={s} alt=""/>:<div className="thumb"/>;
function OrderRow({x,act}){return <div className="orow"><div className="ohead"><div><b>#{x.id.slice(0,8).toUpperCase()}</b> · {x.customer} <span className="muted">· {x.email} · {fmtDate(x.createdAt)}</span></div><div><b>{naira(x.total)}</b> · <span className={'tag '+x.status}>{x.status==='cancelled'?'cancelled':LABEL[stageOf(x)]}</span></div></div>
 {x.items.map((i,n)=><div className="arow" key={n}><Thumb s={i.image}/><div className="grow"><b>{i.name}</b><p className="muted">{i.brand} · {i.color} · {i.strap} · x{i.qty}</p></div><span>{naira(i.price*i.qty)}</span></div>)}
 {act&&x.status==='pending'&&<div className="ctas left"><button className="pill" disabled={act.busy} onClick={()=>window.confirm('Confirm payment received? The customer gets a thank-you email.')&&act.confirm(x)}>Confirm payment</button><button className="pill ghost" onClick={()=>act.cancel(x)}>Cancel</button></div>}
 {act&&x.status==='paid'&&NEXT[stageOf(x)]&&<div className="ctas left"><button className="pill" onClick={()=>act.next(x)}>{NEXT[stageOf(x)][1]}</button></div>}</div>}
export default function Admin(){
 const toast=useToast(),[tab,setTab]=useState('Overview'),[w,setW]=useState([]),[o,setO]=useState([]),[u,setU]=useState([]),[f,setF]=useState(blank()),[eid,setEid]=useState(null),[busy,setBusy]=useState(false),[mail,setMail]=useState({subject:'',message:''});
 const load=()=>{listWatches().then(setW);allOrders().then(setO);listUsers().then(setU)};useEffect(load,[]);
 const set=k=>e=>setF({...f,[k]:e.target.value});
 const setCol=(i,p)=>setF(s=>({...s,colors:s.colors.map((c,n)=>n===i?{...c,...p}:c)}));
 async function up(i,files){setBusy(true);try{const urls=await Promise.all([...files].map(uploadImage));setF(s=>({...s,colors:s.colors.map((c,n)=>n===i?{...c,images:[...c.images,...urls]}:c)}))}catch(e){toast(msg(e,'We couldn’t upload that photo. Check your connection or try a smaller image.'))}setBusy(false)}
 const reset=()=>{setF(blank());setEid(null)};
 function edit(x){setEid(x.id);setF({name:x.name||'',brand:x.brand||'',strap:x.strap||'',price:String(x.price||''),description:x.description||'',inStock:!!x.inStock,featured:!!x.featured,colors:colorsOf(x).map(c=>({name:c.name,images:[...(c.images||[])]}))});setTab('Watches');scrollTo(0,0)}
 async function save(){
  const colors=f.colors.filter(c=>c.name.trim());
  if(!f.name||!f.price||!colors.length)return toast('Name, price and at least one colour are required');
  setBusy(true);const d={name:f.name,brand:f.brand,strap:f.strap,description:f.description,inStock:f.inStock,featured:!!f.featured,price:Number(f.price),colors};
  try{eid?await updateWatch(eid,d):await addWatch(d);toast(eid?'Watch updated':'Watch added');reset();load()}catch(e){toast(msg(e,'We couldn’t save the watch. Please try again.'))}setBusy(false)}
 const run=async(fn,m)=>{try{await fn();toast(m);load()}catch(e){toast(msg(e,'That didn’t work. Please try again.'))}};
 const doConfirm=async x=>{setBusy(true);try{const j=await confirmOrder(x);toast(j.emailed===false?'Payment confirmed. Email not sent: '+j.emailError:'Payment confirmed. Thank-you email sent');load()}catch(e){toast(e.message||'Failed')}setBusy(false)};
 const act={busy,confirm:doConfirm,next:x=>run(()=>setStage(x,NEXT[stageOf(x)][0]),'Order updated'),cancel:x=>run(()=>cancelOrder(x),'Cancelled')};
 const emails=u.map(x=>x.email).filter(Boolean),paid=o.filter(x=>x.status==='paid');
 async function send(){
  if(!mail.subject||!mail.message)return toast('Add a subject and message');
  if(!window.confirm(`Send this to ${emails.length} customers?`))return;
  setBusy(true);
  try{const t=await auth.currentUser.getIdToken(),r=await fetch('/api/send-promo',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(mail)}),j=await r.json().catch(()=>({error:'Server error '+r.status}));if(!r.ok)throw new Error(j.error);toast(`Sent to ${j.sent} customers`);setMail({subject:'',message:''})}catch(e){toast(e.message||'Could not send')}
  setBusy(false)}
 return <div className="adm"><h1 className="title">Dashboard</h1>
  <div className="chips" role="tablist">{TABS.map(t=><button key={t} className={t===tab?'on':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
  {tab==='Overview'&&<><div className="stats"><div className="stat g"><span>Revenue</span><b>{naira(paid.reduce((s,x)=>s+x.total,0))}</b></div><div className="stat"><span>Paid orders</span><b>{paid.length}</b></div><div className="stat"><span>Awaiting payment</span><b>{o.filter(x=>x.status==='pending').length}</b></div><div className="stat"><span>Customers</span><b>{u.length}</b></div><div className="stat"><span>Watches</span><b>{w.length}</b></div></div>
   <div className="panel"><h2>Recent orders</h2>{!o.length&&<p className="muted">No orders yet.</p>}{o.slice(0,5).map(x=><OrderRow key={x.id} x={x}/>)}</div></>}
  {tab==='Watches'&&<><div className="panel"><h2>{eid?'Edit watch':'Add a watch'}</h2>
   <div className="fgrid"><input placeholder="Name" value={f.name} onChange={set('name')}/><input placeholder="Brand" value={f.brand} onChange={set('brand')}/><input placeholder="Strap" value={f.strap} onChange={set('strap')}/><input placeholder="Price (₦)" type="number" value={f.price} onChange={set('price')}/></div>
   <textarea placeholder="Description" rows="3" value={f.description} onChange={set('description')}/>
   <h3>Colours</h3>{f.colors.map((c,i)=><div className="colrow" key={i}><div className="fgrid"><input placeholder="Colour name (e.g. Black)" value={c.name} onChange={e=>setCol(i,{name:e.target.value})}/><input type="file" accept="image/*" multiple onChange={e=>up(i,e.target.files)}/></div>
    <div className="thumbs">{c.images.map((s,n)=><span className="tw" key={s}><img src={s} alt=""/><a href="#" aria-label="Remove image" onClick={e=>{e.preventDefault();setCol(i,{images:c.images.filter((_,k)=>k!==n)})}}>✕</a></span>)}</div>
    {f.colors.length>1&&<a href="#" onClick={e=>{e.preventDefault();setF({...f,colors:f.colors.filter((_,k)=>k!==i)})}}>Remove this colour</a>}</div>)}
   <button className="pill ghost" onClick={()=>setF({...f,colors:[...f.colors,{name:'',images:[]}]})}>+ Add another colour</button>
   <label><input type="checkbox" checked={f.inStock} onChange={e=>setF({...f,inStock:e.target.checked})}/> In stock</label>
   <label><input type="checkbox" checked={f.featured} onChange={e=>setF({...f,featured:e.target.checked})}/> Show in “The latest” on the home page</label>
   <div className="ctas left"><button className="pill" disabled={busy} onClick={save}>{busy?'Please wait…':eid?'Save changes':'Add watch'}</button>{eid&&<button className="pill ghost" onClick={reset}>Cancel edit</button>}</div></div>
   <div className="panel"><h2>All watches ({w.length})</h2>{w.map(x=><div className="arow" key={x.id}><Thumb s={cover(x)}/><div className="grow"><b>{x.name}</b><p className="muted">{x.brand} · {colorsOf(x).map(c=>c.name).join(', ')} · {naira(x.price)}{x.featured?' · ★ In The latest':''}</p></div>
    <a href="#" onClick={e=>{e.preventDefault();run(()=>updateWatch(x.id,{featured:!x.featured}),x.featured?'Removed from The latest':'Added to The latest')}}>{x.featured?'★ Unfeature':'☆ Feature'}</a><a href="#" onClick={e=>{e.preventDefault();edit(x)}}>Edit</a><a href="#" onClick={e=>{e.preventDefault();run(()=>updateWatch(x.id,{inStock:!x.inStock}),'Updated')}}>{x.inStock?'Mark sold out':'Restock'}</a><a href="#" onClick={e=>{e.preventDefault();window.confirm('Delete this watch?')&&run(()=>deleteWatch(x.id),'Deleted')}}>Delete</a></div>)}</div></>}
  {tab==='Orders'&&<div className="panel"><h2>Orders ({o.length})</h2>{!o.length&&<p className="muted">No orders yet.</p>}{o.map(x=><OrderRow key={x.id} x={x} act={act}/>)}</div>}
  {tab==='Customers'&&<><div className="panel"><h2>Send a promotion</h2><p className="muted">Goes to all {emails.length} registered customers.</p>
   <input placeholder="Subject" value={mail.subject} onChange={e=>setMail({...mail,subject:e.target.value})}/><textarea rows="6" placeholder="Your message" value={mail.message} onChange={e=>setMail({...mail,message:e.target.value})}/>
   <div className="ctas left"><button className="pill" disabled={busy||!emails.length} onClick={send}>{busy?'Sending…':`Send to ${emails.length} customers`}</button><button className="pill ghost" onClick={()=>navigator.clipboard.writeText(emails.join(', ')).then(()=>toast('Emails copied'))}>Copy all emails</button></div></div>
   <div className="panel"><h2>Customers ({u.length})</h2>{u.map(x=><div className="arow" key={x.id}><div className="grow"><b>{x.name}</b><p className="muted">{x.email}</p></div><span>{naira(x.credits)} credits</span></div>)}</div></>}
 </div>;}
