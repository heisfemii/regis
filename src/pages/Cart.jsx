import {useState} from 'react';import {useNavigate,Link} from 'react-router-dom';
import {useCart} from '../context/CartContext';import {useAuth} from '../context/AuthContext';import {useToast} from '../context/ToastContext';
import {createOrder,whatsappLink} from '../services/orders';import {naira} from '../services/config';
export default function Cart(){
 const {items,remove,clear,subtotal}=useCart(),{user,profile}=useAuth(),nav=useNavigate(),toast=useToast();
 const [use,setUse]=useState(false),[busy,setBusy]=useState(false);
 const avail=profile?.credits||0,applied=use?Math.min(avail,subtotal):0,total=subtotal-applied;
 if(!items.length)return <div className="center"><h2>Your cart is empty.</h2><p><Link className="tlink" to="/">Continue shopping ›</Link></p></div>;
 async function order(){
  if(!user)return nav('/login');
  setBusy(true);
  try{const o=await createOrder(user,profile?.name||user.displayName||'Customer',items,applied);clear();window.location.href=whatsappLink(o)}
  catch{toast('Could not place your order. Try again.');setBusy(false)}}
 return <div className="box wide"><h2>Your cart</h2>
  {items.map(i=><div className="arow" key={i.key}>{i.image?<img className="thumb" src={i.image} alt=""/>:<div className="thumb"/>}
   <div className="grow"><b>{i.name}</b><p className="muted">{i.color} · {i.strap} · x{i.qty}</p></div><span>{naira(i.price*i.qty)}</span><a href="#" aria-label="Remove" onClick={e=>{e.preventDefault();remove(i.key)}}>✕</a></div>)}
  <div className="row"><span>Subtotal</span><span>{naira(subtotal)}</span></div>
  {user&&avail>0&&<label className="row"><span><input type="checkbox" checked={use} onChange={e=>setUse(e.target.checked)}/> Use my credits ({naira(avail)})</span><span>-{naira(applied)}</span></label>}
  <div className="row"><b>Total</b><b>{naira(total)}</b></div>
  <button disabled={busy} onClick={order}>{user?'Order on WhatsApp':'Log in to order'}</button>
  <p className="muted">We confirm your payment on WhatsApp, then you can follow packaging and delivery in your account.</p></div>;}
