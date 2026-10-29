import {useEffect,useState} from 'react';import {Link} from 'react-router-dom';import {listWatches,colorsOf} from '../services/watches';import {naira} from '../services/config';
import Reveal from '../components/Reveal';import Pic from '../components/Pic';import {msg} from '../services/errors';
export default function Shop(){
 const [w,setW]=useState([]),[brand,setBrand]=useState('All'),[q,setQ]=useState(''),[busy,setBusy]=useState(true),[err,setErr]=useState('');
 const load=()=>{setBusy(true);setErr('');listWatches().then(setW).catch(e=>setErr(msg(e,'We couldn’t load the watches.'))).finally(()=>setBusy(false))};
 useEffect(()=>{load();document.title='Shop | Regis';return()=>{document.title='Regis | Curated Watches'}},[]);
 const brands=[...new Set(w.map(x=>x.brand).filter(Boolean))];
 const shown=w.filter(x=>(brand==='All'||x.brand===brand)&&`${x.name} ${x.brand}`.toLowerCase().includes(q.toLowerCase()));
 return <section className="sec" style={{paddingTop:72}}><div className="wrap">
  <h1 className="title big st">Shop.</h1><p className="lead st" style={{'--d':'120ms'}}>Hand-picked watches at honest prices.</p>
  <div className="tools"><div className="chips" role="group" aria-label="Filter by brand">{['All',...brands].map(b=><button key={b} className={b===brand?'on':''} onClick={()=>setBrand(b)}>{b}</button>)}</div>
   <input className="search" type="search" placeholder="Search" aria-label="Search watches" value={q} onChange={e=>setQ(e.target.value)}/></div>
  {busy&&<div className="grid">{[1,2,3,4].map(n=><div key={n} className="card skel"/>)}</div>}
  {err&&<div className="center"><p>{err}</p><button className="pill" onClick={load}>Try again</button></div>}
  {!busy&&!err&&!shown.length&&<p className="center">{w.length?'No watches match your search.':'New pieces landing soon.'}</p>}
  <div className="grid">{shown.map((x,i)=><Reveal key={x.id} delay={(i%4)*80}><Link to={'/watch/'+x.id} className="card">
   <Pic w={x}/><h3>{x.name}</h3><p className="muted">{x.brand}{colorsOf(x).length>1?` · ${colorsOf(x).length} colours`:''}</p><p className="price">{naira(x.price)}</p>
   <span className={'pill'+(x.inStock?'':' dis')}>{x.inStock?'View details':'Sold out'}</span></Link></Reveal>)}</div>
 </div></section>;}
