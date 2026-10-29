import {useEffect,useState} from 'react';import {Link} from 'react-router-dom';
import {listWatches} from '../services/watches';import {useAuth} from '../context/AuthContext';import {naira,CREDIT_RATE} from '../services/config';
import Reveal from '../components/Reveal';import Pic from '../components/Pic';import Split from '../components/Split';import CountUp from '../components/CountUp';import Icon from '../components/Icon';
const FEATS=[['shield','Known brands,\nhand picked.','Every watch is listed here, with clear colours and details.'],['truck','Follow every step.','See your order move from processing to packaging to out for delivery, right in your account.'],['star','Credits that come back.','Earn credits on every order and spend them on your next one.']];
const STEPS=[['Pick','Choose a watch and your favourite colour.'],['Order','Send your order on WhatsApp and pay us directly.'],['Track','Follow packaging and delivery from your account, and earn credits.']];
export default function Home(){
 const {user,profile}=useAuth(),[w,setW]=useState([]);
 useEffect(()=>{listWatches().then(setW).catch(()=>{})},[]);
 const latest=w.filter(x=>x.featured).slice(0,8),brands=[...new Set(w.map(x=>x.brand).filter(Boolean))],row=Array(6).fill(brands).flat();
 const st=n=>({'--d':n*120+'ms'});
 return <>
  <section className="hero">
   <h1><Split text="Known brands."/><br/><Split text="Carefully sourced." base={250}/></h1>
   <p className="sub st" style={st(4)}>Affordable. Curated. Yours.</p>
   <div className="ctas st" style={st(5)}><Link className="pill" to="/shop">Shop now</Link><a className="tlink" href="#how">Learn more ›</a></div>
   <div className="stage" aria-hidden="true"><div className="word">{'REGIS'.split('').map((l,i)=><span key={i} style={{animationDelay:600+i*110+'ms'}}>{l}</span>)}</div>
    <img className="heroimg" src="/hero-watch.png" alt="" onError={e=>e.target.remove()}/></div>
  </section>
  {brands.length>0&&<div className="marq" aria-hidden="true"><div>{[...row,...row].map((b,i)=><span key={i}>{b}<i>✦</i></span>)}</div></div>}
  {latest.length>0&&<section id="latest" className="sec" style={{paddingBottom:40}}><div className="wrap"><Reveal><h2 className="title">The latest.</h2><p className="lead">Take a look at what’s new.</p></Reveal></div>
   <div className="rail">{latest.map(x=><Link key={x.id} to={'/watch/'+x.id} className="rcard"><span className="eyebrow">{x.brand||'New'}</span><h3>{x.name}</h3><p className="muted">From {naira(x.price)}</p><Pic w={x}/><span className="tlink">Buy ›</span></Link>)}</div></section>}
  <section className="sec"><div className="wrap"><Reveal><h2 className="title">Why Regis.</h2></Reveal>
   <div className="three">{FEATS.map(([i,t,d],n)=><Reveal key={t} delay={n*100}><div className="feat"><Icon n={i}/><h3>{t}</h3><p className="muted">{d}</p></div></Reveal>)}</div></div></section>
  <section className="tiles one"><Reveal className="wide"><div className="tile g">
   <h2>{user?'Welcome back.':'Shop. Earn. Repeat.'}</h2>
   <p>{user?`You have ${naira(profile?.credits)} in credits to spend.`:'Every order earns credits you can spend on the next one.'}</p>
   <Link className="tlink" to={user?'/shop':'/login'}>{user?'Start shopping ›':'Create your account ›'}</Link>
   <div className="ccard"><div className="chead"><span>Regis credits</span>{!user&&<em>Example</em>}</div><b><CountUp to={user?(profile?.credits||0):1300}/></b><div className="cbar"><i/></div><p>{user?'Applied at checkout, just tick the box.':`Earn ${CREDIT_RATE*100}% back on every order.`}</p></div>
  </div></Reveal></section>
  <section id="how" className="sec"><div className="wrap"><Reveal><h2 className="title">How it works.</h2></Reveal>
   <div className="three">{STEPS.map(([t,d],i)=><Reveal key={t} delay={i*100}><div className="step"><span className="num">{i+1}</span><h3>{t}</h3><p className="muted">{d}</p></div></Reveal>)}</div></div></section>
  <section className="cta-end"><div className="wrap"><Reveal><h2 className="title big">Find your watch.</h2><Link className="pill" to="/shop">Shop the collection</Link></Reveal></div></section></>;}
