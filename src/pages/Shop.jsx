import {useEffect,useState} from 'react';import {Link} from 'react-router-dom';import {listWatches} from '../services/watches';import {useCart} from '../context/CartContext';import {useToast} from '../context/ToastContext';import {naira,WHATSAPP_NUMBER} from '../services/config';import Reveal from '../components/Reveal';
const BR=['Curren','Poedagar','Casio'];
const STEPS=[['Pick','Browse the collection and add your favourites to the cart.'],['Order','One tap sends your order straight to our WhatsApp.'],['Earn','Every confirmed order earns credits for your next one.']];
export default function Shop(){
 const [w,setW]=useState([]),[brand,setBrand]=useState('All'),[q,setQ]=useState(''),[busy,setBusy]=useState(true),{add}=useCart(),toast=useToast();
 useEffect(()=>{listWatches().then(setW).catch(()=>toast('Could not load watches')).finally(()=>setBusy(false))},[]);
 const brands=[...new Set(w.map(x=>x.brand).filter(Boolean))],tiles=brands.length?brands:BR;
 const imgOf=b=>w.find(x=>x.brand===b&&x.image)?.image;
 const shown=w.filter(x=>(brand==='All'||x.brand===brand)&&`${x.name} ${x.brand} ${x.color}`.toLowerCase().includes(q.toLowerCase()));
 const pick=b=>{setBrand(b);document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})};
 const st=n=>({'--d':n*120+'ms'});
 return <>
  <section className="hero">
   <h1 className="st" style={st(0)}>Known brands.<br/>Carefully sourced.</h1>
   <p className="sub st" style={st(1)}>Affordable. Curated. Yours.</p>
   <div className="ctas st" style={st(2)}><a className="pill" href="#shop">Shop now</a><a className="tlink" href={`https://wa.me/${WHATSAPP_NUMBER}`}>Chat on WhatsApp ›</a></div>
   <div className="stage" aria-hidden="true"><div className="word">{'REGIS'.split('').map((l,i)=><span key={i} style={{animationDelay:500+i*110+'ms'}}>{l}</span>)}</div>
    <img className="heroimg" src="/hero-watch.png" alt="" onError={e=>e.target.remove()}/></div>
  </section>
  <section id="brands" className="tiles">{tiles.map((b,i)=><Reveal key={b} className={i===0?'wide':''}><div className={'tile '+(i===0?'g':i%2?'':'soft')} data-w={b.toUpperCase()}>
   <h2>{b}</h2><p>Explore the {b} range.</p><button className="tlink" onClick={()=>pick(b)}>Shop {b} ›</button>
   {imgOf(b)&&<img src={imgOf(b)} alt="" loading="lazy"/>}</div></Reveal>)}</section>
  <section id="shop" className="sec"><div className="wrap">
   <Reveal><h2 className="title">The collection.</h2><p className="lead">Hand-picked watches at honest prices.</p></Reveal>
   <div className="tools"><div className="chips" role="group" aria-label="Filter by brand">{['All',...brands].map(b=><button key={b} className={b===brand?'on':''} onClick={()=>setBrand(b)}>{b}</button>)}</div>
    <input className="search" type="search" placeholder="Search" aria-label="Search watches" value={q} onChange={e=>setQ(e.target.value)}/></div>
   {busy&&<p className="center">Loading…</p>}
   {!busy&&!shown.length&&<p className="center">{w.length?'No watches match your search.':'New pieces landing soon.'}</p>}
   <div className="grid">{shown.map((x,i)=><Reveal key={x.id} delay={(i%4)*80}><article className="card">
    <div className="im">{x.image?<img src={x.image} alt={x.name} loading="lazy"/>:<span aria-hidden="true">⌚</span>}</div>
    <h3>{x.name}</h3><p className="muted">{x.brand} · {x.color} · {x.strap}</p><p className="price">{naira(x.price)}</p>
    {x.inStock?<button className="pill" onClick={()=>{add(x);toast('Added to cart')}}>Add to cart</button>:<button className="pill" disabled>Sold out</button>}
   </article></Reveal>)}</div>
  </div></section>
  <section className="tiles one"><Reveal className="wide"><div className="tile g" data-w="CREDITS"><h2>Shop. Earn. Repeat.</h2><p>Every confirmed order earns credits you can spend on the next one.</p><Link className="tlink" to="/login">Create your account ›</Link></div></Reveal></section>
  <section id="how" className="sec"><div className="wrap"><Reveal><h2 className="title">How it works.</h2></Reveal>
   <div className="three">{STEPS.map(([t,d],i)=><Reveal key={t} delay={i*100}><div className="step"><span className="num">{i+1}</span><h3>{t}</h3><p className="muted">{d}</p></div></Reveal>)}</div></div></section></>;}
