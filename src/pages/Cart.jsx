import {useState} from 'react';import {useNavigate} from 'react-router-dom';
import {useCart} from '../context/CartContext';import {useAuth} from '../context/AuthContext';import {useToast} from '../context/ToastContext';
import {createOrder,whatsappLink} from '../services/orders';import {naira} from '../services/config';
export default function Cart(){
 const {items,remove,clear,subtotal}=useCart(),{user,profile}=useAuth(),nav=useNavigate(),toast=useToast();
 const [use,setUse]=useState(false),[busy,setBusy]=useState(false);
 const avail=profile?.credits||0,applied=use?Math.min(avail,subtotal):0;
 if(!items.length)return <p className="center">Your cart is empty.</p>;
 async function order(){
  if(!user)return nav('/login');
  setBusy(true);
  try{const o=await createOrder(user,profile,items,applied);clear();window.location.href=whatsappLink(o);}
  catch{toast('Could not place order. Try again.');setBusy(false);}}
 return <div className="box"><h2>Your cart</h2>
  {items.map(i=><div className="row" key={i.id}><span>{i.name} <small>({i.color}, {i.strap}) x{i.qty}</small></span><span>{naira(i.price*i.qty)} <a href="#" onClick={e=>{e.preventDefault();remove(i.id)}}>✕</a></span></div>)}
  <div className="row"><span>Subtotal</span><span>{naira(subtotal)}</span></div>
  {user&&avail>0&&<label className="row"><span><input type="checkbox" checked={use} onChange={e=>setUse(e.target.checked)}/> Use my credits ({naira(avail)})</span><span>-{naira(applied)}</span></label>}
  <div className="row"><b>Total</b><b>{naira(subtotal-applied)}</b></div>
  <button disabled={busy} onClick={order}>{user?'Order Now on WhatsApp':'Log in to order'}</button>
  <p className="muted">Credits are added or deducted after we confirm your payment.</p></div>;}
