import {useEffect,useState} from 'react';import {Link} from 'react-router-dom';import {listWatches,colorsOf,cover} from '../services/watches';import {useToast} from '../context/ToastContext';import {naira} from '../services/config';import Reveal from '../components/Reveal';
const STEPS=[['Pick','Choose a watch and your favourite colour.'],['Order','Send your order on WhatsApp and pay us directly.'],['Track','Follow packaging and delivery from your account, and earn credits.']];
const Pic=({w})=>{const s=cover(w);return <div className="im">{s?<img src={s} alt={w.name} loading="lazy"/>:<span aria-hidden="true">⌚</span>}</div>};
export default function Shop(){
 const [w,setW]=useState([]),[brand,setBrand]=useState('All'),[q,setQ]=useState(''),[busy,setBusy]=useState(true),toast=useToast();
 useEffect(()=>{listWatches().then(setW).catch(()=>toast('Could not load watches')).finally(()=>setBusy(false))},[]);
 const brands=[...new Set(w.map(x=>x.brand).filter(Boolean))];
 const shown=w.filter(x=>(brand==='All'||x.brand===brand)&&`${x.name} ${x.brand}`.toLowerCase().includes(q.toLowerCase()));
 const st=n=>({'--d':n*120+'ms'});
 return <>
  <section className="hero">
   <h1 className="st" style={st(0)}>Known brands.<br/>Carefully sourced.</h1>
   <p className="sub st" style={st(1)}>Affordable. Curated. Yours.</p>
   <div className="ctas st" style={st(2)}><a className="pill" href="#shop">Shop now</a><a className="tlink" href="#how">Learn more ›</a></div>
   <div className="stage" aria-hidden="true"><div className="word">{'REGIS'.split('').map((l,i)=><span key={i} style={{animationDelay:500+i*110+'ms'}}>{l}</span>)}</div>
    <img className="heroimg" src="/hero-watch.png" alt="" onError={e=>e.target.remove()}/></div>
  </section>
  {w.length>0&&<section id="latest" className="sec" style={{paddingBottom:40}}><div className="wrap"><Reveal><h2 className="title">The latest.</h2><p className="lead">Take a look at what’s new.</p></Reveal></div>
   <div className="rail">{w.slice(0,6).map(x=><Link key={x.id} to={'/watch/'+x.id} className="rcard"><span className="eyebrow">{x.brand||'New'}</span><h3>{x.name}</h3><p className="muted">From {naira(x.price)}</p><Pic w={x}/><span className="tlink">Buy ›</span></Link>)}</div></section>}
  <section id="shop" className="sec"><div className="wrap">
   <Reveal><h2 className="title">The collection.</h2><p className="lead">Hand-picked watches at honest prices.</p></Reveal>
   <div className="tools"><div className="chips" role="group" aria-label="Filter by brand">{['All',...brands].map(b=><button key={b} className={b===brand?'on':''} onClick={()=>setBrand(b)}>{b}</button>)}</div>
    <input className="search" type="search" placeholder="Search" aria-label="Search watches" value={q} onChange={e=>setQ(e.target.value)}/></div>
   {busy&&<p className="center">Loading…</p>}
   {!busy&&!shown.length&&<p className="center">{w.length?'No watches match your search.':'New pieces landing soon.'}</p>}
   <div className="grid">{shown.map((x,i)=><Reveal key={x.id} delay={(i%4)*80}><Link to={'/watch/'+x.id} className="card">
    <Pic w={x}/><h3>{x.name}</h3><p className="muted">{x.brand}{colorsOf(x).length>1?` · ${colorsOf(x).length} colours`:''}</p><p className="price">{naira(x.price)}</p>
    <span className={'pill'+(x.inStock?'':' dis')}>{x.inStock?'View details':'Sold out'}</span></Link></Reveal>)}</div>
  </div></section>
  <section className="tiles one"><Reveal className="wide"><div className="tile g"><h2>Shop. Earn. Repeat.</h2><p>Every order earns credits you can spend on the next one.</p><Link className="tlink" to="/login">Create your account ›</Link></div></Reveal></section>
  <section id="how" className="sec"><div className="wrap"><Reveal><h2 className="title">How it works.</h2></Reveal>
   <div className="three">{STEPS.map(([t,d],i)=><Reveal key={t} delay={i*100}><div className="step"><span className="num">{i+1}</span><h3>{t}</h3><p className="muted">{d}</p></div></Reveal>)}</div></div></section></>;}
