import {useEffect,useState} from 'react';import {Link} from 'react-router-dom';import {listWatches,colorsOf,cover,cached} from '../services/watches';import {preload} from '../services/preload';import Loader from '../components/Loader';import {naira} from '../services/config';
import Reveal from '../components/Reveal';import Pic from '../components/Pic';import {msg} from '../services/errors';import {GENDERS} from '../services/genders';
export default function Shop(){
 const [w,setW]=useState(cached()||[]),[brand,setBrand]=useState('All'),[who,setWho]=useState('all'),[q,setQ]=useState(''),[busy,setBusy]=useState(!cached()),[err,setErr]=useState('');
 const load=()=>{setBusy(!cached());setErr('');listWatches().then(async l=>{setW(l);await preload(l.map(cover))}).catch(e=>setErr(msg(e,'We couldn’t load the watches.'))).finally(()=>setBusy(false))};
 useEffect(()=>{load();document.title='Shop | Regis';return()=>{document.title='Regis | Curated Watches'}},[]);
 const kinds=GENDERS.filter(g=>w.some(x=>x.gender===g.id)),pool=w.filter(x=>who==='all'||x.gender===who);
 const brands=[...new Set(pool.map(x=>x.brand).filter(Boolean))],bsel=brands.includes(brand)?brand:'All';
 const shown=pool.filter(x=>(bsel==='All'||x.brand===bsel)&&`${x.name} ${x.brand}`.toLowerCase().includes(q.toLowerCase()));
 if(busy)return <Loader/>;
 return <section className="sec" style={{paddingTop:72}}><div className="wrap">
  <h1 className="title big st">Shop.</h1><p className="lead st" style={{'--d':'120ms'}}>Hand-picked watches at honest prices.</p>
  <div className="sfilters">
   <input className="search" type="search" placeholder="Search watches" aria-label="Search watches" value={q} onChange={e=>setQ(e.target.value)}/>
   {kinds.length>0&&<div className="frow"><span className="flabel">Show</span><div className="chips" role="group" aria-label="Filter by who it is for">{[{id:'all',label:'All watches'},...kinds].map(g=><button key={g.id} className={g.id===who?'on':''} aria-pressed={g.id===who} onClick={()=>{setWho(g.id);setBrand('All')}}>{g.label}</button>)}</div></div>}
   <div className="frow"><span className="flabel">Brand</span><div className="chips" role="group" aria-label="Filter by brand">{['All',...brands].map(b=><button key={b} className={b===bsel?'on':''} aria-pressed={b===bsel} onClick={()=>setBrand(b)}>{b}</button>)}</div></div>
  </div>
  {err&&<div className="center"><p>{err}</p><button className="pill" onClick={load}>Try again</button></div>}
  {!busy&&!err&&!shown.length&&<p className="center">{w.length?'No watches match your search.':'New pieces landing soon.'}</p>}
  <div className="grid">{shown.map((x,i)=><Reveal key={x.id} delay={(i%4)*80}><Link to={'/watch/'+x.id} className="card">
   <Pic w={x}/><h3>{x.name}</h3><p className="muted">{x.brand}{colorsOf(x).length>1?` · ${colorsOf(x).length} colours`:''}</p><p className="price">{naira(x.price)}</p>
   <span className={'pill'+(x.inStock?'':' dis')}>{x.inStock?'View details':'Sold out'}</span></Link></Reveal>)}</div>
 </div></section>;}