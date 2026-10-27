import {useEffect,useState} from 'react';import {listWatches} from '../services/watches';import {useCart} from '../context/CartContext';import {useToast} from '../context/ToastContext';import {naira,WHATSAPP_NUMBER} from '../services/config';import Reveal from '../components/Reveal';import Icon from '../components/Icon';
const BR=['Curren','Poedagar','Casio'];
const STEPS=[['Pick your watch','Browse the collection and add your favourites to the cart.'],['Order on WhatsApp','One tap sends your order details straight to our chat.'],['Earn credits','Every confirmed order earns credits you can use on the next one.']];
const TRUST=[['shield','Real brands','Sold under their true brand names.'],['truck','Nationwide delivery','We deliver to all states in Nigeria.'],['chat','Real people','Chat with us on WhatsApp before you buy.'],['star','Credits','Earn credits on every confirmed order.']];
export default function Shop(){
 const [w,setW]=useState([]),[brand,setBrand]=useState('All'),[q,setQ]=useState(''),[busy,setBusy]=useState(true),{add}=useCart(),toast=useToast();
 useEffect(()=>{listWatches().then(setW).catch(()=>toast('Could not load watches')).finally(()=>setBusy(false))},[]);
 const brands=[...new Set(w.map(x=>x.brand).filter(Boolean))],tiles=brands.length?brands:BR;
 const shown=w.filter(x=>(brand==='All'||x.brand===brand)&&`${x.name} ${x.brand} ${x.color}`.toLowerCase().includes(q.toLowerCase()));
 const pick=b=>{setBrand(b);document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})};
 const st=n=>({'--d':n*100+'ms'});
 return <>
  <section className="hero"><div className="wrap hero2">
   <div><p className="eyebrow st" style={st(0)}>Curated watches</p>
    <h1 className="st" style={st(1)}>Known brands, carefully sourced.</h1>
    <p className="lead st" style={st(2)}>Affordable. Curated. Yours. Stylish watches for men and women, delivered across Nigeria.</p>
    <div className="cta st" style={st(3)}><a href="#shop" className="btn">Shop watches</a><a className="btn ghost" href={`https://wa.me/${WHATSAPP_NUMBER}`}>Chat on WhatsApp</a></div></div>
   <div className="visual st" style={st(2)} aria-hidden="true"><div className="word">{'REGIS'.split('').map((l,i)=><span key={i} style={{animationDelay:300+i*100+'ms'}}>{l}</span>)}</div>
    <img className="heroimg" src="/hero-watch.png" alt="" onError={e=>e.target.remove()}/></div>
  </div></section>
  <div className="strip"><div className="wrap trust">{TRUST.map(([i,t,d])=><div className="tr" key={t}><Icon n={i}/><div><h3>{t}</h3><p>{d}</p></div></div>)}</div></div>
  <section className="alt sec"><div className="wrap">
   <Reveal><h2 className="title">Shop by brand</h2><p className="lead">Pick a brand to see its watches.</p></Reveal>
   <div className="tiles">{tiles.map((b,i)=><Reveal key={b} delay={i*100}><button className="tile" onClick={()=>pick(b)}><h3>{b}</h3><span>Shop {b} →</span></button></Reveal>)}</div>
  </div></section>
  <section id="shop" className="sec"><div className="wrap">
   <Reveal><h2 className="title">The collection</h2></Reveal>
   <div className="tools"><div className="chips" role="group" aria-label="Filter by brand">{['All',...brands].map(b=><button key={b} className={b===brand?'on':''} onClick={()=>setBrand(b)}>{b}</button>)}</div>
    <input className="search" type="search" placeholder="Search watches" aria-label="Search watches" value={q} onChange={e=>setQ(e.target.value)}/></div>
   {busy&&<p className="center">Loading watches…</p>}
   {!busy&&!shown.length&&<p className="center">{w.length?'No watches match your search.':'New pieces landing soon.'}</p>}
   <div className="grid">{shown.map((x,i)=><Reveal key={x.id} delay={(i%4)*80}><article className="card">
    <div className="im">{x.image?<img src={x.image} alt={x.name} loading="lazy"/>:<span aria-hidden="true">⌚</span>}</div>
    <h3>{x.name}</h3><p className="muted">{x.brand} · {x.color} · {x.strap}</p><b>{naira(x.price)}</b>
    {x.inStock?<button onClick={()=>{add(x);toast('Added to cart')}}>Add to cart</button>:<button disabled>Sold out</button>}
   </article></Reveal>)}</div>
  </div></section>
  <section className="alt sec"><div className="wrap"><Reveal><h2 className="title">How it works</h2></Reveal>
   <div className="three">{STEPS.map(([t,d],i)=><Reveal key={t} delay={i*100}><div className="step"><span className="num">0{i+1}</span><h3>{t}</h3><p className="muted">{d}</p></div></Reveal>)}</div></div></section></>;}
