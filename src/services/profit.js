import {useState} from 'react';
import {saveCost} from '../services/costs';
import {summarize,byMonth,monthKey,when,workbook} from '../services/profit';
import {naira} from '../services/config';
import {useToast} from '../context/ToastContext';
// Admin tab: enter what each watch costs you, see real profit by month, download the sales spreadsheet.
const pct=n=>(n*100).toFixed(1)+'%';
export default function ProfitTab({w,o,costs,reload}){
 const toast=useToast(),paid=o.filter(x=>x.status==='paid'),months=byMonth(paid,costs),[k,setK]=useState('all'),[ed,setEd]=useState({}),[busy,setBusy]=useState('');
 const sel=k==='all'?paid:paid.filter(x=>monthKey(when(x))===k),S=summarize(sel,costs);
 const val=(id,f)=>ed[id]?.[f]??(costs[id]?.[f]??''),has=id=>costs[id]&&costs[id].cost!==''&&costs[id].cost!=null;
 const setF=(id,f,v)=>setEd(p=>({...p,[id]:{...p[id],[f]:v.replace(/[^\d.]/g,'')}}));
 const save=async id=>{const c=val(id,'cost'),d=val(id,'delivery');
  if(c===''||isNaN(+c))return toast('Enter what the watch cost you, as a number');
  if(d!==''&&isNaN(+d))return toast('Enter the delivery cost as a number');
  setBusy(id);try{await saveCost(id,{cost:c,delivery:d||0});setEd(p=>{const n={...p};delete n[id];return n});toast('Cost saved');reload()}catch{toast('We couldn’t save that cost. Please try again.')}setBusy('')};
 const dl=()=>{const b=workbook(paid,costs,k),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=`regis-sales-${k}.xlsx`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),3000)};
 const list=[...w].sort((a,b)=>has(a.id)-has(b.id));
 return <><div className="panel"><h2>Profit</h2>
  <div className="chips" style={{margin:'8px 0 14px'}}><button type="button" className={k==='all'?'on':''} onClick={()=>setK('all')}>All time</button>{months.map(m=><button type="button" key={m.key} className={k===m.key?'on':''} onClick={()=>setK(m.key)}>{m.label}</button>)}</div>
  <div className="stats"><div className="stat g"><span>Profit</span><b>{naira(S.profit)}</b></div><div className="stat"><span>Sales</span><b>{naira(S.sales)}</b></div><div className="stat"><span>Cost</span><b>{naira(S.cost)}</b></div><div className="stat"><span>Margin</span><b>{S.costedSales?pct(S.margin):'-'}</b></div></div>
  {S.missing>0&&<p className="muted" style={{margin:'10px 0'}}>{S.missing} paid order{S.missing===1?'':'s'} left out of cost and profit because a watch in {S.missing===1?'it has':'them has'} no cost yet. Add the costs below.</p>}
  {!paid.length&&<p className="muted" style={{margin:'10px 0'}}>No paid orders yet.</p>}
  <div className="ctas left" style={{marginTop:12}}><button className="pill" disabled={!paid.length} onClick={dl}>Download spreadsheet (.xlsx)</button></div>
  <p className="muted" style={{marginTop:8}}>The spreadsheet has a monthly summary, every order, and sales by watch for {k==='all'?'all time':months.find(m=>m.key===k)?.label}.</p>
  {months.length>0&&<div style={{marginTop:18}}>{months.map(m=><div className="arow" key={m.key}><div className="grow"><b>{m.label}</b><p className="muted">{m.count} order{m.count===1?'':'s'} · {m.items} watch{m.items===1?'':'es'} · sales {naira(m.sales)}{m.missing?` · ${m.missing} missing costs`:''}</p></div><b>{naira(m.profit)}</b></div>)}</div>}
 </div>
 <div className="panel"><h2>What each watch costs you</h2>
  <p className="muted">Cost is what you paid for the watch. Delivery is what it cost to get it to you. Only admins can see these numbers, and customers never can. Orders that were already paid use the cost you enter here. From now on, each order keeps the cost it had when it was paid.</p>
  {!w.length&&<p className="muted">No watches yet.</p>}
  {list.map(x=>{const c=val(x.id,'cost'),d=val(x.id,'delivery'),dirty=!!ed[x.id],tot=(+c||0)+(+d||0);
   return <div className="arow" key={x.id} style={{flexWrap:'wrap',gap:10}}>
    <div className="grow" style={{minWidth:160}}><b>{x.name}</b><p className="muted">{x.brand?x.brand+' · ':''}Sells for {naira(x.price)}{c!==''?` · makes ${naira(x.price-tot)} each`:''}</p></div>
    {!has(x.id)&&!dirty&&<span className="tag">Missing</span>}
    <input inputMode="decimal" aria-label={`Cost of ${x.name}`} placeholder="Watch cost ₦" value={c} onChange={e=>setF(x.id,'cost',e.target.value)} style={{width:130}}/>
    <input inputMode="decimal" aria-label={`Delivery cost of ${x.name}`} placeholder="Delivery ₦" value={d} onChange={e=>setF(x.id,'delivery',e.target.value)} style={{width:110}}/>
    {dirty&&<button className="pill" disabled={busy===x.id} onClick={()=>save(x.id)}>{busy===x.id?'Saving…':'Save'}</button>}
   </div>})}
 </div></>}