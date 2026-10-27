import {useEffect,useState} from 'react';import {useAuth} from '../context/AuthContext';import {myOrders} from '../services/orders';import {naira} from '../services/config';
export default function Account(){
 const {user,profile}=useAuth(),[o,setO]=useState([]);
 useEffect(()=>{myOrders(user.uid).then(setO).catch(()=>{})},[]);
 return <div className="box"><h2>Hi, {profile?.name}</h2><p className="credit">Credits: {naira(profile?.credits)}</p><h3>My orders</h3>
  {!o.length&&<p className="muted">No orders yet.</p>}
  {o.map(x=><div className="row" key={x.id}><span>#{x.id.slice(0,8).toUpperCase()} · {x.items.map(i=>i.name).join(', ')}</span><span>{naira(x.total)} · {x.status}</span></div>)}</div>;}
