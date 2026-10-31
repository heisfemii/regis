import {useEffect,useState} from 'react';
import {listWatches,addWatch,updateWatch,deleteWatch,uploadImage,colorsOf,cover} from '../services/watches';
import {setMarketing,allOrders,listUsers,listAdminIds,confirmOrder,setStage,stageOf,cancelOrder} from '../services/orders';import {LABEL} from '../components/Tracker';import {auth} from '../services/firebase';
import {useToast} from '../context/ToastContext';import {naira,fmtDate,normalizePhone,validPhone,fmtPhone} from '../services/config';import {TEMPLATES,fill} from '../services/templates';import {useSettings} from '../context/SettingsContext';import {saveWhatsapp} from '../services/settings';import {msg} from '../services/errors';
const blank=()=>({name:'',brand:'',strap:'',price:'',description:'',inStock:true,featured:false,demo:'',colors:[{name:'',images:[]}]});
const NEXT={packaging:['out_for_delivery','Mark out for delivery'],out_for_delivery:['delivered','Mark delivered']};
const TABS=['Overview','Watches','Orders','Customers','Settings'];
function Orders({o,act}){
 const [q,setQ]=useState('');
 const s=q.trim().replace(/^#/,'').toLowerCase();
 const list=s?o.filter(x=>x.id.toLowerCase().includes(s)||(x.customer||'').toLowerCase().includes(s)||(x.email||'').toLowerCase().includes(s)):o;
 return <div className="panel"><h2>Orders ({s?`${list.length} of ${o.length}`:o.length})</h2>
  <input type="search" placeholder="Search by order ID, e.g. JEP35D3Y" value={q} onChange={e=>setQ(e.target.value)} aria-label="Search orders" style={{marginBottom:16}}/>
  {!o.length&&<p className="muted">No orders yet.</p>}
  {!!o.length&&!list.length&&<p className="muted">No order matches “{q.trim()}”.</p>}
  {list.map(x=><OrderRow key={x.id} x={x} act={act}/>)}</div>;}
const Thumb=({s})=>s?<img className="thumb" src={s} alt=""/>:<div className="thumb"/>;
function OrderRow({x,act}){return <div className="orow"><div className="ohead"><div><b>#{x.id.slice(0,8).toUpperCase()}</b> · {x.customer} <span className="muted">· {x.email} · {fmtDate(x.createdAt)}</span></div><div><b>{naira(x.total)}</b> · <span className={'tag '+x.status}>{x.status==='cancelled'?'cancelled':LABEL[stageOf(x)]}</span></div></div>
 {x.items.map((i,n)=><div className="arow" key={n}><Thumb s={i.image}/><div className="grow"><b>{i.name}</b><p className="muted">{i.brand} · {i.color} · {i.strap} · x{i.qty}</p></div><span>{naira(i.price*i.qty)}</span></div>)}
 {act&&x.status==='pending'&&<div className="ctas left"><button className="pill" disabled={act.busy} onClick={()=>window.confirm('Confirm payment received? The customer gets a thank-you email.')&&act.confirm(x)}>Confirm payment</button><button className="pill ghost" onClick={()=>act.cancel(x)}>Cancel</button></div>}
 {act&&x.status==='paid'&&NEXT[stageOf(x)]&&<div className="ctas left"><button className="pill" onClick={()=>act.next(x)}>{NEXT[stageOf(x)][1]}</button></div>}</div>}
export default function Admin(){
 const {whatsapp,setWhatsapp}=useSettings(),toast=useToast(),[tab,setTab]=useState('Overview'),[w,setW]=useState([]),[o,setO]=useState([]),[u,setU]=useState([]),[adm,setAdm]=useState([]),[f,setF]=useState(blank()),[eid,setEid]=useState(null),[busy,setBusy]=useState(false),[mail,setMail]=useState({subject:'',message:'',watchId:''}),[tpl,setTpl]=useState('blank'),[waIn,setWaIn]=useState('');
 const load=()=>{listWatches().then(setW);allOrders().then(setO);listUsers().then(setU);listAdminIds().then(setAdm).catch(()=>{})};useEffect(load,[]);
 const set=k=>e=>setF({...f,[k]:e.target.value});
 const setCol=(i,p)=>setF(s=>({...s,colors:s.colors.map((c,n)=>n===i?{...c,...p}:c)}));
 async function up(i,files){setBusy(true);try{const urls=await Promise.all([...files].map(uploadImage));setF(s=>({...s,colors:s.colors.map((c,n)=>n===i?{...c,images:[...c.images,...urls]}:c)}))}catch(e){toast(msg(e,'We couldn’t upload that photo. Check your connection or try a smaller image.'))}setBusy(false)}
 async function upDemo(file){if(!file)return;setBusy(true);try{const url=await uploadImage(file);setF(s=>({...s,demo:url}))}catch(e){toast(msg(e,'We couldn’t upload that photo. Check your connection or try a smaller image.'))}setBusy(false)}
 const reset=()=>{setF(blank());setEid(null)};
 function edit(x){setEid(x.id);setF({name:x.name||'',brand:x.brand||'',strap:x.strap||'',price:String(x.price||''),description:x.description||'',inStock:!!x.inStock,featured:!!x.featured,demo:x.demo||'',colors:colorsOf(x).map(c=>({name:c.name,images:[...(c.images||[])]}))});setTab('Watches');scrollTo(0,0)}
 async function save(){
  const colors=f.colors.filter(c=>c.name.trim());
  if(!f.name||!f.price||!colors.length)return toast('Name, price and at least one colour are required');
  setBusy(true);const d={name:f.name,brand:f.brand,strap:f.strap,description:f.description,inStock:f.inStock,featured:!!f.featured,demo:f.demo||'',price:Number(f.price),colors};
  try{eid?await updateWatch(eid,d):await addWatch(d);toast(eid?'Watch updated':'Watch added');reset();load()}catch(e){toast(msg(e,'We couldn’t save the watch. Please try again.'))}setBusy(false)}
 const run=async(fn,m)=>{try{await fn();toast(m);load()}catch(e){toast(msg(e,'That didn’t work. Please try again.'))}};
 const doConfirm=async x=>{setBusy(true);try{const j=await confirmOrder(x);toast(j.emailed===false?'Payment confirmed. Email not sent: '+j.emailError:'Payment confirmed. Thank-you email sent'+(j.receipt==='text'?' (receipt as text, picture failed: '+(j.receiptError||'unknown')+')':''));load()}catch(e){toast(e.message||'Failed')}setBusy(false)};
 const act={busy,confirm:doConfirm,next:x=>run(()=>setStage(x,NEXT[stageOf(x)][0]),'Order updated'),cancel:x=>run(()=>cancelOrder(x),'Cancelled')};
 const cu=u.filter(x=>!adm.includes(x.id)),emails=cu.filter(x=>x.marketing!==false).map(x=>x.email).filter(Boolean),paid=o.filter(x=>x.status==='paid');
 async function send(test){
  if(!mail.subject||!mail.message)return toast('Add a subject and message');
  if(!test&&!window.confirm(`Send this to ${emails.length} customers?`))return;
  setBusy(true);
  try{const t=await auth.currentUser.getIdToken(),r=await fetch('/api/send-promo',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify({...mail,test:!!test})}),j=await r.json().catch(()=>({error:'Server error '+r.status}));if(!r.ok)throw new Error(j.error);toast(test?'Test sent to your email':`Sent to ${j.sent} customers`);if(!test){setMail({subject:'',message:'',watchId:''});setTpl('blank')}}catch(e){toast(e.message||'Could not send')}
  setBusy(false)}
 const pickTpl=(id,wid)=>{setTpl(id);const t=TEMPLATES.find(x=>x.id===id),wt=w.find(x=>x.id===wid);if(t?.watch&&!wt){setMail(m=>({...m,watchId:wid||''}));return}setMail({...fill(id,wt),watchId:t?.watch?wid:''})};
 async function saveWa(){const n=normalizePhone(waIn);if(!validPhone(n))return toast('Enter a valid phone number, for example 0803 123 4567.');setBusy(true);try{await saveWhatsapp(n);setWhatsapp(n);setWaIn('');toast('WhatsApp number updated everywhere')}catch(e){toast(msg(e,'We couldn’t save the number. Please try again.'))}setBusy(false)}
 return <div className="adm"><h1 className="title">Dashboard</h1>
  <div className="chips" role="tablist">{TABS.map(t=><button key={t} className={t===tab?'on':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
  {tab==='Overview'&&<><div className="stats"><div className="stat g"><span>Revenue</span><b>{naira(paid.reduce((s,x)=>s+x.total,0))}</b></div><div className="stat"><span>Paid orders</span><b>{paid.length}</b></div><div className="stat"><span>Awaiting payment</span><b>{o.filter(x=>x.status==='pending').length}</b></div><div className="stat"><span>Customers</span><b>{cu.length}</b></div><div className="stat"><span>Watches</span><b>{w.length}</b></div></div>
   <div className="panel"><h2>Recent orders</h2>{!o.length&&<p className="muted">No orders yet.</p>}{o.slice(0,5).map(x=><OrderRow key={x.id} x={x}/>)}</div></>}
  {tab==='Watches'&&<><div className="panel"><h2>{eid?'Edit watch':'Add a watch'}</h2>
   <div className="fgrid"><input placeholder="Name" value={f.name} onChange={set('name')}/><input placeholder="Brand" value={f.brand} onChange={set('brand')}/><input placeholder="Strap" value={f.strap} onChange={set('strap')}/><input placeholder="Price (₦)" type="number" value={f.price} onChange={set('price')}/></div>
   <textarea placeholder="Description" rows="3" value={f.description} onChange={set('description')}/>
   <h3>Display image</h3><p className="muted">The clean studio shot shown on the shop and home page. Customers see the real photos below once they tap the watch.</p>
   <div className="colrow"><input type="file" accept="image/*" onChange={e=>upDemo(e.target.files[0])}/>{f.demo&&<div className="thumbs"><span className="tw"><img src={f.demo} alt=""/><a href="#" aria-label="Remove display image" onClick={e=>{e.preventDefault();setF({...f,demo:''})}}>✕</a></span></div>}</div>
   <h3>Colours and real photos</h3>{f.colors.map((c,i)=><div className="colrow" key={i}><div className="fgrid"><input placeholder="Colour name (e.g. Black)" value={c.name} onChange={e=>setCol(i,{name:e.target.value})}/><input type="file" accept="image/*" multiple onChange={e=>up(i,e.target.files)}/></div>
    <div className="thumbs">{c.images.map((s,n)=><span className="tw" key={s}><img src={s} alt=""/><a href="#" aria-label="Remove image" onClick={e=>{e.preventDefault();setCol(i,{images:c.images.filter((_,k)=>k!==n)})}}>✕</a></span>)}</div>
    {f.colors.length>1&&<a href="#" onClick={e=>{e.preventDefault();setF({...f,colors:f.colors.filter((_,k)=>k!==i)})}}>Remove this colour</a>}</div>)}
   <button className="pill ghost" onClick={()=>setF({...f,colors:[...f.colors,{name:'',images:[]}]})}>+ Add another colour</button>
   <label><input type="checkbox" checked={f.inStock} onChange={e=>setF({...f,inStock:e.target.checked})}/> In stock</label>
   <label><input type="checkbox" checked={f.featured} onChange={e=>setF({...f,featured:e.target.checked})}/> Show in “The latest” on the home page</label>
   <div className="ctas left"><button className="pill" disabled={busy} onClick={save}>{busy?'Please wait…':eid?'Save changes':'Add watch'}</button>{eid&&<button className="pill ghost" onClick={reset}>Cancel edit</button>}</div></div>
   <div className="panel"><h2>All watches ({w.length})</h2>{w.map(x=><div className="arow" key={x.id}><Thumb s={cover(x)}/><div className="grow"><b>{x.name}</b><p className="muted">{x.brand} · {colorsOf(x).map(c=>c.name).join(', ')} · {naira(x.price)}{x.featured?' · ★ In The latest':''}</p></div>
    <a href="#" onClick={e=>{e.preventDefault();run(()=>updateWatch(x.id,{featured:!x.featured}),x.featured?'Removed from The latest':'Added to The latest')}}>{x.featured?'★ Unfeature':'☆ Feature'}</a><a href="#" onClick={e=>{e.preventDefault();edit(x)}}>Edit</a><a href="#" onClick={e=>{e.preventDefault();run(()=>updateWatch(x.id,{inStock:!x.inStock}),'Updated')}}>{x.inStock?'Mark sold out':'Restock'}</a><a href="#" onClick={e=>{e.preventDefault();window.confirm('Delete this watch?')&&run(()=>deleteWatch(x.id),'Deleted')}}>Delete</a></div>)}</div></>}
{tab==='Orders'&&<Orders o={o} act={act}/>}<h2>Orders ({o.length})</h2>{!o.length&&<p className="muted">No orders yet.</p>}{o.map(x=><OrderRow key={x.id} x={x} act={act}/>)}</div>}
  {tab==='Customers'&&<><div className="panel"><h2>Send a promotion</h2><p className="muted">Goes to {emails.length} subscribed customers. Unsubscribed customers are skipped.</p>
   <div className="fgrid"><select aria-label="Template" value={tpl} onChange={e=>pickTpl(e.target.value,mail.watchId)}>{TEMPLATES.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}</select>
   {TEMPLATES.find(t=>t.id===tpl)?.watch&&<select aria-label="Watch" value={mail.watchId} onChange={e=>pickTpl(tpl,e.target.value)}><option value="">Choose a watch…</option>{w.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>}</div>
   <input placeholder="Subject" value={mail.subject} onChange={e=>setMail({...mail,subject:e.target.value})}/><textarea rows="8" placeholder="Your message" value={mail.message} onChange={e=>setMail({...mail,message:e.target.value})}/>
   <p className="muted">Write {'{name}'} to insert each customer’s first name. Every email gets an unsubscribe link automatically.</p>
   <div className="ctas left"><button className="pill" disabled={busy||!emails.length} onClick={()=>send(false)}>{busy?'Sending…':`Send to ${emails.length} customers`}</button><button className="pill ghost" disabled={busy} onClick={()=>send(true)}>Send test to me</button><button className="pill ghost" onClick={()=>navigator.clipboard.writeText(emails.join(', ')).then(()=>toast('Emails copied'))}>Copy emails</button></div></div>
   <div className="panel"><h2>Customers ({cu.length})</h2>{cu.map(x=><div className="arow" key={x.id}><div className="grow"><b>{x.name}</b><p className="muted">{x.email}</p></div><span className={'tag '+(x.marketing===false?'':'paid')}>{x.marketing===false?'Unsubscribed':'Subscribed'}</span><span>{naira(x.credits)} credits</span><a href="#" onClick={e=>{e.preventDefault();run(()=>setMarketing(x.id,x.marketing===false),'Updated')}}>{x.marketing===false?'Add back':'Remove from promotions'}</a></div>)}</div></>}
  {tab==='Settings'&&<div className="panel"><h2>WhatsApp number</h2><p className="muted">Customers use this number for orders and support. Saving it updates the whole website.</p><input placeholder="e.g. 0803 123 4567" value={waIn} onChange={e=>setWaIn(e.target.value)}/><p className="muted">Currently: {fmtPhone(whatsapp)}</p><div className="ctas left"><button className="pill" disabled={busy} onClick={saveWa}>Save number</button></div></div>}
 </div>;}
