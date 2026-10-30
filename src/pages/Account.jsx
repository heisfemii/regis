import {useEffect,useState} from 'react';import {Link} from 'react-router-dom';import {useAuth} from '../context/AuthContext';import {myOrders} from '../services/orders';import {msg} from '../services/errors';import Tracker from '../components/Tracker';import {naira,fmtDate,firstName} from '../services/config';
export default function Account(){
 const {user,profile}=useAuth(),[o,setO]=useState(null);
 const [err,setErr]=useState('');
 const load=()=>{setErr('');myOrders(user.uid).then(setO).catch(e=>{setO([]);setErr(msg(e,'We couldn’t load your orders.'))})};useEffect(load,[]);
 const paid=(o||[]).filter(x=>x.status==='paid'),earned=paid.reduce((s,x)=>s+(x.creditsEarned||0),0),spent=paid.reduce((s,x)=>s+x.total,0);
 return <div className="adm"><h1 className="title">Hi, {firstName(profile?.name||user.displayName)}.</h1><p className="lead">Your credits apply automatically at checkout.</p>
  <div className="stats"><div className="stat g"><span>Credits balance</span><b>{naira(profile?.credits)}</b></div><div className="stat"><span>Credits earned</span><b>{naira(earned)}</b></div><div className="stat"><span>Orders</span><b>{paid.length}</b></div><div className="stat"><span>Total spent</span><b>{naira(spent)}</b></div></div>
  <div className="panel"><h2>Your orders</h2>{err&&<div className="center"><p>{err}</p><button className="pill" onClick={load}>Try again</button></div>}{o===null&&<p className="muted">Loading…</p>}{o&&!o.length&&!err&&<p className="muted">No orders yet. <Link className="tlink" to="/">Start shopping ›</Link></p>}
   {o?.map(x=><div className="orow" key={x.id}><div className="arow">{x.items[0]?.image?<img className="thumb" src={x.items[0].image} alt=""/>:<div className="thumb"/>}
    <div className="grow"><b>{x.items.map(i=>i.name).join(', ')}</b><p className="muted">#{x.id.slice(0,8).toUpperCase()} · {fmtDate(x.createdAt)}</p></div>
    <span>{naira(x.total)}</span>{x.status==='paid'&&<Link className="tlink" to={'/receipt/'+x.id}>Receipt ›</Link>}</div><Tracker o={x}/></div>)}</div></div>;}
